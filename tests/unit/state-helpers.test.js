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
  textScaleLevels: [1.1, 1.25, 1.5]
};

test('resolveTextScale snaps stored values to a Font Size level', () => {
  assert.equal(scaleCtx.resolveTextScale(1.1), 1.1);
  assert.equal(scaleCtx.resolveTextScale(1.25), 1.25);
  assert.equal(scaleCtx.resolveTextScale(1.5), 1.5);
  // Values saved by the old slider land on the nearest level.
  assert.equal(scaleCtx.resolveTextScale(1.4), 1.5);
  assert.equal(scaleCtx.resolveTextScale(1.2), 1.25);
  assert.equal(scaleCtx.resolveTextScale(1.15), 1.1);
  assert.equal(scaleCtx.resolveTextScale(1.04), 1);
  assert.equal(scaleCtx.resolveTextScale(2), 1.5);
  // Percentages from older configs are read as percentages.
  assert.equal(scaleCtx.resolveTextScale(125), 1.25);
});

test('resolveTextScale treats 100% and below, and garbage, as off', () => {
  assert.equal(scaleCtx.resolveTextScale(1), 1);
  assert.equal(scaleCtx.resolveTextScale(0.8), 1);
  assert.equal(scaleCtx.resolveTextScale(-5), 1);
  assert.equal(scaleCtx.resolveTextScale(false), 1);
  assert.equal(scaleCtx.resolveTextScale(undefined), 1);
  assert.equal(scaleCtx.resolveTextScale('not a number'), 1);
});

test('getTextScaleLevel returns the level index, -1 when off', () => {
  assert.equal(scaleCtx.getTextScaleLevel(1.1), 0);
  assert.equal(scaleCtx.getTextScaleLevel(1.4), 2);
  assert.equal(scaleCtx.getTextScaleLevel(1), -1);
  assert.equal(scaleCtx.getTextScaleLevel(undefined), -1);
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

test('getCustomReadableFontUrl prefers per-font overrides and validates URLs', () => {
  const ctx = {
    ...coreFeatureMethods,
    options: { readableFontUrls: { legible: ' /fonts/a.woff2 ' }, dyslexiaFontUrl: '/fonts/d.woff' }
  };
  assert.equal(ctx.getCustomReadableFontUrl('legible'), '/fonts/a.woff2');
  // dyslexiaFontUrl remains the legacy alias for the dyslexic entry.
  assert.equal(ctx.getCustomReadableFontUrl('dyslexic'), '/fonts/d.woff');
  assert.equal(ctx.getCustomReadableFontUrl('lexend'), '');
  // Values that could break out of the url("...") wrapper are rejected.
  const hostile = { ...coreFeatureMethods, options: { readableFontUrls: { legible: 'x") } body { display:none' } } };
  assert.equal(hostile.getCustomReadableFontUrl('legible'), '');
});

const withSearch = (search, fn) => {
  const previous = globalThis.window;
  globalThis.window = { location: { search } };
  try {
    return fn();
  } finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  }
};

const devCtx = (options) => ({ ...stateMethods, options });

test('isDevToolsAllowed accepts only true or the string true', () => {
  assert.equal(devCtx({ devTools: true }).isDevToolsAllowed(), true);
  assert.equal(devCtx({ devTools: ' TRUE ' }).isDevToolsAllowed(), true);
  assert.equal(devCtx({ devTools: false }).isDevToolsAllowed(), false);
  assert.equal(devCtx({ devTools: 'false' }).isDevToolsAllowed(), false);
  assert.equal(devCtx({ devTools: 1 }).isDevToolsAllowed(), false);
  assert.equal(devCtx({}).isDevToolsAllowed(), false);
  assert.equal(devCtx(undefined).isDevToolsAllowed(), false);
});

test('isDevToolsRequested reads ?acc-dev unless it is false', () => {
  const ctx = devCtx({});
  assert.equal(withSearch('?acc-dev', () => ctx.isDevToolsRequested()), true);
  assert.equal(withSearch('?acc-dev=true', () => ctx.isDevToolsRequested()), true);
  assert.equal(withSearch('?acc-dev=1', () => ctx.isDevToolsRequested()), true);
  assert.equal(withSearch('?a=1&acc-dev', () => ctx.isDevToolsRequested()), true);
  assert.equal(withSearch('?acc-dev=false', () => ctx.isDevToolsRequested()), false);
  assert.equal(withSearch('', () => ctx.isDevToolsRequested()), false);
});

test('isDevMode needs both the owner key and the URL key', () => {
  assert.equal(withSearch('?acc-dev=true', () => devCtx({ devTools: true }).isDevMode()), true);
  assert.equal(withSearch('?acc-dev=true', () => devCtx({}).isDevMode()), false);
  assert.equal(withSearch('', () => devCtx({ devTools: true }).isDevMode()), false);
  assert.equal(withSearch('?acc-dev=false', () => devCtx({ devTools: true }).isDevMode()), false);
});
