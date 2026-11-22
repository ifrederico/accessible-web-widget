import { test } from 'node:test';
import assert from 'node:assert/strict';
import { smartContrastMethods as sc } from '../../src/features/smart-contrast.js';

const rgb = (r, g, b, a = 1) => ({ r, g, b, a });

test('parseCssColor reads rgb and rgba, and nothing else', () => {
  assert.deepEqual(sc.parseCssColor('rgb(1, 2, 3)'), rgb(1, 2, 3));
  assert.deepEqual(sc.parseCssColor('rgba(10, 20, 30, 0.5)'), rgb(10, 20, 30, 0.5));
  assert.deepEqual(sc.parseCssColor('rgb(10 20 30 / 50%)'), rgb(10, 20, 30, 0.5));
  assert.deepEqual(sc.parseCssColor('rgba(0, 0, 0, 0)'), rgb(0, 0, 0, 0));
  assert.equal(sc.parseCssColor('oklch(0.7 0.1 200)'), null);
  assert.equal(sc.parseCssColor('transparent'), null);
  assert.equal(sc.parseCssColor(''), null);
});

test('colorContrast matches the WCAG reference values', () => {
  assert.equal(sc.colorContrast(rgb(0, 0, 0), rgb(255, 255, 255)), 21);
  assert.equal(sc.colorContrast(rgb(255, 255, 255), rgb(255, 255, 255)), 1);
  // #767676 on white is the well-known lightest grey that passes AA.
  assert.ok(sc.colorContrast(rgb(118, 118, 118), rgb(255, 255, 255)) >= 4.5);
  assert.ok(sc.colorContrast(rgb(119, 119, 119), rgb(255, 255, 255)) < 4.5);
});

test('blendColors lays a see-through color over a solid one', () => {
  assert.deepEqual(sc.blendColors(rgb(0, 0, 0, 0.5), rgb(255, 255, 255)), rgb(127.5, 127.5, 127.5));
  assert.deepEqual(sc.blendColors(rgb(10, 20, 30), rgb(255, 255, 255)), rgb(10, 20, 30));
});

test('findReadableColor darkens text on a light background, just enough', () => {
  const white = rgb(255, 255, 255);
  const fixed = sc.findReadableColor(rgb(170, 170, 170), white, 4.5);
  const ratio = sc.colorContrast(fixed, white);
  assert.ok(ratio >= 4.5, `ratio ${ratio}`);
  assert.ok(ratio < 4.7, `no further than needed, got ${ratio}`);
  assert.ok(fixed.r < 170);
});

test('findReadableColor lightens text on a dark background', () => {
  const dark = rgb(20, 20, 20);
  const fixed = sc.findReadableColor(rgb(90, 90, 90), dark, 4.5);
  assert.ok(sc.colorContrast(fixed, dark) >= 4.5);
  assert.ok(fixed.r > 90);
});

test('findReadableColor keeps the hue of colored text', () => {
  const white = rgb(255, 255, 255);
  const fixed = sc.findReadableColor(rgb(255, 120, 120), white, 4.5);
  assert.ok(sc.colorContrast(fixed, white) >= 4.5);
  assert.ok(fixed.r > fixed.g && fixed.g === fixed.b, JSON.stringify(fixed));
});

test('findReadableColor always reaches the target, whatever the background', () => {
  for (let level = 0; level <= 255; level += 5) {
    const background = rgb(level, level, level);
    for (const target of [3, 4.5]) {
      const fixed = sc.findReadableColor(rgb(level, level, level), background, target);
      const ratio = sc.colorContrast(fixed, background);
      assert.ok(ratio >= target, `grey ${level} at ${target}: ${ratio}`);
    }
  }
});

test('parseGradientColors reads the stops of a gradient and refuses a picture', () => {
  assert.deepEqual(sc.parseGradientColors('none'), []);
  assert.deepEqual(
    sc.parseGradientColors('linear-gradient(rgb(255, 255, 255), rgba(0, 0, 0, 0.5))'),
    [rgb(255, 255, 255), rgb(0, 0, 0, 0.5)]
  );
  assert.equal(sc.parseGradientColors('url("photo.jpg")'), null);
  assert.equal(sc.parseGradientColors('linear-gradient(rgb(0, 0, 0), rgb(9, 9, 9)), url("photo.jpg")'), null);
  assert.equal(sc.parseGradientColors('linear-gradient(oklch(0.7 0.1 200), rgb(0, 0, 0))'), null);
});

test('colorExtremes keeps the lightest and the darkest', () => {
  assert.deepEqual(sc.colorExtremes([rgb(100, 100, 100), rgb(250, 250, 250), rgb(5, 5, 5)]), [rgb(250, 250, 250), rgb(5, 5, 5)]);
  assert.deepEqual(sc.colorExtremes([rgb(9, 9, 9)]), [rgb(9, 9, 9)]);
});

test('findReadableColorAcross passes against every background it is given', () => {
  const light = [rgb(255, 255, 255), rgb(238, 238, 238)];
  const fixed = sc.findReadableColorAcross(rgb(200, 200, 200), light, 4.5);
  assert.ok(sc.lowestContrast(fixed, light) >= 4.5);

  // White fading to black: one mid grey reads on both ends.
  const wide = [rgb(255, 255, 255), rgb(0, 0, 0)];
  const middle = sc.findReadableColorAcross(rgb(120, 120, 120), wide, 4.5);
  assert.ok(sc.lowestContrast(middle, wide) >= 4.5, JSON.stringify(middle));
});

test('findReadableColorAcross gives up when no color can do better', () => {
  // Nothing reads at 7:1 on both white and black, and mid grey is already the best there is.
  assert.equal(sc.findReadableColorAcross(rgb(118, 118, 118), [rgb(255, 255, 255), rgb(0, 0, 0)], 7), null);
});
