import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../../src/constants/translations.js';
import { uiMethods } from '../../src/ui.js';

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

test('translate falls back from a regional tag to the primary dictionary', () => {
  const ctx = {
    ...uiMethods,
    translations: TRANSLATIONS,
    loadConfig() { return { lang: 'pt-BR' }; }
  };
  const label = Object.keys(TRANSLATIONS.en).find(key => TRANSLATIONS.pt[key] !== TRANSLATIONS.en[key]);
  assert.ok(label, 'expected at least one key translated differently in pt');
  assert.equal(ctx.translate(label), TRANSLATIONS.pt[label]);
});

test('no dictionary has empty translation values', () => {
  for (const [code, dictionary] of Object.entries(TRANSLATIONS)) {
    for (const [key, value] of Object.entries(dictionary)) {
      assert.ok(typeof value === 'string' && value.trim().length > 0, `${code}.${key} is empty`);
    }
  }
});

test('Spanish accessibility tool labels are fully translated', () => {
  const expected = {
    'Annotations': 'Anotaciones',
    'Text to Speech': 'Texto a voz',
    'Simplify Layout': 'Simplificar diseño',
    'Play': 'Reproducir',
    'Pause': 'Pausar',
    'Stop': 'Detener',
    'Reading...': 'Leyendo...',
    'Text Alignment': 'Alineación del texto',
    'Start': 'Inicio',
    'Center': 'Centro',
    'End': 'Final'
  };

  Object.entries(expected).forEach(([key, value]) => {
    assert.equal(TRANSLATIONS.es[key], value);
  });
});
