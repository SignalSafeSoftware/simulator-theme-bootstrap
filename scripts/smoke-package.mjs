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

console.log('simulator-theme-bootstrap smoke:package OK');
