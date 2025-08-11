import {defineStore} from 'pinia';
import type {AlgoModule} from '@/types/step';

export const FACTORIAL_PATTERN = /(?:n!|factorial)/;
export const EXPONENTIAL_PATTERN = /(?:\d+\^n|n\^n)/;
export const POLYNOMIAL_PATTERN = /n\^(\d+(?:\.\d+)?)/;
export const N_LOG_N_PATTERN = /(?:nlogn|n\*logn|nlog\(n\)|n\*log\(n\)|vlogv|elogv|e\*logv|v\*logv)/;
export const GRAPH_LINEAR_PATTERN = /(?:v\+e)/;
export const LOG_PATTERN = /(?:\blogn\b|log\(n\))/;
export const LINEAR_PATTERN = /(?:\bn\b|\bv\b|\be\b)/;
export const CONSTANT_PATTERN = /\b1\b/;

interface ScoreRule {
  pattern: RegExp;
  score: number | ((m: RegExpMatchArray) => number);
}

export const SCORE_RULES: ScoreRule[] = [
  {pattern: FACTORIAL_PATTERN, score: 100},
  {pattern: EXPONENTIAL_PATTERN, score: 80},
  {
    pattern: POLYNOMIAL_PATTERN,
    score: (m) => {
      const k = parseFloat(m[1]);
      return isFinite(k) ? 20 + k * 5 : 0;
    },
  },
  {pattern: N_LOG_N_PATTERN, score: 18},
  {pattern: GRAPH_LINEAR_PATTERN, score: 14},
  {pattern: LOG_PATTERN, score: 10},
  {pattern: LINEAR_PATTERN, score: 14},
  {pattern: CONSTANT_PATTERN, score: 1},
];

/**
 * Big-O 표기 문자열을 대략적인 '나쁨 점수'로 환산한다.
 * 값이 클수록 성능이 안 좋은 것으로 간주한다.
 * - O(1): 1
 * - O(log n): 10
 * - O(n): 14
 * - O(n log n) / O(V log V) / O(E log V): 18
 * - O(n^k): 20 + 5k (예: n^2 -> 30)
 * - O(2^n), O(n^n): 80
 * - O(n!): 100
 * - O(V+E): 14
 * - 알 수 없는 표기: 0
 */
export function scoreComplexityStr(raw?: string): number {
  if (!raw || typeof raw !== 'string') return 0;
  let s = raw.toLowerCase().trim();
  s = s.replace(/\s+/g, '');
  // O(...), Θ(...), Ω(...) 제거
  s = s.replace(/^(?:o|θ|omega|\u0398|\u03a9)\(|\)$/gi, '');

  for (const rule of SCORE_RULES) {
    const match = s.match(rule.pattern);
    if (match) {
      return typeof rule.score === 'number' ? rule.score : rule.score(match);
    }
  }

  // 기타(비교 불가) -> 0
  return 0;
}

function descriptorScore(d: any): number {
  const c = d?.complexity || {};
  const s = c.average ?? c.worst ?? c.best;
  return scoreComplexityStr(s);
}

export const useRegistryStore = defineStore('registry', {
  state: () => ({
    modules: new Map<string, AlgoModule>(),
  }),
  actions: {
    register(mod: AlgoModule) {
      this.modules.set(mod.descriptor.id, mod);
    },
    get(id: string) {
      return this.modules.get(id);
    },
    list() {
      return Array.from(this.modules.values()).sort((a, b) => {
        // 1) 카테고리 사전순
        const catCmp = a.descriptor.category.localeCompare(b.descriptor.category);
        if (catCmp !== 0) return catCmp;

        // 2) 같은 카테고리 내에서는 '성능이 안 좋은' 순서(점수 내림차순)
        const sa = descriptorScore(a.descriptor);
        const sb = descriptorScore(b.descriptor);
        if (sa !== sb) return sb - sa;

        // 3) 동률이면 제목 한글 사전순
        return a.descriptor.title.localeCompare(b.descriptor.title, 'ko');
      });
    },
  },
});
