import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../../src/constants/translations.js';

test('every supported language has a translation dictionary', () => {
  const dictionaryCodes = Object.keys(TRANSLATIONS);
  SUPPORTED_LANGUAGES.forEach(({ code }) => {
    assert.ok(dictionaryCodes.includes(code), `missing dictionary for ${code}`);
  });
});

test('every dictionary covers the full English key set', () => {
  const englishKeys = Object.keys(TRANSLATIONS.en);
  for (const [code, dictionary] of Object.entries(TRANSLATIONS)) {
    if (code === 'en') continue;
    const missing = englishKeys.filter(key => !(key in dictionary));
    assert.deepEqual(missing, [], `${code} is missing keys: ${missing.join(', ')}`);
  }
});

test('no dictionary has empty translation values', () => {
  for (const [code, dictionary] of Object.entries(TRANSLATIONS)) {
    for (const [key, value] of Object.entries(dictionary)) {
      assert.ok(typeof value === 'string' && value.trim().length > 0, `${code}.${key} is empty`);
    }
  }
});
