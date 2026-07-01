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

## What this package includes

- **Slice 1:** design tokens on `.simulator-root` and primitive utility classes.
- **Slice 2 (current):** device shell (`.simulator-device-shell*`), inner frame (`.simulator-shell__frame` / `__body`), package nav (`.simulator-device-nav*`), shell nav tabs, and local nav segments.
- **Not included yet:** app-specific screen layout, host bridge selectors, or DeliveryPlus page/preview chrome.

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
