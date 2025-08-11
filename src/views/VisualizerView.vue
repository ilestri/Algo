<template>
  <section class="max-w-7xl mx-auto px-4 py-6">
    <div class="mb-4 flex items-center gap-2">
      <label for="algorithm-select" class="text-sm">알고리즘</label>
      <select id="algorithm-select" name="algorithm" class="select" v-model="selectedId"
              aria-label="알고리즘 선택">
        <option v-for="d in descriptors" :key="d.id" :value="d.id">{{ d.title }}</option>
      </select>
      <div class="ml-auto">
        <ShareLinkButton :algo="selectedId" :input="input" :speed="speed" @copied="onShared"/>
      </div>
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
          <MetricsPanel :metrics="metrics" :timeline="metricsTimeline"/>
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
              @toggle="togglePlay"
              @home="jumpTo(0)"
              @back="stepBack()"
              @forward="stepForward()"
              @end="jumpTo(steps.length)"
              @update:speed="onSpeedChange"
          />
        </div>

        <div class="card p-3">
          <PseudocodePanel
              :lines="pseudocode"
              :highlight="pc"
          />
        </div>

        <div class="card p-3">
          <InspectorPanel :pc="pc" :explain="explain" :meta="currentMeta"/>
        </div>
      </div>
    </div>

    <KeyboardShortcutsModal :open="shortcutsOpen" @close="shortcutsOpen=false"/>
    <ErrorDialog :open="errorOpen" :message="errorMessage" @close="errorOpen=false"/>
  </section>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import VisualizerCanvas from '@/components/visualizer/VisualizerCanvas.vue';
import PlayerControls from '@/components/controls/PlayerControls.vue';
import ShareLinkButton from '@/components/controls/ShareLinkButton.vue';
import PseudocodePanel from '@/components/panels/PseudocodePanel.vue';
import MetricsPanel from '@/components/panels/MetricsPanel.vue';
import InspectorPanel from '@/components/panels/InspectorPanel.vue';
import KeyboardShortcutsModal from '@/components/modals/KeyboardShortcutsModal.vue';
import ErrorDialog from '@/components/modals/ErrorDialog.vue';

import DataInputForm from '@/components/forms/DataInputForm.vue';
import GraphEditorTabs from '@/components/forms/GraphEditorTabs.vue';
import TreeInputForm from '@/components/forms/TreeInputForm.vue';

import {useStepRunner} from '@/composables/useStepRunner';
import {useA11yAnnouncements} from '@/composables/useA11yAnnouncements';
import {useVisualizerWorker} from '@/composables/visualizer/useWorker';
import {useKeyboard} from '@/composables/visualizer/useKeyboard';
import {useUrlManager} from '@/composables/visualizer/useUrlManager';
import type {AlgoCategory, AlgoDescriptor, AlgoModule, SnapshotStrategy, Step} from '@/types/step';
import {getAlgorithm, initAlgorithms, listDescriptorsByCategory} from '@/algorithms/registry';
import {useSessionStore} from '@/stores/session';
import {useGlobalStore} from '@/stores/global';

const session = useSessionStore();
const global = useGlobalStore();
const route = useRoute();

// 레지스트리 초기화 및 목록
const descriptors = ref<AlgoDescriptor[]>([]);
const selectedId = ref<string>(global.algoId);

onMounted(async () => {
  await initAlgorithms();
  const category = route.params.category as AlgoCategory;
  descriptors.value = listDescriptorsByCategory(category);
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

// 현재 선택된 알고리즘 모듈
const currentModule = computed<AlgoModule | undefined>(() => getAlgorithm(selectedId.value));
const currentMeta = computed<AlgoDescriptor | null>(() => currentModule.value?.descriptor ?? null);
const strategy = computed<SnapshotStrategy>(() => currentModule.value?.snapshotStrategy ?? 'full');


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
  if (cat === 'graph') return {n: 5, list: {}, weighted: true};
  if (cat === 'tree') {
    const keys = Array.isArray((input as any)?.keys)
        ? (input as any).keys
        : (currentMeta.value as any)?.defaultInput?.keys ?? [];
    return {initial: keys};
  }
  const id = currentMeta.value?.id;
  if (id === 'searching/binary') {
    const arr = Array.isArray((input as any)?.array)
        ? (input as any).array
        : (currentMeta.value as any)?.defaultInput?.array ?? [];
    const curKey = Number((input as any)?.key);
    const initialKey = Number.isFinite(curKey)
        ? curKey
        : (currentMeta.value as any)?.defaultInput?.key;
    return {
      initial: arr,
      initialKey,
      requireKey: true
    };
  }
  const arr = Array.isArray((input as any)?.array)
      ? (input as any).array
      : (currentMeta.value as any)?.defaultInput?.array ?? [];
  return {initial: arr};
});

// 시각화 상태 및 모드(간이)
const state = reactive<any>({
  array: [],
  highlight: [],
  sorted: new Set<number>(),
  highlightRange: null,
  pivotIndex: null,
  pointers: [] as Array<{ name: string, index: number }>,
  found: null
});
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

// 메트릭 및 타임라인
const metrics = reactive({
  steps: 0,
  compares: 0,
  swaps: 0,
  visits: 0,
  relaxes: 0,
  enqueues: 0,
  dequeues: 0
});
const metricsTimeline = ref<Array<Partial<typeof metrics>>>([]);


