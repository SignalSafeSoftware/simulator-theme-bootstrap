# @signalsafe/simulator-theme-bootstrap

CSS-only Bootstrap-token theme for SignalSafe simulator semantic classes emitted by `@signalsafe/simulator-device` and `@signalsafe/simulator-react`.

## Usage

Import the theme **after** Bootstrap or Bootswatch if your app relies on `--bs-*` CSS variables:

```ts
import '@signalsafe/simulator-theme-bootstrap/styles.css';
```

Then render simulator components as usual:

```tsx
import { SimulatorDevice } from '@signalsafe/simulator-device';

<SimulatorDevice value={simulatorJson} />
```

## Supported customization

Set tokens on a scoped `.simulator-root` to customize the simulator without overriding component selectors. Palette tokens include `--simulator-bg`, `--simulator-text`, `--simulator-muted`, `--simulator-panel-bg`, `--simulator-border`, `--simulator-border-strong`, `--simulator-accent`, `--simulator-danger`, and `--simulator-success`. Radius, navigation, headers, buttons, inputs, compose actions, contact detail, phone history, dialer, and device geometry use the corresponding `--simulator-*` token groups. Defaults preserve the package's existing presentation.

Row headers, compose actions, Settings back bars, and native history use `.simulator-screen__header-row`, `.simulator-email__compose-action`, `.simulator-messages__compose-action`, `.simulator-home-settings__back-bar`, and `.simulator-phone-history-{search,row,actions}`. Presentation selectors can therefore stay independent from accessible labels. Define the host's accessible `:focus-visible` outline explicitly.

The `--simulator-nav-{bg,color,active-bg,active-color,button-radius}` values apply to device navigation, shell tabs, and local navigation. Device-nav padding, border, gap, height, typography, and icon size use the more specific `--simulator-nav-{padding,border-color,button-*,icon-font-size}` values.

This abbreviated recipe captures PhoneMe's approved soft-green banners, compose icons, and square 48px navigation. PhoneMe also assigns the documented button, input, contact-detail, and dialer token groups in its scoped theme:

```css
.smartphone-device.simulator-root {
    --simulator-bg: #fcfdf9;
    --simulator-text: #263b35;
    --simulator-muted: #788771;
    --simulator-panel-bg: #edf2e7;
    --simulator-border: #e0e7d9;
    --simulator-border-strong: #d6e1ce;
    --simulator-accent: #285b4e;
    --simulator-nav-bg: #fcfdf9;
    --simulator-nav-color: #77866d;
    --simulator-nav-active-bg: #e8efdf;
    --simulator-nav-active-color: #285b4e;
    --simulator-nav-button-radius: 0;
    --simulator-nav-button-min-height: 48px;
    --simulator-nav-button-font-size: 10px;
    --simulator-nav-icon-font-size: 17px;
    --simulator-screen-header-bg: #edf2e7;
    --simulator-screen-header-radius: 12px;
    --simulator-screen-header-min-height: 56px;
    --simulator-screen-header-margin: 0 0 16px;
    --simulator-screen-header-padding: 14px;
    --simulator-screen-header-font-size: 24px;
    --simulator-screen-header-row-font-size: 24px;
    --simulator-screen-header-row-line-height: 28px;
    --simulator-screen-header-font-weight: 650;
    --simulator-screen-header-line-height: 28px;
    --simulator-screen-header-letter-spacing: -0.5px;
    --simulator-compose-action-size: 40px;
    --simulator-compose-action-padding: 0;
    --simulator-compose-action-font-size: 0;
    --simulator-compose-icon-size: 20px;
    --simulator-compose-icon-mask: url('/icons/compose.svg') center / contain no-repeat;
    --simulator-home-settings-back-bar-display: none;
}

.smartphone-device.simulator-root :is(button, input, textarea, select):focus-visible {
    outline: 3px solid #83b9a4;
    outline-offset: 3px;
}
```

## What this package includes

- Design tokens, primitive controls and semantic list groups.
- Device shell, inner frame, navigation and optional host bezel.
- Shared phone, contact, history, dialing, message, email and appearance layouts.
- Application branding, workspace/sidebar chrome and business logic remain host-owned.

## Requirements

- No React components, ThemeProvider, or runtime logic.
- No Bootstrap JavaScript dependency.
- No npm dependency on Bootstrap — the theme maps `--simulator-*` tokens from `--bs-*` when present.

## Package layout

```
styles.css              # public entry (@import chain)
src/tokens.css
src/primitives/*.css
```

## Optional host phone presentation (0.4)

The stylesheet includes scoped `.simulator-call-*`, `.simulator-contact-editor`, `.simulator-history-*` and `.simulator-screen-tile` classes for React's controlled components. Existing simulator defaults remain in place. Use the existing `.simulator-screen__header` / `__header-row` hooks for consistent headings.

Wrap a device in `.simulator-host-device` with a `.simulator-host-device__content` child to opt into a fixed host bezel and content scrolling. Configure `--simulator-host-width` (390px), `--simulator-host-height` (740px), `--simulator-host-mobile-height` (720px), `--simulator-host-border`, `--simulator-host-radius` (38px), `--simulator-host-shadow` and `--simulator-host-screen-padding` (12px). These rules do not affect consumers that omit this wrapper.

Call color overrides: `--simulator-call-avatar-bg`, `--simulator-call-avatar-color`, `--simulator-call-status-color`, `--simulator-call-control-bg`, `--simulator-call-control-color`, `--simulator-call-danger`, `--simulator-call-selected`, `--simulator-call-digits-color`. Form fields use existing `--simulator-input-*` tokens. Branding, workspace layout and sidebar tools belong to the host. Keyboard focus is visible and call animation honors reduced motion.

## Contact editor layout (0.9.2)

Use `.simulator-contact-editor-layout` around a host-controlled editor inside a contact screen. Its width uses `--simulator-phone-content-pad-x` (12px by default), preventing centered flex shells from shrinking the form. Contact value groups have separate panels; photo actions are 44px square buttons. Icons come from simulator-react, not from this CSS package. The theme does not fetch data, upload photos, store settings, or call providers.

See [CHANGELOG.md](CHANGELOG.md) and [RELEASING.md](RELEASING.md). This documentation patch follows 0.9.1 without moving its published tag.
