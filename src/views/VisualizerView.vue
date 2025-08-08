<template>
  <section class="max-w-7xl mx-auto px-4 py-6">
    <div class="mb-4 flex items-center gap-2">
      <label class="text-sm">알고리즘</label>
      <select class="select" v-model="selectedId" aria-label="알고리즘 선택">
        <option v-for="d in descriptors" :key="d.id" :value="d.id">{{ d.title }}</option>
      </select>
    </div>

    <div class="grid lg:grid-cols-[1fr_360px] gap-6">
      <div class="space-y-4">
        <div class="card p-4">
          <component
              :is="inputForm"
              v-bind="inputFormProps"
              @submit="onSubmitInput"
          />
        </div>

        <div class="card p-4">
          <VisualizerCanvas
              :mode="canvasMode"
              :state="state"
              :steps="steps"
              :currentIndex="index"
          />
        </div>

        <div class="card p-4">
          <MetricsPanel :metrics="metrics" :timeline="metricsTimeline" />
        </div>
      </div>

      <div class="space-y-4">
        <div class="card p-3">
          <PlayerControls
              :playing="playing"
              :canBack="canBack"
              :canForward="canForward"
              :index="index"
              :total="steps.length"
              :speed="speed"
              :algo="selectedId"
              :input="input"
              @toggle="togglePlay"
              @home="jumpTo(0)"
              @back="stepBack()"
              @forward="stepForward()"
              @end="jumpTo(steps.length)"
              @update:speed="onSpeedChange"
              @shared="onShared"
          />
        </div>

        <div class="card p-3">
          <PseudocodePanel
              :lines="pseudocode"
              :highlight="pc"
              :showCode="showCode"
              :code="''"
              @toggleView="showCode = !showCode"
          />
        </div>

        <div class="card p-3">
          <InspectorPanel :pc="pc" :explain="explain" :meta="currentMeta" />
        </div>
      </div>
    </div>

    <KeyboardShortcutsModal :open="shortcutsOpen" @close="shortcutsOpen=false" />
    <ErrorDialog :open="errorOpen" :message="errorMessage" @close="errorOpen=false" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue';
import VisualizerCanvas from '@/components/visualizer/VisualizerCanvas.vue';
import PlayerControls from '@/components/controls/PlayerControls.vue';
import PseudocodePanel from '@/components/panels/PseudocodePanel.vue';
import MetricsPanel from '@/components/panels/MetricsPanel.vue';
import InspectorPanel from '@/components/panels/InspectorPanel.vue';
import KeyboardShortcutsModal from '@/components/modals/KeyboardShortcutsModal.vue';
import ErrorDialog from '@/components/modals/ErrorDialog.vue';

import DataInputForm from '@/components/forms/DataInputForm.vue';
import GraphEditorTabs from '@/components/forms/GraphEditorTabs.vue';
import TreeInputForm from '@/components/forms/TreeInputForm.vue';

import { useStepRunner } from '@/composables/useStepRunner';
import { useA11yAnnouncements } from '@/composables/useA11yAnnouncements';
import { useUrlState } from '@/composables/useUrlState';
import type { Step, AlgoModule, AlgoDescriptor, SnapshotStrategy } from '@/types/step';
import { initAlgorithms, listDescriptors, getAlgorithm } from '@/algorithms/registry';
import { useSessionStore } from '@/stores/session';
import { useGlobalStore } from '@/stores/global';

const session = useSessionStore();
const global = useGlobalStore();

// 레지스트리 초기화 및 목록
const descriptors = ref<AlgoDescriptor[]>([]);
const selectedId = ref<string>(global.algoId);

onMounted(async () => {
  await initAlgorithms();
  descriptors.value = listDescriptors();
  // normalizeInput 폴리필: 없는 경우 원본 반환 함수로 채워 안전하게 처리
  descriptors.value.forEach((d: any) => {
    if (typeof (d as any).normalizeInput !== 'function') {
      (d as any).normalizeInput = (x: any) => x;
    }
  });
  if (!descriptors.value.find(d => d.id === selectedId.value)) {
    selectedId.value = descriptors.value[0]?.id || 'sorting/quick';
  }
});

// URL 상태 동기화(algo + 압축 s)
const { state: urlState, patch } = useUrlState();
watch(selectedId, (id) => {
  // 전역 알고리즘 선택 반영
  global.algoId = id;
  // 직렬화 가능한 입력 스냅샷과 speed 값으로 동기화
  const plainInput = JSON.parse(JSON.stringify(input));
  patch({ algo: id, input: plainInput, speed: speed.value });
});

// 워커 전환 컴포저블
import { useStepsWorker } from '@/composables/useStepsWorker';
const stepsWorker = useStepsWorker({ bigArray: 5000, bigNodes: 1000 });

// 현재 선택된 알고리즘 모듈
const currentModule = computed<AlgoModule | undefined>(() => getAlgorithm(selectedId.value));
const currentMeta = computed<AlgoDescriptor | null>(() => currentModule.value?.descriptor ?? null);
const strategy = computed<SnapshotStrategy>(() => currentModule.value?.snapshotStrategy ?? 'full');

