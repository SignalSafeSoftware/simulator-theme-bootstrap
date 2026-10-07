import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const required = [
    'styles.css',
    'src/tokens.css',
    'src/primitives/buttons.css',
    'src/primitives/forms.css',
    'src/primitives/lists.css',
    'src/primitives/badges.css',
    'src/primitives/typography.css',
    'src/primitives/surfaces.css',
    'src/primitives/spacing.css',
    'src/device-shell.css',
    'src/host-device.css',
    'src/apps/phone-controls.css',
    'src/frame.css',
    'src/nav.css',
    'src/apps/screen-chrome.css',
    'src/apps/phone-shared.css',
    'src/apps/phone-history.css',
    'src/apps/phone-contacts.css',
    'src/apps/phone-dial.css',
    'src/apps/phone-incoming-call.css',
    'src/apps/phone-contact-detail.css',
    'src/apps/email.css',
    'src/apps/messages.css',
    'src/apps/home.css',
    'src/apps/settings.css',
    'src/diagnostics.css',
    'src/modals.css',
];

for (const file of required) {
    const path = join(root, file);
    const content = readFileSync(path, 'utf8');
    if (content.trim().length === 0) {
        throw new Error(`Expected non-empty CSS file: ${file}`);
    }
}

const entry = readFileSync(join(root, 'styles.css'), 'utf8');
for (const file of required.slice(1)) {
    if (!entry.includes(file.replace('src/', './src/'))) {
        throw new Error(`styles.css must import ${file}`);
    }
}

const tokens = readFileSync(join(root, 'src/tokens.css'), 'utf8');
for (const token of [
    '--simulator-screen-header-min-height',
    '--simulator-compose-action-size',
    '--simulator-nav-button-min-height',
    '--simulator-phone-dialer-call-bg',
    '--simulator-phone-history-row-columns',
]) {
    if (!tokens.includes(token)) {
        throw new Error(`Expected supported customization token: ${token}`);
    }
}

const chrome = readFileSync(join(root, 'src/apps/screen-chrome.css'), 'utf8');
const history = readFileSync(join(root, 'src/apps/phone-history.css'), 'utf8');
for (const hook of [
    '.simulator-screen__header-row',
    '.simulator-email__compose-action',
    '.simulator-messages__compose-action',
    '.simulator-home-settings__back-bar',
]) {
    if (!chrome.includes(hook)) {
        throw new Error(`Expected semantic presentation hook: ${hook}`);
    }
}
for (const hook of [
    '.simulator-phone-history-search',
    '.simulator-phone-history-entry',
    '.simulator-phone-history-row',
    '.simulator-phone-history-actions',
]) {
    if (!history.includes(hook)) {
        throw new Error(`Expected semantic history hook: ${hook}`);
    }
}

// Read the root palette so default action foregrounds remain legible on mint.
const token = (name) => {
    const value = tokens.match(new RegExp(`--${name}: ([^;]+);`))?.[1];
    if (!value) throw new Error(`Expected a default palette color for ${name}`);
    if (/^#[0-9a-f]{6}$/i.test(value)) return value;
    const reference = value.match(/^var\(--([a-z-]+)\)$/)?.[1];
    if (reference) return token(reference);
    throw new Error(`Unsupported default palette value: ${value}`);
};
const luminance = (hex) => {
    const channel = (offset) => {
        const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    return channel(1) * 0.2126 + channel(3) * 0.7152 + channel(5) * 0.0722;
};
for (const [foreground, background] of [
    ['simulator-text', 'simulator-bg'],
    ['simulator-muted', 'simulator-panel-bg'],
    ['simulator-accent', 'simulator-panel-bg'],
    ['simulator-nav-active-color', 'simulator-nav-active-bg'],
    ['simulator-phone-dialer-call-color', 'simulator-phone-dialer-call-bg'],
]) {
    const values = [luminance(token(foreground)), luminance(token(background))];
    const ratio = (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
    if (ratio < 4.5) throw new Error(`${foreground} against ${background}: ${ratio.toFixed(2)}:1 contrast`);
}

const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
for (const file of ['appearance.js', 'appearance.d.ts']) {
    if (!manifest.files.includes(file) || !readFileSync(join(root, file), 'utf8').trim()) {
        throw new Error(`Appearance package artifact missing: ${file}`);
    }
}
const appearanceExport = manifest.exports['./appearance'];
if (appearanceExport?.types !== './appearance.d.ts' || appearanceExport?.import !== './appearance.js') {
    throw new Error('Appearance must have explicit runtime and type exports.');
}
const appearance = await import('../appearance.js');
if (appearance.appearanceStyle(appearance.defaultAppearance)['--simulator-bg'] !== token('simulator-bg')) {
    throw new Error('Runtime and CSS appearance defaults must agree.');
}
console.log('simulator-theme-bootstrap smoke:package OK');
