export type StepType =
  | 'highlight'
  | 'swap'
  | 'compare'
  | 'visit'
  | 'insert'
  | 'delete'
  | 'relink'
  | 'enqueue'
  | 'dequeue'
  | 'relax'
  | 'highlightRange'

export interface Step {
  type: StepType
  payload?: any
  pc: number[]       // pseudocode line numbers
  explain?: string   // 짧은 한국어 해설
}
