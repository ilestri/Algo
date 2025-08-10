import type {Step, StepType} from '@/types/step'

export function createStep<T>(type: StepType, payload: T, pc: number[], explain: string): Step<T> {
  return {type, payload, pc, explain}
}

export function pushStep<T>(
  steps: Step[],
  type: StepType,
  payload: T,
  pc: number[],
  explain: string,
) {
  steps.push(createStep(type, payload, pc, explain))
}

export function markSorted(steps: Step[], n: number, pc: number[]): void {
  for (let i = 0; i < n; i++) {
    steps.push(createStep('markSorted', {i}, pc, `정렬 완료 위치 ${i}`))
  }
}
