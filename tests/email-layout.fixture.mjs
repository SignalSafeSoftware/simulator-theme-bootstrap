import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import SimulatorDevice from '@signalsafe/simulator-device/SimulatorDevice';
import { isSimulatorDevicePayload } from '@signalsafe/simulator-core/devicePayloadGuards';
import approved from './fixtures/email-hr-handbook.json';

const parameters = new URLSearchParams(window.location.search);
const width = Number(parameters.get('width'));
if (![320, 430].includes(width)) throw new Error('Unsupported fixture width');
const value = structuredClone(approved);
if (parameters.get('variant') === 'stress') {
    Object.assign(value.email.detail, {
        to: 'employee-with-a-long-address@example.test',
        bcc: 'reviewer-with-a-long-address@example.test',
        body: Array.from({ length: 12 }, (_, index) => `Paragraph ${index + 1}: Review the original message and retain your security checks.`).join('\n\n'),
        links: [{ href: 'https://example.test/review', text: 'Review the complete verification information' }],
    });
}
if (!isSimulatorDevicePayload(value)) throw new Error('Invalid synthetic device fixture');
document.documentElement.style.fontSize = parameters.get('enlarged') === '1' ? '32px' : '16px';
const container = document.getElementById('root');
if (!container) throw new Error('Missing fixture mount');
createRoot(container).render(createElement('main', {
    className: 'simulator-root', style: { width, maxWidth: '100%', margin: '0 auto' },
}, createElement(SimulatorDevice, { value })));
