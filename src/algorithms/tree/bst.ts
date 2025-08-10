import type {Step, AlgoDescriptor} from '@/types/step';
import {createStep} from '@/lib/steps';

/**
 * @complexity 시간: O(h), 공간: O(1) ~ O(h)
 * @pseudocodeIndex
 * 1: insert(T, key)
 * 2: search(T, key)
 * 3: delete(T, key)
 */
export function stepsOf(input: { keys: number[]; search?: number; remove?: number }): Step[] {
  const keys = (input.keys || []).slice();
  const steps: Step[] = [];

  function visit(val: number, pc: number[], explain: string) {
    steps.push(createStep('visit', {value: val}, pc, explain));
  }

  // 삽입 시퀀스
  for (const k of keys) {
    visit(k, [1], `키 ${k} 삽입 탐색`);
    steps.push(createStep('insert', {key: k}, [1], `키 ${k} 삽입`));
  }

  // 검색
  if (Number.isFinite(input.search as number)) {
    const s = input.search as number;
    visit(s, [2], `키 ${s} 검색`);
  }

  // 삭제
  if (Number.isFinite(input.remove as number)) {
    const d = input.remove as number;
    steps.push(createStep('delete', {key: d}, [3], `키 ${d} 삭제`));
  }

  return steps;
}

export const descriptor: AlgoDescriptor<{ keys: number[]; search?: number; remove?: number }> = {
  id: 'tree/bst',
  category: 'tree',
  title: '이진 탐색 트리 (BST)',
  pseudocode: [
    'insert(T, key)',
    'search(T, key)',
    'delete(T, key)',
  ],
  complexity: {best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', space: 'O(h)'},
  defaultInput: {keys: [7, 3, 9, 1, 5, 8, 10], search: 5},
  normalizeInput: (raw: any) => {
    const keys = Array.isArray(raw?.keys) ? raw.keys.map((x: any) => Number(x)).filter((x: any) => Number.isFinite(x)) : [];
    const search = Number(raw?.search);
    const remove = Number(raw?.remove);
    return {
      keys: keys.slice(0, 1000),
      search: Number.isFinite(search) ? search : undefined,
      remove: Number.isFinite(remove) ? remove : undefined
    };
  }
};
/**
 Pseudocode (삽입):
 1: if root = ∅ then root ← new(key)
 2: cur ← root
 3: while true
 4:   if key < cur.key
 5:     if cur.left = ∅ then cur.left ← new(key); break
 6:     else cur ← cur.left
 7:   else
 8:     if cur.right = ∅ then cur.right ← new(key); break
 9:     else cur ← cur.right
 */
export const pseudocode = [
  'if root = ∅ then root ← new(key)',
  'cur ← root',
  'while true',
  '  if key < cur.key',
  '    if cur.left = ∅ then cur.left ← new(key); break',
  '    else cur ← cur.left',
  '  else',
  '    if cur.right = ∅ then cur.right ← new(key); break',
  '    else cur ← cur.right'
]

type Node = { id: number, value: number, left?: Node, right?: Node }
let nextId = 1

function insert(root: Node | undefined, key: number, steps: Step[]) {
  if (!root) {
    steps.push(createStep('insert', {value: key}, [1], '루트 삽입'))
    return {id: nextId++, value: key}
  }
  let cur = root
  steps.push(createStep('visit', {id: cur.id}, [2, 3], `노드 방문 ${cur.value}`))
  for (; ;) {
    if (key < cur.value) {
      steps.push(createStep('compare', {cur: cur.value, key}, [4], '왼쪽 비교'))
      if (!cur.left) {
        cur.left = {id: nextId++, value: key}
        steps.push(
            createStep('insert', {parent: cur.id, side: 'L', value: key}, [5], '왼쪽 삽입'),
        )
        break
      } else {
        cur = cur.left
        steps.push(createStep('visit', {id: cur.id}, [6], `이동`))
      }
    } else {
      steps.push(createStep('compare', {cur: cur.value, key}, [7], '오른쪽 비교'))
      if (!cur.right) {
        cur.right = {id: nextId++, value: key}
        steps.push(
            createStep('insert', {parent: cur.id, side: 'R', value: key}, [8], '오른쪽 삽입'),
        )
        break
      } else {
        cur = cur.right
        steps.push(createStep('visit', {id: cur.id}, [9], `이동`))
      }
    }
  }
  return root
}

function layout(root: Node | undefined, W = 800, H = 240) {
  const nodes: any[] = []
  const edges: any[] = []
  const depthX: Record<number, number> = {}

  function dfs(n: Node | undefined, depth: number) {
    if (!n) return
    const x = (depthX[depth] = (depthX[depth] ?? 0) + 1)
    const y = depth + 1
    const gapX = W / (Math.pow(2, depth) + 1)
    const gapY = H / 6
    const nx = gapX * x
    const ny = gapY * y
    nodes.push({id: n.id, value: n.value, x: nx, y: ny, highlight: false})
    if (n.left) {
      edges.push({x1: nx, y1: ny, x2: nx - gapX / 2, y2: ny + gapY})
      dfs(n.left, depth + 1)
    }
    if (n.right) {
      edges.push({x1: nx, y1: ny, x2: nx + gapX / 2, y2: ny + gapY})
      dfs(n.right, depth + 1)
    }
  }

  dfs(root, 0)
  return {nodes, edges}
}

export function init({seq}: { seq?: number[] }) {
  const s = seq && seq.length ? seq : [8, 3, 10, 1, 6, 14]
  const steps: Step[] = []
  let root: Node | undefined = undefined
  nextId = 1
  for (const v of s) {
    root = insert(root, v, steps)
  }
  const {nodes, edges} = layout(root)
  return {input: s, state: {nodes, edges, root}}
}

export function* generate(seq: number[]) {
  // 이미 init에서 전체 삽입에 대한 steps를 생성하는 대신,
  // 시각화를 위해 다시 한 번 생성
  const steps: Step[] = []
  let root: Node | undefined = undefined
  nextId = 1
  for (const v of seq) {
    root = insert(root, v, steps)
  }
  for (const s of steps) yield s
}

export function apply(state: any, step: Step, _metrics: any) {
  const s = {...state, nodes: state.nodes.map((n: any) => ({...n}))}
  void _metrics;
  if (step.type === 'visit') {
    const n = s.nodes.find((n: any) => n.id === step.payload.id)
    if (n) n.highlight = true
  } else if (step.type === 'insert') {
    // 간단 구현: 재배치 호출 없이 하이라이트만
    // 실제 트리 재구성/레이아웃은 init에서 수행
  }
  return s
}

export const adapter = {
  canvas: 'tree' as const,
  init,
  generate,
  apply,
  pseudocode,
  code: insert.toString()
}