// 간이 인터프리터(배열·그래프 공통 일부 처리)
const interpreter = {
  apply(s: any, step: Step) {
    switch (step.type) {
      case 'compare': {
        const {i, j} = step.payload || {};
        s.highlight = [i, j].filter((x: any) => Number.isInteger(x));
        break;
      }
      case 'swap': {
        const {i, j} = step.payload;
        [s.array[i], s.array[j]] = [s.array[j], s.array[i]];
        s.highlight = [i, j];
        break;
      }
      case 'setValue': {
        const {index, value} = step.payload;
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
        const {name, index} = step.payload || {};
        if (!Array.isArray(s.pointers)) s.pointers = [];
        const idx = s.pointers.findIndex((p: any) => p.name === name);
        if (idx >= 0) s.pointers[idx].index = index;
        else s.pointers.push({name, index});
        break;
      }
      case 'relax': {
        // Dijkstra: 거리 이완 적용(이전 값 스택 보관)
        if (!Array.isArray(s._relaxHistory)) s._relaxHistory = [];
        if (!Array.isArray(s.dist)) s.dist = [];
        const {v, dist} = step.payload || {};
        const prev = s.dist[v];
        s._relaxHistory.push({v, prev});
        s.dist[v] = dist;
        break;
      }
      case 'markSorted': {
        // 안전 보정: Set이 아닌 형태로 복원/직렬화된 경우 Set으로 재구성
        if (!(s.sorted instanceof Set) || typeof s.sorted?.has !== 'function') {
          const asArray = Array.isArray(s.sorted) ? s.sorted : [];
          s.sorted = new Set<number>(asArray);
        }
        s.sorted.add(step.payload.i);
        break;
      }
      case 'visit': {
        const {i} = step.payload || {};
        if (Number.isInteger(i)) {
          s.found = i;
          s.highlight = [i];
        }
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
      return;
    }
    // 정렬 표시(step: markSorted) 되감기 시 마지막 하나만 제거
    if (step.type === 'markSorted') {
      // 안전 보정: Set이 아닌 경우 복원
      if (!(s.sorted instanceof Set) || typeof s.sorted?.has !== 'function') {
        const asArray = Array.isArray(s.sorted) ? s.sorted : [];
        s.sorted = new Set<number>(asArray);
      }
      const i = step.payload?.i;
      if (Number.isInteger(i)) {
        s.sorted.delete(i);
      }
      return;
    }
  }
};

// 러너 생성
const {
  speed,
  index,
  playing,
  play,
  pause,
  reset,
  stepForward,
  stepBack,
  setSpeed,
  jumpTo,
  on
} = useStepRunner({
  initialState: state,
  steps: steps.value,
  fps: 2,
  snapshotStrategy: strategy.value,
  interpreter,
});

// 러너 인덱스/이벤트 연계
on('beforeStep', () => {
  // no-op
});
on('afterStep', ({index: i, step}) => {
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
  metricsTimeline.value.push({...metrics});
  if (metricsTimeline.value.length > 2000) metricsTimeline.value.shift();

  // 라이브 리전 안내
  announcer.announce(step.explain || '');
});
on('done', () => {
  // 완료
});

// 워커 연동 및 URL 상태 관리
const {buildAndLoadSteps} = useVisualizerWorker({
  currentModule,
  currentMeta,
  input,
  state,
  steps,
  metrics,
  metricsTimeline,
  pc,
  explain,
  session,
  reset,
  jumpTo,
  selectedId,
  speed,
});

const {onSpeedChange} = useUrlManager({
  selectedId,
  input,
  speed,
  currentMeta,
  buildAndLoadSteps,
  setSpeed,
  patchSelected: (id: string) => {
    global.algoId = id;
  },
});

// 실행 가능한 상태 관리
const canBack = computed(() => strategy.value !== 'none' && index.value > 0);
const canForward = computed(() => index.value < steps.value.length);

// 폼 제출 핸들러(배열 또는 객체 페이로드 모두 지원)
function onSubmitInput(payload: any) {
  const meta = currentMeta.value;
  if (!meta) return;

  // 배열만 전달되는 케이스(정렬 등)
  if (Array.isArray(payload)) {
    (input as any).array = payload.slice();
    buildAndLoadSteps();
    return;
  }

  // 객체 형태(이진 탐색 시): { array, key, action }
  const arr = Array.isArray(payload?.array) ? payload.array.slice() : [];
  const key = Number(payload?.key);
  const action = payload?.action as ('normal' | 'autoSort' | undefined);

  // 자동 정렬 선택 시 정렬 후 입력 반영
  (input as any).array = action === 'autoSort' ? arr.slice().sort((a, b) => a - b) : arr;
  if (Number.isFinite(key)) (input as any).key = key;

  // 단계 재빌드(내부에서 URL 패치 수행)
  buildAndLoadSteps();
}

// 제어기 래핑
function togglePlay() {
  playing.value ? pause() : play();
}

// 현재 스텝 메타
watch(index, (i) => {
  const cur = steps.value[i] || null;
  pc.value = cur?.pc ?? [];
  explain.value = cur?.explain ?? '';
});

function onShared() {
  // 간단한 알림(필요 시 토스트로 대체 가능)
  announcer.announce('공유 링크가 복사되었습니다.');
}

const {shortcutsOpen} = useKeyboard({
  togglePlay,
  stepForward,
  stepBack,
  jumpTo,
  steps,
});

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
