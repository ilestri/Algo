import type { Step } from '../../types/steps'
import type { Step, AlgoDescriptor } from '@/types/step';

export function bfsSteps(adj: number[][], start = 0): Step[] {
  const n = adj.length; const steps: Step[] = [];
  const q: number[] = [start]; const visited = new Array(n).fill(false); visited[start]=true;
  steps.push({type:'enqueue',payload:{node:start},pc:[3],explain:`시작 노드 ${start} 큐 삽입`});
  while(q.length){
    const u = q.shift()!; steps.push({type:'dequeue',payload:{node:u},pc:[4],explain:`노드 ${u} 큐 제거`});
    steps.push({type:'visit',payload:{node:u},pc:[5],explain:`노드 ${u} 방문`});
    for(let v=0; v<n; v++) if(adj[u][v]){
      steps.push({type:'compare',payload:{u,v},pc:[6],explain:`간선 ${u}→${v} 확인`});
      if(!visited[v]){ visited[v]=true; q.push(v);
        steps.push({type:'enqueue',payload:{node:v, parent:u},pc:[7],explain:`${v} 방문표시 후 큐 삽입`});
      }
    }
  }
  return steps;
}

export const descriptor: AlgoDescriptor<{ matrix: number[][]; start: number }> = {
  id: 'graph/bfs',
  category: 'graph',
  title: '너비 우선 탐색 (BFS)',
  pseudocode: [
    'function BFS(G, s):',
    '  visited[v] ← false for all v',
    '  visited[s] ← true; Q ← {s}',
    '  while Q not empty:',
    '    u ← pop_front(Q); visit(u)',
    '    for each v adjacent to u:',
    '      if not visited[v]: visited[v] ← true; push_back(Q, v)'
  ],
  complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
  defaultInput: { matrix: [[0,1,1,0],[1,0,1,1],[1,1,0,1],[0,1,1,0]], start: 0 }
};
/**
Pseudocode:
1: Q ← empty; visited ← {}
2: enqueue(s); visited.add(s)
3: while Q not empty
4:   u ← dequeue()
5:   for v in adj[u]
6:     if v not in visited
7:       visited.add(v); enqueue(v)
*/
export const pseudocode = [
  'Q ← ∅; visited ← {}',
  'enqueue(s); visited.add(s)',
  'while Q not empty',
  '  u ← dequeue()',
  '  for v in adj[u]',
  '    if v not in visited',
  '      visited.add(v); enqueue(v)'
]

type Graph = Map<number, number[]>

function parseList(text: string): Graph {
  // 예: "0:1,2\n1:2,3\n2:3\n3:\n"
  const g = new Map<number, number[]>()
  const lines = text.trim().split(/\n+/).map(l => l.trim()).filter(Boolean)
  for (const line of lines) {
    const [uPart, vsPart] = line.split(':')
    const u = Number(uPart.trim())
    const vs = (vsPart || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(Number)
    g.set(u, vs)
  }
  return g
}

function* generateBFS(g: Graph, start = 0): Generator<Step> {
  const visited = new Set<number>()
  const q: number[] = []
  yield { type: 'enqueue', payload: { u: start }, pc: [2], explain: `시작 정점 ${start} enq` }
  q.push(start); visited.add(start)
  while (q.length) {
    yield { type: 'dequeue', payload: { u: q[0] }, pc: [4], explain: `deq` }
    const u = q.shift()!
    yield { type: 'visit', payload: { u }, pc: [4], explain: `방문 ${u}` }
    for (const v of g.get(u) ?? []) {
      yield { type: 'compare', payload: { u, v }, pc: [5,6], explain: `이웃 확인` }
      if (!visited.has(v)) {
        visited.add(v)
        yield { type: 'enqueue', payload: { u: v, from: u }, pc: [7], explain: `방문 예약 ${v}` }
        q.push(v)
      }
    }
  }
}

function layoutCircle(nodes: number[], W = 800, H = 240) {
  const cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2 - 30
  return nodes.map((id, idx) => {
    const ang = (2 * Math.PI * idx) / nodes.length
    return { id, x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang), visited: false }
  })
}

export function init({ graphText }: { graphText?: string }) {
  const text = graphText && graphText.trim().length ? graphText : '0:1,2\n1:2,3\n2:3\n3:\n'
  const g = parseList(text)
  const nodes = Array.from(g.keys()).sort((a, b) => a - b)
  const positioned = layoutCircle(nodes)
  const edges = nodes.flatMap(u => (g.get(u) ?? []).map(v => {
    const nu = positioned.find(p => p.id === u)!
    const nv = positioned.find(p => p.id === v)!
    return { u, v, x1: nu.x, y1: nu.y, x2: nv.x, y2: nv.y, visited: false }
  }))
  return { input: g, state: { nodes: positioned, edges } }
}

export function* generate(input: Graph) {
  // 시작정점 0 가정
  yield* generateBFS(input, 0)
}

export function apply(state: any, step: Step, metrics: any) {
  const s = { ...state, nodes: state.nodes.map((n: any) => ({ ...n })), edges: state.edges.map((e: any) => ({ ...e })) }
  if (step.type === 'visit') {
    const n = s.nodes.find((n: any) => n.id === step.payload.u)
    if (n) n.visited = true
    metrics.visits++
  } else if (step.type === 'enqueue' || step.type === 'dequeue' || step.type === 'compare') {
    // 엣지 하이라이트
    if (step.payload?.from !== undefined) {
      const e = s.edges.find((e: any) => e.u === step.payload.from && e.v === step.payload.u)
      if (e) e.visited = true
    }
  }
  return s
}

export const adapter = {
  canvas: 'graph' as const,
  init,
  generate,
  apply,
  pseudocode,
  code: generate.toString()
}
