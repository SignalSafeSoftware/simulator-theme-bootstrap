# Releasing `@signalsafe/simulator-theme-bootstrap`

## Email layout patch — approved 2026-10-21

Theme 0.13.2 is a CSS-only compatible fix; Device 0.21.2 is the approved exact
`@signalsafe/simulator-theme-bootstrap: 0.13.2` dependency follow-up. Core 0.7.1 and
React 0.21.1 remain unchanged. Device 0.21.1 pins 0.13.1 and must not silently load
another theme through a second copy or an undocumented override.

Preparation evidence compares exact archives and runs the browser regression
against the unmodified public 0.13.1 archive (must fail) and the prepared 0.13.2
archive (must pass), while retaining existing smoke/appearance coverage gates. The new
Node 24 Chromium email-layout gate is also required by publication. Hosted checks,
Sonar and both actual host integrations remain explicit release gates.

Release approval was recorded on 2026-10-21. After required checks, publish and
download-verify theme first. Only then finalize the
Device registry locks with genuine 0.13.2 metadata and rerun frozen full checks,
packed/gallery checks and Sonar before publishing the dependency follow-up. Do
not fabricate future registry integrity values or reuse either existing tag.

## Coordinated release — approved 2026-10-21

| Package | Prepared version | Required simulator dependencies |
| --- | --- | --- |
| `@signalsafe/simulator-core` | `0.7.1` | none |
| `@signalsafe/simulator-theme-bootstrap` | `0.13.1` | none |
| `@signalsafe/simulator-react` | `0.21.1` | core `0.7.1`; optional default theme `^0.13.1` |
| `@signalsafe/simulator-device` | `0.21.1` | core `0.7.1`, React `0.21.1`, theme `0.13.1` (exact) |

These compatible patches preserve the existing public runtime API and shared UI.
React and the default theme must be adopted together: the corrected frame markup
requires the matching CSS. A custom theme remains an explicit host responsibility.
The optional theme peer does not install or require the default theme for unstyled
integrations. Node runtime support remains `>=19.0.0`; build tools use Node 22/24.

Publish core and theme first, then React, then device, only after explicit approval
and successful gated tag workflows. Download and verify each upstream registry
artifact before refreshing downstream Yarn locks and the device demo npm lock.
Future registry integrity values must never be fabricated. Before upstream
publication, coherent packed-artifact installs provide candidate evidence only;
frozen standalone registry installs remain a separate release gate.

Existing local host archives retain their recorded provenance until the approved
registry artifacts pass all host checks. Historical release notes below describe
their original checkpoints and do not authorize publication or host replacement.

Releases are produced by `.github/workflows/ci.yml` from a pushed `vX.Y.Z` tag. The tag must match `package.json`. Manual dispatch validates only; publication requires a matching version tag. Do not publish from a developer machine or move an existing release tag.

## Preparation

1. Review source, public exports, README, contract docs and CHANGELOG together. Include every release change and compatibility constraint.
2. Verify dependency availability in npm. Release simulator-core first, then simulator-react, then simulator-device. The CSS theme is independently publishable.
3. Refresh the committed Yarn lockfile for changed dependencies. No sibling `file:` or `link:` resolutions may be used for a standalone release.
4. Use Node 24 (CI also checks Node 22). Run strict typecheck, tests with coverage, build and `smoke:package` for runtime packages. For the CSS-only theme, run `smoke:package` and `publish:dry-run`. Device additionally requires `check:gallery` and `build:gallery`.
5. Inspect the packed file list and install into a clean temporary consumer. Runtime imports and TypeScript declarations must resolve without sibling repositories.
6. After explicit release approval and all acceptance gates pass, commit the complete release, then push main and the matching annotated tag. Watch all tag-run checks and the Publish job. Publication uses the repository's `NPM_TOKEN` secret.

## CI gates

All four packages run hosted Sonar scans; require their successful result before approving a release. Core and React publication explicitly depends on checks, coverage tests, scan, packed smoke and runtime compatibility. Device also runs gallery checks and its portable demo workflow. Its publish job depends on checks, tests, scan, packed smoke and runtime compatibility; theme publication depends on checks, scan and packed smoke. The coordinated release fixes the missing scan dependency in device and theme publication. Theme also tests its executable appearance API with coverage; CSS coverage is not represented as JavaScript test coverage. Do not bypass failed gates.

## Consumer adoption

Verify the exact version and registry integrity after the tag workflow succeeds. Update consumers to exact registry versions, regenerate their lockfiles, and run a clean install plus consumer validation. Remove local archives only after registry installation succeeds. Keep published tags immutable; corrections use a new version.

## Historical September 29 local-app migration checkpoint

Prepared versions are core `0.4.1`, React `0.17.0`, device `0.17.0` and theme
`0.10.0`. Inspection approval was recorded in PhoneMe before extraction.
The Node runtime contract remains unchanged.

Publish core first, then React, then device through matching version-tag CI;
theme can publish independently. Refresh React's registry Yarn lock after core
is available, and device's after core, React and theme are available. Those
unpublished upstream resolutions cannot yet be certified by a frozen registry
install. Never invent integrity values or substitute sibling paths in release
manifests. Run the registry smoke/runtime matrix and Sonar gates as documented
above before publication; local tarball validation is not registry evidence.

The `simulator-device/docs/examples/local-apps` example builds under React 18 and has
a browser workflow (`npm run test:browser`). Before publication, copy it to an
isolated temporary directory and install all four packed artifacts explicitly.
Its memory adapter intentionally resets on reload; durable storage, imports,
regional formatting and live services belong to the consuming application.

Core 0.4.0 failed its runtime release check; its tag remains unchanged. The corrected
core 0.4.1 release is the upstream dependency for React/device 0.17.0.
