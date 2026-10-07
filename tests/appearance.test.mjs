import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  appearancePresets,
  appearanceStyle,
  appearanceTextColor,
  defaultAppearance,
} from '../appearance.js';

function luminance(hex) {
  const linear = (start) => {
    const value = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return linear(1) * 0.2126 + linear(3) * 0.7152 + linear(5) * 0.0722;
}
function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)];
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
}

test('provides immutable shared presets and a Night default matching CSS', () => {
  assert.deepEqual(
    appearancePresets.map(({ id }) => id),
    ['sage', 'ocean', 'sand', 'night'],
  );
  assert(Object.isFrozen(appearancePresets));
  for (const preset of appearancePresets) assert(Object.isFrozen(preset));
  assert(Object.isFrozen(defaultAppearance));
  const night = appearancePresets.find(({ id }) => id === 'night');
  assert.deepEqual(defaultAppearance, {
    background: night.background,
    accent: night.accent,
  });
  const tokens = readFileSync(
    new URL('../src/tokens.css', import.meta.url),
    'utf8',
  );
  assert(tokens.includes(`--bs-body-bg: ${defaultAppearance.background};`));
  assert(tokens.includes(`--simulator-accent: ${defaultAppearance.accent};`));
});

test('maps each preset to scoped tokens and readable text and selected actions', () => {
  for (const preset of appearancePresets) {
    const style = appearanceStyle(preset);
    assert.equal(style['--simulator-bg'], preset.background);
    assert.equal(style['--simulator-accent'], preset.accent);
    assert.equal(style['--simulator-nav-active-bg'], preset.accent);
    assert.equal(style['--simulator-phone-dialer-call-bg'], preset.accent);
    assert(contrast(style['--simulator-text'], preset.background) >= 4.5);
    assert(
      contrast(style['--simulator-nav-active-color'], preset.accent) >= 4.5,
    );
    assert.equal(
      style['--simulator-nav-active-color'],
      style['--simulator-phone-dialer-call-color'],
    );
    assert.equal(style['--simulator-background-image'], 'none');
  }
  assert.equal(appearanceStyle(defaultAppearance).colorScheme, 'dark');
  assert.equal(appearanceStyle(appearancePresets[0]).colorScheme, 'light');
});

test('uses a readable foreground for intermediate custom colors and every gray', () => {
  assert.equal(appearanceTextColor('#767676'), '#ffffff');
  const colors = ['#ff00ff', '#00ff00', '#0f3f7f', '#aacc11'];
  for (let gray = 0; gray < 256; gray++) {
    colors.push(`#${gray.toString(16).padStart(2, '0').repeat(3)}`);
  }
  for (const background of colors) {
    const style = appearanceStyle({ background, accent: background });
    assert(contrast(style['--simulator-text'], background) >= 4.5, background);
    assert(
      contrast(style['--simulator-nav-active-color'], background) >= 4.5,
      background,
    );
  }
});

test('maps a validated local wallpaper without mutating saved appearance', () => {
  const backgroundImage = 'data:image/png;base64,aGVsbG8=';
  const saved = Object.freeze({ ...defaultAppearance, backgroundImage });
  const style = appearanceStyle(saved);
  assert.equal(style['--simulator-content-bg'], 'transparent');
  assert.equal(
    style['--simulator-background-image'],
    `url("${backgroundImage}")`,
  );
  assert.equal(saved.backgroundImage, backgroundImage);
  const withoutImage = appearanceStyle(defaultAppearance);
  assert.equal(
    withoutImage['--simulator-content-bg'],
    defaultAppearance.background,
  );
  assert.equal(withoutImage['--simulator-background-image'], 'none');
});
