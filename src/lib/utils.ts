import { type RouteLocationNormalizedLoaded, type Router } from 'vue-router'
import LZString from 'lz-string'

export function parseNumberArray(text: string): { ok: true, value: number[] } | { ok: false, error: string } {
  if (!text.trim()) return { ok: true, value: [] }
  const parts = text.split(',').map(s => s.trim())
  const nums: number[] = []
  for (const p of parts) {
    const n = Number(p)
    if (!Number.isFinite(n)) return { ok: false, error: `유효하지 않은 숫자: ${p}` }
    nums.push(n)
  }
  return { ok: true, value: nums }
}

export function buildShareUrl(router: Router, state: { category: string, name: string, array?: number[], graph?: string, seq?: number[], speed?: number }) {
  const base = router.resolve({ name: 'visualize', params: { category: state.category, name: state.name } }).href
  const q: Record<string, string> = {}
  if (state.array?.length) q.a = LZString.compressToEncodedURIComponent(JSON.stringify(state.array))
  if (state.graph && state.graph.trim().length) q.g = LZString.compressToEncodedURIComponent(state.graph)
  if (state.seq?.length) q.s = LZString.compressToEncodedURIComponent(JSON.stringify(state.seq))
  if (state.speed) q.v = String(state.speed)
  const qs = new URLSearchParams(q).toString()
  return `${location.origin}${base}${qs ? `?${qs}` : ''}`
}

export function parseQueryState(route: RouteLocationNormalizedLoaded) {
  const q = route.query
  const res: any = {}
  if (q.a) {
    try { res.array = JSON.parse(LZString.decompressFromEncodedURIComponent(String(q.a)) || '[]') } catch { void 0 }
  }
  if (q.g) {
    try { res.graph = LZString.decompressFromEncodedURIComponent(String(q.g)) || '' } catch { void 0 }
  }
  if (q.s) {
    try { res.seq = JSON.parse(LZString.decompressFromEncodedURIComponent(String(q.s)) || '[]') } catch { void 0 }
  }
  if (q.v) {
    const v = Number(q.v); if (Number.isFinite(v)) res.speed = v
  }
  return Object.keys(res).length ? res : null
}
