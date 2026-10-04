# Changelog

## 0.12.0-cleanup.3 (local, unpublished)

Remove legacy conversion, wire and presentation aliases; migrate consumers to canonical contracts. See MIGRATION.md.

## Unreleased — shared PhoneMe UI

- Use one shared call view, avatar/navigation primitives, and full-width history-row presentation across scenario and provider hosts.
- Move the default PhoneMe palette and screen layout into the theme package; preserve host data, callbacks, and explicit appearance configuration.
- Verify narrow devices and enlarged text, and prevent duplicate message actions when shell navigation renders them.
- Local `ui` prereleases are packed integration artifacts, not registry releases.

## 0.10.0 — prepared September 29, 2026 (unpublished)

- Add scoped Vault, Photos, local Mail, settings and browser styles and plain error-list rows.
- Style call detail body media and number labels. Preserve existing semantic hooks and appearance tokens.
- Keep CSS imports consecutive and the final HTML `hidden` rule authoritative so overlays and scrolling retain their behavior.

- Require an exact version-tag match before CI publication; manual dispatch validates only.

## 0.9.2 — 2026-09-16

- Complete release documentation and include changelog/release instructions in the package.
- Document shared editor width, grouped cards and 44px photo actions introduced in 0.9.1.
- Clarify CSS-only ownership, supported source hooks and host customization boundaries.

## 0.9.1 — 2026-09-16

- Publish the shared contact editor/group/photo-action layout, appearance styles, dial/history refinements and wallpaper tokens.
- Release notes were completed in 0.9.2; the existing 0.9.1 tag remains immutable.


## 0.4.1 — 2026-09-11

- Make native heading text inside shared header rows inherit the row typography tokens and reset heading margins, avoiding competing browser defaults.

## 0.4.0 — 2026-09-11

- Add opt-in host bezel/scrolling and scoped controlled call, contact editor, history and Home tile styles.
- Include reviewed screen-header, compose, navigation and row token hooks used by PhoneMe local prereleases.
- Preserve default classes and host token overrides; include reduced-motion and focus treatments.
