# @signalsafe/simulator-theme-bootstrap

Bootstrap-token theme for SignalSafe simulator semantic classes emitted by `@signalsafe/simulator-device` and `@signalsafe/simulator-react`.

## Usage

Import the shared theme once. It includes the default PhoneMe Night palette and does not require a host Bootstrap or Bootswatch stylesheet:

```ts
import '@signalsafe/simulator-theme-bootstrap/styles.css';
```

Then render simulator components as usual:

```tsx
import { SimulatorDevice } from '@signalsafe/simulator-device/SimulatorDevice';

<SimulatorDevice value={simulatorJson} />
```

## Supported customization

Set tokens on a scoped `.simulator-root` to customize the simulator without overriding component selectors. Palette tokens include `--simulator-bg`, `--simulator-text`, `--simulator-muted`, `--simulator-panel-bg`, `--simulator-border`, `--simulator-border-strong`, `--simulator-accent`, `--simulator-danger`, and `--simulator-success`. Radius, navigation, headers, buttons, inputs, compose actions, contact detail, phone history, dialer, and device geometry use the corresponding `--simulator-*` token groups. Defaults provide the same PhoneMe presentation in every host. Application stylesheets must not copy these tokens or override shared component selectors; use explicit appearance configuration when the user selects a different appearance.

Row headers, compose actions, Settings back bars, and native history use `.simulator-screen__header-row`, `.simulator-email__compose-action`, `.simulator-messages__compose-action`, `.simulator-home-settings__back-bar`, and `.simulator-phone-history-{search,row,actions}`. Presentation selectors can therefore stay independent from accessible labels. The package supplies the accessible `:focus-visible` outline.

The `--simulator-nav-{bg,color,active-bg,active-color,button-radius}` values apply to device navigation, shell tabs, and local navigation. Device-nav padding, border, gap, height, typography, and icon size use the more specific `--simulator-nav-{padding,border-color,button-*,icon-font-size}` values.

The PhoneMe Night palette (dark surfaces and mint actions), Home clock panel and tile spacing, compose icon, navigation, full-width banners, avatars, and call controls are package defaults. No host recipe or external compose SVG is needed.

### Appearance settings

The optional `@signalsafe/simulator-theme-bootstrap/appearance` ESM subpath exports
`appearancePresets`, `defaultAppearance`, `appearanceStyle` and `appearanceTextColor`,
with TypeScript declarations. Presets carry stable IDs and colors; translate their labels
in the host or shared settings component. Import helpers from their owning subpath directly.

Apply `appearanceStyle(savedSelection)` to the scoped simulator root only when a user has
saved an explicit choice. With no saved choice, or after Reset, omit this style to inherit
the current shared default. The mapper emits `none` for an explicitly saved appearance
without a wallpaper, preserving that choice. Hosts validate persisted six-digit colors and
wallpaper URLs, manage storage and render storage errors; the theme has no persistence.

The shared settings sections grid owns the single page inset. Place Appearance, Screen
password, Region and formats and other cards directly inside `.simulator-settings__sections`.
Do not wrap those cards in another inset card.

## What this package includes

- Design tokens, primitive controls and semantic list groups.
- Device shell, inner frame, navigation and optional host bezel.
- Shared phone, contact, history, dialing, message, email and appearance layouts.
- Application branding, workspace/sidebar chrome and business logic remain host-owned.

## Requirements

- No React components, ThemeProvider, or browser storage.
- Optional dependency-free `appearance` helpers map explicit user selections to theme tokens.
- No Bootstrap JavaScript dependency.
- No npm dependency on Bootstrap — the theme maps `--simulator-*` tokens from `--bs-*` when present.

## Package layout

```
styles.css              # public entry (@import chain)
src/tokens.css
src/primitives/*.css
src/apps/home.css      # shared Home layout
```

## Optional host phone presentation (0.4)

The stylesheet includes scoped `.simulator-call-*`, `.simulator-contact-editor`, `.simulator-history-*` and `.simulator-screen-tile` classes for React's controlled components. Scenario and provider-driven call screens share these components and styles. Use the existing `.simulator-screen__header` / `__header-row` hooks for consistent headings.

Wrap a device in `.simulator-host-device` with a `.simulator-host-device__content` child to opt into a fixed host bezel and content scrolling. Configure `--simulator-host-width` (390px), `--simulator-host-height` (740px), `--simulator-host-mobile-height` (720px), `--simulator-host-border`, `--simulator-host-radius` (38px), `--simulator-host-shadow` and `--simulator-host-screen-padding` (overridden to zero by the shared edge-to-edge layout). Devices without this wrapper receive the same bezel from the device-shell rule; wrapped devices suppress the inner bezel.

Call color overrides: `--simulator-call-avatar-bg`, `--simulator-call-avatar-color`, `--simulator-call-status-color`, `--simulator-call-control-bg`, `--simulator-call-control-color`, `--simulator-call-danger`, `--simulator-call-selected`, `--simulator-call-digits-color`. Form fields use existing `--simulator-input-*` tokens. Branding, workspace layout and sidebar tools belong to the host. Keyboard focus is visible and call animation honors reduced motion.

## Contact editor layout (0.9.2)

Use `.simulator-contact-editor-layout` around a host-controlled editor inside a contact screen. Its width uses `--simulator-phone-content-pad-x` (12px by default), preventing centered flex shells from shrinking the form. Contact value groups have separate panels; photo actions are 44px square buttons. Icons come from simulator-react, not from this CSS package. The theme does not fetch data, upload photos, store settings, or call providers.

## Shared history, contact editor and plain pages (0.13.0)

- `.simulator-phone-history-screen` wraps the shared call-history layout. The search field, per-row Call button and summary title use the same tokens as the other screens.
- The shared contact editor screen reuses `.simulator-contact-editor-layout`; Back, Save and Delete follow the screen-header and button tokens.
- Add `.prototype-page--plain` to an app page that supplies its own padding; it removes the default content inset.
- Import the `appearance` subpath for palette presets and token mapping; the CSS itself stays data-free.

See [CHANGELOG.md](CHANGELOG.md) and [RELEASING.md](docs/RELEASING.md). This documentation patch follows 0.9.1 without moving its published tag.

## Local app migration (0.10.0, release candidate)

- Add scoped Vault, Photos, local Mail, settings and browser styles and plain error-list rows.
- Style call detail body media and number labels. Preserve existing semantic hooks and appearance tokens.
- Keep CSS imports consecutive and the final HTML `hidden` rule authoritative so overlays and scrolling retain their behavior.

This version is prepared locally; it is not a claim of registry publication. See
[RELEASING.md](docs/RELEASING.md) for the coordinated release order. PhoneMe validates
normal packed artifacts; installed package files are never patched.


## Shared contact details

`simulator-react/views/contacts/ContactDetailPanel` owns the read-only contact
layout used by scenario contacts, the portable demo, and PhoneMe. The theme styles
its photo header, identity card, actions, and labeled phone/email/postal groups.
The `simulator-contact-detail__content` wrapper supplies the single content inset;
headers remain flush to the screen. Hosts supply data and feature actions through
the panel's slots, without additional card styles or margins. Contact editing
continues to use the separate shared editor layout.
