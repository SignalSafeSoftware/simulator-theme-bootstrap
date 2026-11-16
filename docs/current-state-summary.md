# Current state

## Unpublished follow-up — 2026-11-15

Remove the extra shell body inset when a shared simulator-app-page owns its own header and content spacing. Preserve the default PhoneMe theme and shared scrolling behavior. Lesson column sizing remains owned by DeliveryPlus, not by this theme.

Local review artifact: **0.13.5-mail-ui.0**. This is not an npm release or a package.json version bump. The coordinated set is core `0.7.3-mail-ui.0`, React `0.21.3-mail-ui.0`, device `0.21.5-mail-ui.0`, theme `0.13.5-mail-ui.0`; DeliveryPlus records their checksums in its opt-in vendor manifest. Production registry references remain separate.

4 appearance tests and package smoke passed at the implementation checkpoint. Live gallery geometry was checked at 320/430 pixels and 100%/200% text; no new coverage percentage is claimed.

Coordinated live verification covered administration lesson playback, the full simulator authoring editor, PhoneMe with an isolated synthetic database, and workspace's saved lesson reader. The gallery exercised 144 unique screen/state/width/text combinations. DeliveryPlus additionally passed 48 narrow layout cases after fixing its host wrapper (three sizes, two positions, four widths, editor and reader). No real messages or calls were sent. Existing test lessons were restored or archived.

For detailed receipts and limitations see DeliveryPlus `docs/quality/simulator-ui/verification.md` and the coordinated project summary dated 2026-11-15. Historical release coverage below belongs to the November 11 checkpoint; it is not a fresh coverage claim for these changes. Publication, registry adoption and release-gate reruns remain separate work.

### Documentation and regression follow-up

4 appearance tests and package smoke pass. Geometry behavior remains covered by the recorded live browser matrix; this documentation/test follow-up does not claim a new browser run or coverage percentage.

The review archives were not rebuilt for these documentation/test-only changes. Rebuild and rerun publication gates before a release.

## Published checkpoint — 2026-11-11


Published npm version **0.13.4**, released through the fully gated GitHub tag workflow on November 11, 2026.

## Coordinated public references

| Package | Registry version |
| --- | --- |
| Core | 0.7.2 |
| React | 0.21.2 |
| Device | 0.21.4 |
| Theme | 0.13.4 |

Package manifests and examples select these public registry versions. The private editor example keeps only the editor itself as a checked archive. Historical candidate reports remain in the release/verification documents; they describe prior states, not current dependency requirements.

## Verification

4 executable-source tests pass with 100% statements, branches, functions and lines. Strict types, lint, formatting, build and packed-consumer checks pass where applicable. Theme additionally passes real Chromium layout checks. The device example passes 16 browser tests and the private editor example passes 4.

Device 0.21.3 was blocked by a stale local Yarn lock resolution; its tag was retained. Device 0.21.4 was verified from a fresh checkout and empty cache, and its release guard rejects file/link lock resolutions. Theme 0.13.4 preserves the existing scrollbar patch without reverting newer shared layout fixes.

## Links

- [Repository](https://github.com/SignalSafeSoftware/simulator-theme-bootstrap)
- [Editor example](https://signalsafesoftware.github.io/simulator-editor-react/)
- [Device example](https://signalsafesoftware.github.io/simulator-device/)
- [Related packages](links.md)
