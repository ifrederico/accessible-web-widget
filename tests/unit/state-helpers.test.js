import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stateMethods } from '../../src/state.js';
import { coreFeatureMethods } from '../../src/features/core.js';
import { SUPPORTED_LANGUAGES } from '../../src/constants/translations.js';

const stateCtx = { ...stateMethods, widgetTheme: { buttonSize: '48px' } };

test('normalizeOffset parses arrays, strings, and single numbers', () => {
  assert.deepEqual(stateCtx.normalizeOffset([10, 20]), [10, 20]);
  assert.deepEqual(stateCtx.normalizeOffset('10, 20'), [10, 20]);
  assert.deepEqual(stateCtx.normalizeOffset('15'), [15, 15]);
  assert.deepEqual(stateCtx.normalizeOffset(12), [12, 12]);
  assert.deepEqual(stateCtx.normalizeOffset([10.6]), [11, 11]);
});

test('normalizeOffset rejects garbage', () => {
  assert.equal(stateCtx.normalizeOffset('abc'), undefined);
  assert.equal(stateCtx.normalizeOffset(''), undefined);
  assert.equal(stateCtx.normalizeOffset(null), undefined);
  assert.deepEqual(stateCtx.normalizeOffset(0), [0, 0]);
});

test('normalizeButtonSize handles numbers, units, and minimum size', () => {
  assert.equal(stateCtx.normalizeButtonSize(44), '44px');
  assert.equal(stateCtx.normalizeButtonSize(10), '24px');
  assert.equal(stateCtx.normalizeButtonSize('3rem'), '3rem');
  assert.equal(stateCtx.normalizeButtonSize('52'), '52px');
  assert.equal(stateCtx.normalizeButtonSize(''), '48px');
  assert.equal(stateCtx.normalizeButtonSize(undefined), '48px');
});

const langCtx = {
  ...stateMethods,
  supportedLanguages: SUPPORTED_LANGUAGES,
  getDefaultLanguage() { return 'en'; }
};

test('resolveSupportedLanguage maps regional tags to primary codes', () => {
  assert.equal(langCtx.resolveSupportedLanguage('pt-BR'), 'pt');
  assert.equal(langCtx.resolveSupportedLanguage('pt_BR'), 'pt');
  assert.equal(langCtx.resolveSupportedLanguage('pt'), 'pt');
});

test('resolveSupportedLanguage falls back for auto/empty/unsupported tags', () => {
  assert.equal(langCtx.resolveSupportedLanguage('auto'), 'en');
  assert.equal(langCtx.resolveSupportedLanguage(''), 'en');
  assert.equal(langCtx.resolveSupportedLanguage(undefined), 'en');
  assert.equal(langCtx.resolveSupportedLanguage('xx-YY'), 'en');
});

const scaleCtx = {
  ...coreFeatureMethods,
  textScaleMinPercent: 80,
  textScaleMaxPercent: 150,
  textScaleStepPercent: 5
};

test('clampTextScalePercent snaps to step and clamps to range', () => {
  assert.equal(scaleCtx.clampTextScalePercent(100), 100);
  assert.equal(scaleCtx.clampTextScalePercent(102), 100);
  assert.equal(scaleCtx.clampTextScalePercent(103), 105);
  assert.equal(scaleCtx.clampTextScalePercent(10), 80);
  assert.equal(scaleCtx.clampTextScalePercent(999), 150);
  assert.equal(scaleCtx.clampTextScalePercent('not a number'), 100);
});

test('getTextScalePercent accepts multipliers and percentages', () => {
  assert.equal(scaleCtx.getTextScalePercent(1.2), 120);
  assert.equal(scaleCtx.getTextScalePercent(0.9), 90);
  assert.equal(scaleCtx.getTextScalePercent(120), 120);
  assert.equal(scaleCtx.getTextScalePercent(false), 100);
  assert.equal(scaleCtx.getTextScalePercent(undefined), 100);
  assert.equal(scaleCtx.getTextScalePercent(-5), 100);
});

const langFlagCtx = (config) => ({
  ...stateMethods,
  fetchSavedConfig() { return JSON.stringify(config); }
});

test('getUserSelectedLanguage honors the langUserSelected flag', () => {
  // Explicit pick in the language menu always wins.
  assert.equal(langFlagCtx({ lang: 'de', langUserSelected: true }).getUserSelectedLanguage(), 'de');
  // New-scheme auto-saves must not outrank embed config / <html lang>.
  assert.equal(langFlagCtx({ lang: 'de', langUserSelected: false }).getUserSelectedLanguage(), null);
  assert.equal(langFlagCtx({}).getUserSelectedLanguage(), null);
});

test('getUserSelectedLanguage treats legacy flagless configs as user-selected', () => {
  // Pre-1.4.0 configs saved lang without the flag and the saved value always
  // won; upgrading must not switch languages on returning visitors.
  assert.equal(langFlagCtx({ lang: 'de' }).getUserSelectedLanguage(), 'de');
});
