# simulator-theme-bootstrap current-state summary

Prepared source version: **0.13.3** (updated 2026-11-11). This is not a claim of npm publication.

- Expose shared scrollbars and stable scrollbar space for bounded simulator panels.
- Preserve full-width SMS composers, shared call controls and responsive incoming-call layout.
- Retain the merged email normal-flow fix and its browser regression gate.

## Coordinated versions

| Package | Prepared version |
| --- | --- |
| `@signalsafe/simulator-core` | `0.7.2` |
| `@signalsafe/simulator-react` | `0.21.2` |
| `@signalsafe/simulator-device` | `0.21.3` |
| `@signalsafe/simulator-theme-bootstrap` | `0.13.3` |
| `@signalsafe/simulator-editor-react` | `0.1.0` |

The source includes the current GitHub main branch plus the reviewed local simulator work. Existing merged release fixes are preserved. Source manifests and packaged declarations use the coordinated version set. See [release preparation](release-2026-11-10.md) for dependency and verification status.

## Current verification and examples

4 package tests pass; all four executable-source coverage metrics are 100%. See [November 11 verification](verification-2026-11-11.md) for the coordinated 1,465-test result, public examples and remaining registry-release gates.


### Clean CI dependency installation — November 11

The browser-layout and Sonar jobs previously failed before testing because npm could not resolve the unpublished simulator-device 0.21.3 candidate. Development dependencies now use checked-in core 0.7.2, React 0.21.2, device 0.21.3 and theme 0.13.3 archives under `tests/vendor/npm`, with SHA-256 hashes in `manifest.json`. Root overrides keep transitive candidate dependencies on those same archives. The theme archive is a finite review snapshot used by the device dependency; layout tests load this checkout's theme source. Test archives are excluded from the published package.

A fresh clone passed npm ci --ignore-scripts, all four appearance tests with 100% statements/branches/functions/lines, smoke:package, publish:dry-run and the real Chromium email layout test at 320/430 pixels and 100%/200% text. Browser, coverage, Sonar and publication gates remain unchanged. Registry publication remains separate.
