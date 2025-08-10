export const cloneDeep = <T>(v: T): T => {
  // 브라우저가 지원하면 기본 structuredClone을 우선 사용
  try {
    const sc = (globalThis as any).structuredClone;
    if (typeof sc === 'function') return sc(v);
  } catch {
    /* no-op */
  }

  // 폴백: Set/Map/Date/Array/Object를 보존하는 수제 깊은 복제
  const seen = new WeakMap<object, any>();
  const cloneAny = (val: any): any => {
    if (val === null || typeof val !== 'object') return val;

    if (seen.has(val)) return seen.get(val);

    if (val instanceof Date) return new Date(val.getTime());

    if (val instanceof Set) {
      const out = new Set<any>();
      seen.set(val, out);
      val.forEach(item => out.add(cloneAny(item)));
      return out;
    }

    if (val instanceof Map) {
      const out = new Map<any, any>();
      seen.set(val, out);
      val.forEach((v2, k2) => out.set(cloneAny(k2), cloneAny(v2)));
      return out;
    }

    if (Array.isArray(val)) {
      const out: any[] = [];
      seen.set(val, out);
      for (let i = 0; i < val.length; i++) {
        out[i] = cloneAny(val[i]);
      }
      return out;
    }

    const out: Record<string, any> = {};
    seen.set(val, out);
    for (const key of Object.keys(val)) {
      out[key] = cloneAny(val[key]);
    }
    return out;
  };

  return cloneAny(v);
};
