import { bench, describe } from 'vitest';
import type { Step, RunMetrics } from '@/types/step';

const steps: Step[] = Array.from({ length: 10000 }, () => ({ type: 'visit', payload: null, pc: [], explain: '' }));

function zero(): RunMetrics {
  return { steps: 0, compares: 0, swaps: 0, visits: 0, relaxes: 0, enqueues: 0, dequeues: 0 };
}

function delta(step: Step): RunMetrics {
  const d = zero();
  d.steps = 1;
  if (step.type === 'compare') d.compares = 1;
  if (step.type === 'swap') d.swaps = 1;
  if (step.type === 'visit') d.visits = 1;
  if (step.type === 'relax') d.relaxes = 1;
  if (step.type === 'enqueue') d.enqueues = 1;
  if (step.type === 'dequeue') d.dequeues = 1;
  return d;
}

function accumulate(target: RunMetrics, d: RunMetrics, sign = 1) {
  target.steps += sign * d.steps;
  if (d.compares) target.compares = (target.compares || 0) + sign * d.compares;
  if (d.swaps) target.swaps = (target.swaps || 0) + sign * d.swaps;
  if (d.visits) target.visits = (target.visits || 0) + sign * d.visits;
  if (d.relaxes) target.relaxes = (target.relaxes || 0) + sign * d.relaxes;
  if (d.enqueues) target.enqueues = (target.enqueues || 0) + sign * d.enqueues;
  if (d.dequeues) target.dequeues = (target.dequeues || 0) + sign * d.dequeues;
}

const fullMetrics = zero();
for (const s of steps) accumulate(fullMetrics, delta(s));

describe('metrics update strategies', () => {
  bench('full recompute', () => {
    const m = zero();
    for (let i = 0; i < steps.length - 1; i++) {
      accumulate(m, delta(steps[i]));
    }
  });

  bench('delta decrement', () => {
    const m = { ...fullMetrics };
    const d = delta(steps[steps.length - 1]);
    accumulate(m, d, -1);
  });
});
