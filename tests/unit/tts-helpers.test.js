import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ttsMethods } from '../../src/features/tts.js';

const ctx = { ...ttsMethods, nativeTtsConfig: {} };

test('normalizeReadableText collapses whitespace and trims', () => {
  assert.equal(ctx.normalizeReadableText('  Hello \n\t world  '), 'Hello world');
  assert.equal(ctx.normalizeReadableText('a ,b .c'), 'a,b.c');
  assert.equal(ctx.normalizeReadableText(''), '');
  assert.equal(ctx.normalizeReadableText(null), 'null');
});

test('normalizeSpeechLanguage maps known codes to regional tags', () => {
  assert.equal(ctx.normalizeSpeechLanguage('en'), 'en-US');
  assert.equal(ctx.normalizeSpeechLanguage('pt'), 'pt-BR');
  assert.equal(ctx.normalizeSpeechLanguage('AR'), 'ar-SA');
  assert.equal(ctx.normalizeSpeechLanguage('he'), 'he-IL');
  assert.equal(ctx.normalizeSpeechLanguage('ja'), 'ja');
  assert.equal(ctx.normalizeSpeechLanguage(''), 'en-US');
  assert.equal(ctx.normalizeSpeechLanguage(undefined), 'en-US');
});

test('splitLongSpeechSegment keeps short segments whole', () => {
  assert.deepEqual(ctx.splitLongSpeechSegment('short sentence'), ['short sentence']);
  assert.deepEqual(ctx.splitLongSpeechSegment(''), []);
});

test('splitLongSpeechSegment splits long segments under the limit', () => {
  const words = Array.from({ length: 100 }, (_, i) => `word${i}`).join(' ');
  const parts = ctx.splitLongSpeechSegment(words, 240);
  assert.ok(parts.length > 1);
  parts.forEach(part => assert.ok(part.length <= 240));
  assert.equal(parts.join(' ').replace(/\s+/g, ' '), words);
});

test('buildSpeechQueue chunks paragraphs and respects the cap', () => {
  const queue = ctx.buildSpeechQueue('First sentence. Second sentence.\n\nNew paragraph here.');
  assert.ok(queue.length >= 1);
  queue.forEach(chunk => assert.ok(chunk.length <= 240));
  assert.deepEqual(ctx.buildSpeechQueue(''), []);
  const huge = Array.from({ length: 400 }, (_, i) => `Sentence number ${i} is long enough to be its own chunk of text padding padding padding padding padding padding padding padding padding padding padding padding padding padding padding.`).join('\n\n');
  assert.ok(ctx.buildSpeechQueue(huge).length <= 300);
});

test('getNativeTtsRate and getNativeTtsPitch clamp and default', () => {
  const make = (rate, pitch) => ({ ...ttsMethods, nativeTtsConfig: { rate, pitch } });
  assert.equal(make(undefined, undefined).getNativeTtsRate(), 1);
  assert.equal(make(0.1, 0).getNativeTtsRate(), 0.5);
  assert.equal(make(9, 9).getNativeTtsRate(), 2);
  assert.equal(make('1.5', '1.5').getNativeTtsRate(), 1.5);
  assert.equal(make(1, undefined).getNativeTtsPitch(), 1);
  assert.equal(make(1, -3).getNativeTtsPitch(), 0);
  assert.equal(make(1, 9).getNativeTtsPitch(), 2);
});
