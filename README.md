# @signalsafe/simulator-theme-bootstrap

CSS-only Bootstrap-token theme for SignalSafe simulator semantic classes emitted by `@signalsafe/simulator-device` and `@signalsafe/simulator-react`.

## Usage

Import the shared theme once. It includes the default PhoneMe palette and does not require a host Bootstrap or Bootswatch stylesheet:

```ts
import '@signalsafe/simulator-theme-bootstrap/styles.css';
```

Then render simulator components as usual:

```tsx
import { SimulatorDevice } from '@signalsafe/simulator-device';

<SimulatorDevice value={simulatorJson} />
```

## Supported customization

Set tokens on a scoped `.simulator-root` to customize the simulator without overriding component selectors. Palette tokens include `--simulator-bg`, `--simulator-text`, `--simulator-muted`, `--simulator-panel-bg`, `--simulator-border`, `--simulator-border-strong`, `--simulator-accent`, `--simulator-danger`, and `--simulator-success`. Radius, navigation, headers, buttons, inputs, compose actions, contact detail, phone history, dialer, and device geometry use the corresponding `--simulator-*` token groups. Defaults provide the same PhoneMe presentation in every host. Application stylesheets must not copy these tokens or override shared component selectors; use explicit appearance configuration when the user selects a different appearance.

Row headers, compose actions, Settings back bars, and native history use `.simulator-screen__header-row`, `.simulator-email__compose-action`, `.simulator-messages__compose-action`, `.simulator-home-settings__back-bar`, and `.simulator-phone-history-{search,row,actions}`. Presentation selectors can therefore stay independent from accessible labels. The package supplies the accessible `:focus-visible` outline.

The `--simulator-nav-{bg,color,active-bg,active-color,button-radius}` values apply to device navigation, shell tabs, and local navigation. Device-nav padding, border, gap, height, typography, and icon size use the more specific `--simulator-nav-{padding,border-color,button-*,icon-font-size}` values.

The PhoneMe palette, compose icon, navigation, full-width banners, avatars, and call controls are package defaults. No host recipe or external compose SVG is needed.

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

The stylesheet includes scoped `.simulator-call-*`, `.simulator-contact-editor`, `.simulator-history-*` and `.simulator-screen-tile` classes for React's controlled components. Scenario and provider-driven call screens share these components and styles. Use the existing `.simulator-screen__header` / `__header-row` hooks for consistent headings.

Wrap a device in `.simulator-host-device` with a `.simulator-host-device__content` child to opt into a fixed host bezel and content scrolling. Configure `--simulator-host-width` (390px), `--simulator-host-height` (740px), `--simulator-host-mobile-height` (720px), `--simulator-host-border`, `--simulator-host-radius` (38px), `--simulator-host-shadow` and `--simulator-host-screen-padding` (overridden to zero by the shared edge-to-edge layout). Devices without this wrapper receive the same bezel from the device-shell rule; wrapped devices suppress the inner bezel.

Call color overrides: `--simulator-call-avatar-bg`, `--simulator-call-avatar-color`, `--simulator-call-status-color`, `--simulator-call-control-bg`, `--simulator-call-control-color`, `--simulator-call-danger`, `--simulator-call-selected`, `--simulator-call-digits-color`. Form fields use existing `--simulator-input-*` tokens. Branding, workspace layout and sidebar tools belong to the host. Keyboard focus is visible and call animation honors reduced motion.

## Contact editor layout (0.9.2)

Use `.simulator-contact-editor-layout` around a host-controlled editor inside a contact screen. Its width uses `--simulator-phone-content-pad-x` (12px by default), preventing centered flex shells from shrinking the form. Contact value groups have separate panels; photo actions are 44px square buttons. Icons come from simulator-react, not from this CSS package. The theme does not fetch data, upload photos, store settings, or call providers.

See [CHANGELOG.md](CHANGELOG.md) and [RELEASING.md](RELEASING.md). This documentation patch follows 0.9.1 without moving its published tag.

## Local app migration (0.10.0, release candidate)

- Add scoped Vault, Photos, local Mail, settings and browser styles and plain error-list rows.
- Style call detail body media and number labels. Preserve existing semantic hooks and appearance tokens.
- Keep CSS imports consecutive and the final HTML `hidden` rule authoritative so overlays and scrolling retain their behavior.

This version is prepared locally; it is not a claim of registry publication. See
[RELEASING.md](RELEASING.md) for the coordinated release order. PhoneMe validates
normal packed artifacts; installed package files are never patched.
