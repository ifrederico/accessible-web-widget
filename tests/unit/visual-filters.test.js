import { test } from 'node:test';
import assert from 'node:assert/strict';
import { visualFilterMethods } from '../../src/features/visual-filters.js';

// computeFilteredBodyColor reads the body background through
// getComputedStyle; stub just enough of the DOM to feed it a color.
const withBodyColor = (color, fn) => {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  globalThis.window = { getComputedStyle: () => ({ backgroundColor: color }) };
  globalThis.document = { body: {} };
  try {
    return fn();
  } finally {
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
  }
};

const bodyColor = (color, filterKey) => withBodyColor(color, () => visualFilterMethods.computeFilteredBodyColor(filterKey));

test('monochrome turns a colored body background gray', () => {
  assert.equal(bodyColor('rgb(200, 40, 40)', 'monochrome'), 'rgb(74,74,74)');
});

test('monochrome weights the channels by luminance, not a plain average', () => {
  // 0.7152 * 128 = 91.5 rounds to 92; an unweighted mean would give 43.
  assert.equal(bodyColor('rgb(0, 128, 0)', 'monochrome'), 'rgb(92,92,92)');
});
