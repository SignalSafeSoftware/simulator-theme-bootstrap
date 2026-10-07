const night = Object.freeze({
  id: 'night',
  background: '#17212b',
  accent: '#86d9c0',
});

/** Theme-owned palette values; hosts supply translated preset labels. */
export const appearancePresets = Object.freeze([
  Object.freeze({ id: 'sage', background: '#fcfdf9', accent: '#285b4e' }),
  Object.freeze({ id: 'ocean', background: '#f2f7fc', accent: '#175fa6' }),
  Object.freeze({ id: 'sand', background: '#fff8ed', accent: '#92541d' }),
  night,
]);

export const defaultAppearance = Object.freeze({
  background: night.background,
  accent: night.accent,
});

const APPEARANCE_TEXT_COLORS = Object.freeze({
  Dark: '#17211c',
  Light: '#ffffff',
  Fallback: '#000000',
});

/** @param {string} color */
function luminance(color) {
  /** @param {number} start */
  const linear = (start) => {
    const value = Number.parseInt(color.slice(start, start + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return linear(1) * 0.2126 + linear(3) * 0.7152 + linear(5) * 0.0722;
}

/**
 * Select the most legible foreground for a validated six-digit hex color.
 * The black fallback guarantees 4.5:1 when neither theme foreground qualifies.
 * @param {string} hex
 * @returns {string}
 */
export function appearanceTextColor(hex) {
  const background = luminance(hex);
  const green = luminance(APPEARANCE_TEXT_COLORS.Dark);
  const greenContrast =
    (Math.max(background, green) + 0.05) / (Math.min(background, green) + 0.05);
  const whiteContrast = 1.05 / (background + 0.05);
  if (Math.max(greenContrast, whiteContrast) < 4.5)
    return APPEARANCE_TEXT_COLORS.Fallback;
  return greenContrast > whiteContrast
    ? APPEARANCE_TEXT_COLORS.Dark
    : APPEARANCE_TEXT_COLORS.Light;
}

/**
 * Map an explicit appearance to scoped simulator tokens. Omit this style entirely
 * when no choice is saved to inherit current package defaults.
 * Hosts validate persisted colors and image URLs before calling this helper.
 * @param {import('./appearance.js').SimulatorAppearance} value
 * @returns {import('./appearance.js').AppearanceStyle}
 */
export function appearanceStyle(value) {
  const foreground = appearanceTextColor(value.background);
  const dark = foreground === '#ffffff';
  const surface = dark ? '#26333e' : '#edf0ed';
  const border = dark ? '#52606a' : '#c9d2ce';
  const muted = dark ? '#c2cbd1' : '#526159';
  /** @type {import('./appearance.js').AppearanceStyle} */
  const result = {
    colorScheme: dark ? 'dark' : 'light',
    '--simulator-content-bg': value.backgroundImage
      ? 'transparent'
      : value.background,
    '--simulator-background-image': value.backgroundImage
      ? `url("${value.backgroundImage}")`
      : 'none',
  };
  /** @param {string[]} names @param {string} colorValue */
  const assign = (names, colorValue) => {
    for (const name of names) result[`--${name}`] = colorValue;
  };
  assign(
    [
      'bs-body-bg',
      'simulator-bg',
      'simulator-contact-row-bg',
      'simulator-nav-bg',
    ],
    value.background,
  );
  assign(
    [
      'bs-body-color',
      'simulator-text',
      'simulator-screen-header-color',
      'simulator-input-color',
      'simulator-neutral-button-color',
      'simulator-phone-dialer-digit-color',
      'simulator-phone-dialer-key-color',
      'simulator-phone-dialer-number-color',
      'simulator-phone-dialer-backspace-color',
    ],
    foreground,
  );
  assign(
    [
      'bs-secondary-color',
      'simulator-muted',
      'simulator-nav-color',
      'simulator-input-placeholder-color',
      'simulator-phone-dialer-letters-color',
      'simulator-phone-dialer-disabled-color',
    ],
    muted,
  );
  assign(
    [
      'bs-secondary-bg',
      'bs-tertiary-bg',
      'simulator-panel-bg',
      'simulator-screen-header-bg',
      'simulator-input-bg',
      'simulator-neutral-button-bg',
      'simulator-call-control-bg',
      'simulator-avatar-bg',
      'simulator-phone-dialer-entry-bg',
      'simulator-phone-dialer-key-bg',
      'simulator-phone-dialer-disabled-bg',
      'bs-success-bg-subtle',
      'bs-primary-bg-subtle',
      'bs-danger-bg-subtle',
    ],
    surface,
  );
  assign(
    [
      'bs-border-color',
      'simulator-border',
      'simulator-border-strong',
      'simulator-contact-row-border-color',
      'simulator-nav-border-color',
      'simulator-input-border',
      'simulator-neutral-button-border',
      'simulator-phone-dialer-key-border',
      'simulator-phone-dialer-disabled-border',
    ],
    border,
  );
  assign(
    [
      'bs-primary',
      'bs-link-color',
      'bs-success-text-emphasis',
      'bs-primary-text-emphasis',
      'simulator-accent',
      'simulator-success',
      'simulator-nav-active-bg',
      'simulator-phone-dialer-call-bg',
    ],
    value.accent,
  );
  assign(
    ['simulator-nav-active-color', 'simulator-phone-dialer-call-color'],
    appearanceTextColor(value.accent),
  );
  result['--bs-danger-text-emphasis'] = dark ? '#ffb4b4' : '#a12020';
  return result;
}
