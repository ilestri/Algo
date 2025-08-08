import type { Step, AlgoDescriptor } from '@/types/step';

export function dijkstraSteps(adj:number[][], s=0): Step[] {
  const n=adj.length; const INF=1e15; const steps: Step[]=[];
  const dist=Array(n).fill(INF); dist[s]=0; const used=Array(n).fill(false);
  for(let i=0;i<n;i++){
    let u=-1; for(let v=0;v<n;v++) if(!used[v] && (u<0 || dist[v]<dist[u])) u=v;
    if(u<0 || dist[u]===INF) break; used[u]=true; steps.push({type:'visit',payload:{u},pc:[4],explain:`가장 가까운 노드 ${u} 확정`});
    for(let v=0; v<n; v++) if(adj[u][v]>0){
      const nd=dist[u]+adj[u][v]; steps.push({type:'relax',payload:{u,v,nd,old:dist[v]},pc:[6],explain:`간선 ${u}→${v} 완화 시도`});
      if(nd<dist[v]) dist[v]=nd;
    }
  }
  return steps;
}

export const descriptor: AlgoDescriptor<{ matrix: number[][]; start: number }> = {
  id: 'graph/dijkstra',
  category: 'graph',
  title: '다익스트라 (Dijkstra)',
  pseudocode: [
    'function Dijkstra(G, s):',
    '  dist[v] ← ∞; dist[s] ← 0',
    '  used[v] ← false for all v',
    '  repeat n times:',
    '    u ← argmin_{!used} dist; used[u] ← true',
    '    for each v adjacent to u:',
    '      if dist[u] + w(u,v) < dist[v]: dist[v] ← dist[u] + w(u,v)'
  ],
  complexity: { best: 'O(V^2) or O((V+E) log V)', average: 'O(V^2)', worst: 'O(V^2)', space: 'O(V)' },
  defaultInput: { matrix: [[0,2,0,1],[2,0,3,2],[0,3,0,4],[1,2,4,0]], start: 0 }
};