// 알고리즘 메타 변경 시 입력 초기화 및 URL 동기화
watch(() => currentMeta.value, (meta) => {
  if (!meta) return;
  // defaultInput으로 입력 리셋
  const def = meta.defaultInput as any;
  Object.keys(input).forEach(k => delete (input as any)[k]);
  Object.assign(input, JSON.parse(JSON.stringify(def)));
  // URL 동기화(속도는 유지)
  patch({ algo: selectedId.value, input: JSON.parse(JSON.stringify(input)) });
});

// 입력 및 입력 폼
const input = reactive<any>({});
const inputForm = computed(() => {
  const cat = currentMeta.value?.category;
  if (cat === 'graph') return GraphEditorTabs;
  if (cat === 'tree') return TreeInputForm;
  return DataInputForm;
});
const inputFormProps = computed(() => {
  const cat = currentMeta.value?.category;
  if (cat === 'graph') return { n: 5, list: {}, weighted: true };
  if (cat === 'tree') return { initial: currentMeta.value?.defaultInput?.keys ?? [] };
  return { initial: currentMeta.value?.defaultInput?.array ?? [] };
});

// 시각화 상태 및 모드(간이)
const state = reactive<any>({ array: [], highlight: [], sorted: new Set<number>(), highlightRange: null, pivotIndex: null, pointers: [] as Array<{ name: string, index: number }> });
const canvasMode = computed<'array' | 'graph' | 'tree'>(() => {
  const cat = currentMeta.value?.category;
  if (cat === 'graph') return 'graph';
  if (cat === 'tree') return 'tree';
  return 'array';
});

// 단계/러너
const steps = ref<Step[]>([]);
const pc = ref<number[]>([]);
const explain = ref<string>('');
const showCode = ref(false);

// 메트릭 및 타임라인
const metrics = reactive({ steps: 0, compares: 0, swaps: 0, visits: 0, relaxes: 0, enqueues: 0, dequeues: 0 });
const metricsTimeline = ref<Array<Partial<typeof metrics>>>([]);

// 간이 인터프리터(배열·그래프 공통 일부 처리)
const interpreter = {
  apply(s: any, step: Step) {
    switch (step.type) {
      case 'compare': {
        const { i, j } = step.payload || {};
        s.highlight = [i, j].filter((x: any) => Number.isInteger(x));
        break;
      }
      case 'swap': {
        const { i, j } = step.payload;
        [s.array[i], s.array[j]] = [s.array[j], s.array[i]];
        s.highlight = [i, j];
        break;
      }
      case 'setValue': {
        const { index, value } = step.payload;
        s.array[index] = value;
        break;
      }
      case 'highlightRange': {
        s.highlightRange = step.payload;
        break;
      }
      case 'pivot': {
        s.pivotIndex = step.payload?.index ?? step.payload?.i ?? null;
        break;
      }
      case 'pointer': {
        const { name, index } = step.payload || {};
        if (!Array.isArray(s.pointers)) s.pointers = [];
        const idx = s.pointers.findIndex((p: any) => p.name === name);
        if (idx >= 0) s.pointers[idx].index = index;
        else s.pointers.push({ name, index });
        break;
      }
      case 'relax': {
        // Dijkstra: 거리 이완 적용(이전 값 스택 보관)
        if (!Array.isArray(s._relaxHistory)) s._relaxHistory = [];
        if (!Array.isArray(s.dist)) s.dist = [];
        const { v, dist } = step.payload || {};
        const prev = s.dist[v];
        s._relaxHistory.push({ v, prev });
        s.dist[v] = dist;
        break;
      }
      case 'markSorted': {
        s.sorted.add(step.payload.i);
        break;
      }
      default:
        break;
    }
  },
  revert(s: any, step: Step) {
    // diff 되감기: relax 역연산 복원
    if (step.type === 'relax' && Array.isArray(s._relaxHistory) && s._relaxHistory.length > 0) {
      const last = s._relaxHistory.pop();
      if (last) {
        if (!Array.isArray(s.dist)) s.dist = [];
        s.dist[last.v] = last.prev;
      }
    }
  }
};

// 러너 생성
const { speed, index, playing, done, play, pause, reset, stepForward, stepBack, setSpeed, jumpTo, on } = useStepRunner({
  initialState: state,
  steps: steps.value,
  fps: 60,
  snapshotStrategy: strategy.value,
  interpreter,
});

// 러너 인덱스/이벤트 연계
on('beforeStep', ({ index: i, step }) => {
  // no-op
});
on('afterStep', ({ index: i, step }) => {
  metrics.steps += 1;
  if (step.type === 'compare') metrics.compares += 1;
  if (step.type === 'swap') metrics.swaps += 1;
  if (step.type === 'visit') metrics.visits += 1;
  if (step.type === 'relax') metrics.relaxes += 1;
  if (step.type === 'enqueue') metrics.enqueues += 1;
  if (step.type === 'dequeue') metrics.dequeues += 1;

  pc.value = step.pc ?? [];
  explain.value = step.explain ?? '';
  session.pc = pc.value;
  session.explain = explain.value;

  // 타임라인 샘플링
  metricsTimeline.value.push({ ...metrics });
  if (metricsTimeline.value.length > 2000) metricsTimeline.value.shift();

  // 라이브 리전 안내
  announcer.announce(step.explain || '');
});
on('done', () => {
  // 완료
});

