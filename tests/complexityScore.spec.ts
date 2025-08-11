import {describe, it, expect} from 'vitest';
import {
  scoreComplexityStr,
  FACTORIAL_PATTERN,
  EXPONENTIAL_PATTERN,
  POLYNOMIAL_PATTERN,
  N_LOG_N_PATTERN,
  GRAPH_LINEAR_PATTERN,
  LOG_PATTERN,
  LINEAR_PATTERN,
  CONSTANT_PATTERN,
} from '@/stores/registry';

describe('scoreComplexityStr', () => {
  it('returns expected scores for known patterns', () => {
    expect(scoreComplexityStr('O(n!)')).toBe(100);
    expect(scoreComplexityStr('O(2^n)')).toBe(80);
    expect(scoreComplexityStr('O(n^2)')).toBe(30);
    expect(scoreComplexityStr('O(n log n)')).toBe(18);
    expect(scoreComplexityStr('O(V+E)')).toBe(14);
    expect(scoreComplexityStr('O(log n)')).toBe(10);
    expect(scoreComplexityStr('O(n)')).toBe(14);
    expect(scoreComplexityStr('O(1)')).toBe(1);
    expect(scoreComplexityStr('unknown')).toBe(0);
  });
});


describe('exported patterns', () => {
  const cases: [RegExp, string][] = [
    [FACTORIAL_PATTERN, 'n!'],
    [EXPONENTIAL_PATTERN, '2^n'],
    [POLYNOMIAL_PATTERN, 'n^3'],
    [N_LOG_N_PATTERN, 'nlogn'],
    [GRAPH_LINEAR_PATTERN, 'v+e'],
    [LOG_PATTERN, 'logn'],
    [LINEAR_PATTERN, 'n'],
    [CONSTANT_PATTERN, '1'],
  ];

  it('matches examples', () => {
    for (const [pattern, sample] of cases) {
      expect(pattern.test(sample)).toBe(true);
    }
  });
});
