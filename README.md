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

- **Slice 1 (current):** design tokens on `.simulator-root` and primitive utility classes (`simulator-btn*`, `simulator-input`, `simulator-list*`, `simulator-badge*`, layout/spacing/surface helpers).
- **Not included yet:** device shell layout, bottom nav chrome, app-specific screen layout, or host bridge selectors. Those remain in the consuming app until later extraction slices.

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
