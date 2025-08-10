export function normalizeArrayInput(raw: any, limit = 5000) {
  const arr = Array.isArray(raw?.array)
    ? raw.array.map((x: any) => Number(x)).filter((x: any) => Number.isFinite(x))
    : []
  return { array: arr.slice(0, limit) }
}
