import type { Step } from '@/types/step';

export interface StepInterpreter<State> {
  apply(state: State, step: Step): void;   // step을 적용해 시각화 상태 갱신
  revert?(state: State, step: Step): void; // 'diff' 전략일 때 역연산(선택)
}
