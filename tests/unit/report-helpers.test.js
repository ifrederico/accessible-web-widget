import { test } from 'node:test';
import assert from 'node:assert/strict';
import { axeReportMethods } from '../../src/features/axe-report.js';

const ctx = { ...axeReportMethods };

test('sanitizeUrl allows http(s) and encodes quotes', () => {
  assert.equal(ctx.sanitizeUrl('https://example.com/help'), 'https://example.com/help');
  assert.equal(ctx.sanitizeUrl('  http://example.com  '), 'http://example.com');
  assert.equal(ctx.sanitizeUrl('https://x.com/"onmouseover="alert(1)'), 'https://x.com/%22onmouseover=%22alert(1)');
  assert.equal(ctx.sanitizeUrl("https://x.com/'a"), 'https://x.com/%27a');
});

test('sanitizeUrl rejects non-http protocols and junk', () => {
  assert.equal(ctx.sanitizeUrl('javascript:alert(1)'), '');
  assert.equal(ctx.sanitizeUrl('data:text/html,x'), '');
  assert.equal(ctx.sanitizeUrl('//example.com'), '');
  assert.equal(ctx.sanitizeUrl(''), '');
  assert.equal(ctx.sanitizeUrl(null), '');
});

test('getViolationCounts tallies node counts by impact', () => {
  const results = {
    violations: [
      { impact: 'critical', nodes: [{}, {}] },
      { impact: 'serious', nodes: [{}] },
      { impact: 'moderate', nodes: [] },
      { impact: 'unknown-impact', nodes: [{}] },
      { impact: 'minor', nodes: [{}, {}, {}] }
    ]
  };
  assert.deepEqual(ctx.getViolationCounts(results), { critical: 2, serious: 1, moderate: 0, minor: 3 });
});

test('getViolationCounts tolerates missing or malformed input', () => {
  assert.deepEqual(ctx.getViolationCounts({}), { critical: 0, serious: 0, moderate: 0, minor: 0 });
  assert.deepEqual(ctx.getViolationCounts({ violations: 'nope' }), { critical: 0, serious: 0, moderate: 0, minor: 0 });
  assert.deepEqual(ctx.getViolationCounts(), { critical: 0, serious: 0, moderate: 0, minor: 0 });
});

test('capitalizeFirst', () => {
  assert.equal(ctx.capitalizeFirst('critical'), 'Critical');
  assert.equal(ctx.capitalizeFirst(''), '');
  assert.equal(ctx.capitalizeFirst(null), '');
});

test('getAxeRunOptions returns a copy, not the shared object', () => {
  const a = ctx.getAxeRunOptions();
  const b = ctx.getAxeRunOptions();
  assert.notEqual(a, b);
  assert.deepEqual(a, b);
  assert.ok(Array.isArray(a.runOnly));
});
