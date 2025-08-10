import { defineStore } from 'pinia';
import type { AlgoModule } from '@/types/step';

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
function scoreComplexityStr(raw?: string): number {
  if (!raw || typeof raw !== 'string') return 0;
  let s = raw.toLowerCase().trim();
  s = s.replace(/\s+/g, '');
  // O(...), Θ(...), Ω(...) 제거
  s = s.replace(/^(?:o|θ|omega|\u0398|\u03a9)\(|\)$/gi, '');

  // 팩토리얼
  if (/(?:n!|factorial)/.test(s)) return 100;

  // 지수(2^n, c^n, n^n)
  if (/(?:\d+\^n|n\^n)/.test(s)) return 80;

  // 다항식 n^k
  const poly = s.match(/n\^(\d+(?:\.\d+)?)/);
  if (poly) {
    const k = parseFloat(poly[1]);
    if (isFinite(k)) return 20 + k * 5;
  }

  // n log n 계열 (그래프 표기 변형 포함)
  if (/(?:nlogn|n\*logn|nlog\(n\)|n\*log\(n\)|vlogv|elogv|e\*logv|v\*logv)/.test(s)) return 18;

  // 그래프 V+E
  if (/(?:v\+e)/.test(s)) return 14;

  // log n
  if (/(?:\blogn\b|log\(n\))/.test(s)) return 10;

  // 선형/선형 유사(V, E 포함)
  if (/(?:\bn\b|\bv\b|\be\b)/.test(s)) return 14;

  // 상수
  if (/\b1\b/.test(s)) return 1;

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