// 실행 가능한 상태 관리
const canBack = computed(() => strategy.value !== 'none' && index.value > 0);
const canForward = computed(() => index.value < steps.value.length);

// 제어기 래핑
function togglePlay() { playing.value ? pause() : play(); }

// 현재 스텝 메타
watch(index, (i) => {
  const cur = steps.value[i] || null;
  pc.value = cur?.pc ?? [];
  explain.value = cur?.explain ?? '';
});

// 알고리즘/입력 준비
async function prepare() {
  const mod = currentModule.value;
  if (!mod) return;

  // 입력 정규화
  const normalized = mod.descriptor.normalizeInput(input);
  Object.assign(input, normalized);

  // 상태 초기화
  state.array = Array.isArray((input as any).array) ? [...(input as any).array] : [];
  state.highlight = [];
  state.sorted = new Set<number>();
  state.highlightRange = null;
  state.pivotIndex = null;
  state.pointers = [];

  // 그래프 카테고리: 기본 노드/엣지 레이아웃 구성(원형 배치) + 거리/이력 초기화
  if (currentMeta.value?.category === 'graph') {
    const n = Number((normalized as any).n ?? 0);
    const adj = (normalized as any).adj ?? {};
    const start = Number((normalized as any).start ?? 0);

    const cx = 500, cy = 200, r = 140;
    const nodes = Array.from({ length: n }, (_, i) => ({
      id: i,
      x: cx + Math.cos((2 * Math.PI * i) / Math.max(1, n)) * r,
      y: cy + Math.sin((2 * Math.PI * i) / Math.max(1, n)) * r,
    }));
    const edges: Array<{ u: number; v: number; w?: number }> = [];
    for (const [uStr, list] of Object.entries(adj as Record<string, Array<{ v: number; w?: number }>>)) {
      const u = Number(uStr);
      for (const { v, w } of (list || [])) edges.push({ u, v, w });
    }
    (state as any).nodes = nodes;
    (state as any).edges = edges;

    // Dijkstra 대비: 거리/이력 초기화
    (state as any).dist = Array(n).fill(Number.POSITIVE_INFINITY);
    (state as any).dist[start] = 0;
    (state as any)._relaxHistory = [];
  }

  // 스텝 생성(대용량 시 워커 경로 사용)
  const gen = await stepsWorker.generate(mod.descriptor.id, normalized, () => mod.stepsOf(normalized));
  steps.value = gen;

  // 러너 재설정
  reset();
  metrics.steps = metrics.compares = metrics.swaps = metrics.visits = metrics.relaxes = metrics.enqueues = metrics.dequeues = 0;
  metricsTimeline.value = [];
  pc.value = [];
  explain.value = '';
}
watch([currentModule], prepare, { immediate: true });

// 입력 폼 제출
function onSubmitInput(payload: any) {
  Object.assign(input, payload);
  prepare().then(() => {
    const plainInput = JSON.parse(JSON.stringify(input));
    patch({ algo: selectedId.value, input: plainInput, speed: speed.value });
  });
}

function onSpeedChange(val: number) {
  setSpeed(val);
  const plainInput = JSON.parse(JSON.stringify(input));
  patch({ algo: selectedId.value, input: plainInput, speed: val });
}

function onShared() {
  // 간단한 알림(필요 시 토스트로 대체 가능)
  announcer.announce('공유 링크가 복사되었습니다.');
}

// 키보드 단축키
const shortcutsOpen = ref(false);
function onKey(e: KeyboardEvent) {
  if (e.key === '?') { shortcutsOpen.value = true; e.preventDefault(); return; }
  if (e.key === ' ') { togglePlay(); e.preventDefault(); return; }
  if (e.key === 'ArrowRight') { if (e.shiftKey) stepForward(5); else stepForward(1); e.preventDefault(); return; }
  if (e.key === 'ArrowLeft') { if (e.shiftKey) stepBack(5); else stepBack(1); e.preventDefault(); return; }
  if (e.key === 'Home') { jumpTo(0); e.preventDefault(); return; }
  if (e.key === 'End') { jumpTo(steps.value.length); e.preventDefault(); return; }
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));

// 라이브 리전
const announcer = useA11yAnnouncements();

// 에러 다이얼로그 연결
const errorOpen = ref(false);
const errorMessage = ref('');
const onError = (ev: Event) => {
  const detail = (ev as CustomEvent).detail as { message: string };
  errorMessage.value = detail?.message || '알 수 없는 오류';
  errorOpen.value = true;
};
onMounted(() => window.addEventListener('app-error', onError as any));
onBeforeUnmount(() => window.removeEventListener('app-error', onError as any));

// Pseudocode 및 현재 메타
const pseudocode = computed(() => currentMeta.value?.pseudocode ?? []);

</script>
