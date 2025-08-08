import type { Step } from '../types/steps'
import * as bubble from '../algorithms/sorting/bubble'
import * as selection from '../algorithms/sorting/selection'
import * as insertion from '../algorithms/sorting/insertion'
import * as binary from '../algorithms/searching/binary'
import * as bfs from '../algorithms/graph/bfs'
import * as bst from '../algorithms/tree/bst'

type AlgoInitInput = { array?: number[]; graphText?: string; seq?: number[] }
type AlgoInitResult = { input: any; state: any }

type AlgoDef = {
  canvas: 'array' | 'graph' | 'tree',
  init: (inData: AlgoInitInput) => AlgoInitResult,
  generate: (input: any) => Generator<Step, void, unknown>,
  apply: (state: any, step: Step, metrics: any) => any,
  pseudocode: string[],
  code: string
}

export function getAlgo(category: string, name: string): AlgoDef {
  if (category === 'sorting') {
    if (name === 'bubble') return bubble.adapter
    if (name === 'selection') return selection.adapter
    if (name === 'insertion') return insertion.adapter
  }
  if (category === 'searching' && name === 'binary') return binary.adapter
  if (category === 'graph' && name === 'bfs') return bfs.adapter
  if (category === 'tree' && name === 'bst') return bst.adapter

  return bubble.adapter
}
