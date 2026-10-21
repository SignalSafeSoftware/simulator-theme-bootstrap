import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { build } from 'vite';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const themeRoot = resolve(process.env.EMAIL_LAYOUT_THEME_ROOT ?? root);
const evidenceDirectory = process.env.EMAIL_LAYOUT_EVIDENCE_DIR;
const tolerance = 1;
function fixture() {
    return '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/styles.css"></head><body style="margin:0"><div id="root"></div><script src="/fixture.js"></script></body></html>';
}

async function stylesheets(directory) {
    const files = new Map();
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const absolute = join(directory, entry.name);
        if (entry.isDirectory()) {
            for (const [key, value] of await stylesheets(absolute)) files.set(key, value);
        } else if (entry.isFile() && entry.name.endsWith('.css')) {
            files.set('/' + relative(themeRoot, absolute).split('\\').join('/'), await readFile(absolute));
        }
    }
    return files;
}

async function serverFixture() {
    const css = await stylesheets(join(themeRoot, 'src'));
    css.set('/styles.css', await readFile(join(themeRoot, 'styles.css')));
    const bundle = await build({
        configFile: false, logLevel: 'silent', define: { 'process.env.NODE_ENV': JSON.stringify('production') },
        build: { write: false, minify: false, lib: { entry: join(root, 'tests/email-layout.fixture.mjs'), name: 'EmailLayoutFixture', formats: ['iife'] } },
    });
    const outputs = Array.isArray(bundle) ? bundle[0].output : bundle.output;
    const script = outputs.find((output) => output.type === 'chunk' && output.isEntry);
    assert.ok(script, 'The real Device fixture must build');
    const server = createServer((request, response) => {
        const url = new URL(request.url, 'http://localhost');
        if (url.pathname === '/fixture') {
            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.end(fixture());
        } else if (url.pathname === '/fixture.js') {
            response.setHeader('Content-Type', 'text/javascript');
            response.end(script.code);
        } else if (css.has(url.pathname)) {
            response.setHeader('Content-Type', 'text/css');
            response.end(css.get(url.pathname));
        } else {
            response.writeHead(404).end();
        }
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    return { server, origin: `http://127.0.0.1:${address.port}` };
}

async function geometry(page) {
    return page.evaluate(() => {
        const detail = document.querySelector('.simulator-email__message-detail');
        const scroll = detail.querySelector(':scope > .simulator-overflow-auto');
        const rect = (element) => {
            const bounds = element.getBoundingClientRect();
            const viewport = scroll.getBoundingClientRect();
            return {
                tag: element.tagName, top: bounds.top - viewport.top + scroll.scrollTop,
                bottom: bounds.bottom - viewport.top + scroll.scrollTop,
                left: bounds.left, right: bounds.right, height: bounds.height,
                width: bounds.width, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth,
            };
        };
        return {
            fields: [...detail.querySelectorAll('.simulator-field')].map(rect),
            extras: [...detail.querySelectorAll('.simulator-email__message-detail-extras')].map(rect),
            controls: [...detail.querySelectorAll('input, textarea, .simulator-email__message-detail-extras button, .simulator-email__message-detail-extras span')].map(rect),
            nav: document.querySelector('.simulator-device-nav').getBoundingClientRect().toJSON(),
            device: document.querySelector('.simulator-device-shell').getBoundingClientRect().toJSON(),
            header: detail.querySelector('.simulator-screen__header').getBoundingClientRect().toJSON(),
            scroll: { viewportTop: scroll.getBoundingClientRect().top, viewportBottom: scroll.getBoundingClientRect().bottom, top: scroll.scrollTop, height: scroll.clientHeight, total: scroll.scrollHeight, left: scroll.getBoundingClientRect().left, right: scroll.getBoundingClientRect().right },
            body: rect(detail.querySelector('textarea')),
            deviceHeight: document.querySelector('.simulator-device-shell').getBoundingClientRect().height,
            group: rect(scroll.firstElementChild),
        };
    });
}

function assertFlow(result) {
    assert.equal(result.fields.length, 5, 'From, To, Bcc, Subject and Body must remain present');
    assert.ok(result.extras.length >= 1, 'Attachment controls must remain present');
    const ordered = [...result.fields, ...result.extras];
    for (let index = 1; index < ordered.length; index += 1) {
        assert.ok(ordered[index].top >= ordered[index - 1].bottom - tolerance,
            `Content overlaps at index ${index}: ${JSON.stringify(result)}`);
    }
    assert.ok(result.group.bottom >= result.body.bottom - tolerance, 'The field group must contain its body');
    assert.ok(result.scroll.height > 0 && result.scroll.height < result.deviceHeight, 'The message needs a bounded device scrollport');
    assert.ok(result.scroll.viewportTop >= result.header.bottom - tolerance && result.scroll.viewportBottom <= result.nav.top + tolerance, 'The header and navigation must not overlap the message scrollport');
    assert.ok(result.nav.bottom <= result.device.bottom + tolerance, 'Navigation must remain inside the device');
    assert.ok(result.body.height > 30, 'The body must not collapse');
    for (const control of result.controls) {
        assert.ok(control.left >= result.scroll.left - tolerance && control.right <= result.scroll.right + tolerance, 'Child controls must stay within the scrollport');
        if (control.tag !== 'INPUT') assert.ok(control.scrollWidth <= control.clientWidth + tolerance, 'Wrapping child text must not clip horizontally');
    }
}

async function assertReadonlyValues(page) {
    // Native single-line readonly inputs scroll long values instead of wrapping.
    for (const input of await page.locator('.simulator-email__message-detail input').all()) {
        await input.evaluate((element) => {
            element.scrollLeft = element.scrollWidth;
            if (element.scrollWidth > element.clientWidth + 1 && element.scrollLeft === 0) throw new Error('Long readonly field value cannot be reached');
            element.scrollLeft = 0;
        });
    }
}

async function assertScenario(browser, origin, scenario) {
    const { width, enlarged, variant } = scenario;
    const page = await browser.newPage({ viewport: { width: 800, height: 1000 } });
    try {
        page.on('pageerror', (error) => console.error(error.message));
        await page.goto(`${origin}/fixture?width=${width}&enlarged=${enlarged ? 1 : 0}&variant=${variant}`);
        await page.getByRole('textbox', { name: 'From', exact: true }).waitFor();
        await assertReadonlyValues(page);
        const first = await geometry(page);
        assertFlow(first);
        const scroll = page.locator('.simulator-email__message-detail > .simulator-overflow-auto');
        await scroll.evaluate((element) => { element.scrollTop = element.scrollHeight; });
        const last = await geometry(page);
        assertFlow(last);
        assert.ok(last.scroll.top + last.scroll.height >= last.scroll.total - tolerance, 'The final attachment row must be scroll-reachable');
        const download = page.getByRole('button', { name: 'Download attachment', exact: true });
        await download.scrollIntoViewIfNeeded();
        const attachment = await download.boundingBox();
        const port = await scroll.boundingBox();
        assert.ok(attachment && port && attachment.y >= port.y - tolerance && attachment.y + attachment.height <= port.y + port.height + tolerance, 'Download attachment must be visible within the scrollport');
        if (evidenceDirectory) {
            await mkdir(evidenceDirectory, { recursive: true });
            await page.screenshot({ path: join(evidenceDirectory, `${width}-${enlarged ? 200 : 100}-${variant}-bottom.png`) });
        }
        await scroll.evaluate((element) => { element.scrollTop = 0; });
        const restored = await geometry(page);
        assert.equal(restored.scroll.top, 0, 'From must remain reachable again');
        const from = await page.getByRole('textbox', { name: 'From', exact: true }).boundingBox();
        assert.ok(from && from.y >= restored.scroll.viewportTop - tolerance && from.y + from.height <= restored.scroll.viewportBottom + tolerance, 'From must be visible when restored to the top');
        assert.deepEqual(restored.nav, first.nav, 'Scrolling message content must not move its navigation');
        if (evidenceDirectory) {
            await mkdir(evidenceDirectory, { recursive: true });
            const name = `${width}-${enlarged ? 200 : 100}-${variant}`;
            await writeFile(join(evidenceDirectory, `${name}.json`), JSON.stringify({ scenario, first, last }, null, 2));
            await page.screenshot({ path: join(evidenceDirectory, `${name}.png`) });
        }
        console.log(JSON.stringify({ width, textPercent: enlarged ? 200 : 100, variant, fields: first.fields.length, extras: first.extras.length, scrollHeight: last.scroll.total }));
    } finally {
        await page.close();
    }
}

test('actual shared email fields, body and extras remain ordered and reachable', async () => {
    const { server, origin } = await serverFixture();
    const browser = await chromium.launch();
    try {
        const scenarios = [320, 430].flatMap((width) => [false, true].flatMap((enlarged) => ['approved', 'stress'].map((variant) => ({ width, enlarged, variant }))));
        for (const scenario of scenarios) await assertScenario(browser, origin, scenario);
    } finally {
        await browser.close();
        server.closeAllConnections();
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
});
