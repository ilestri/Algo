<template>
  <section class="max-w-6xl mx-auto px-4 py-6">
    <div class="grid lg:grid-cols-[1fr_360px] gap-6">
      <div class="space-y-4">
        <div class="card p-4">
          <DataInputForm
            :category="category"
            :name="name"
            :initial-array="arrayInput"
            :initial-graph="graphInput"
            :initial-seq="seqInput"
            @update:array="onArrayUpdate"
            @update:graph="onGraphUpdate"
            @update:seq="onSeqUpdate"
            @loadSample="loadSample"
          />
        </div>
        <div class="card p-4">
          <VisualizerCanvas
            :mode="canvasMode"
            :state="renderState"
            :steps="steps"
            :currentIndex="runner.stepIndex"
          />
        </div>
        <div class="card p-4">
          <MetricsPanel :metrics="metrics" />
        </div>
      </div>

      <div class="space-y-4">
        <div class="card p-3">
          <ControlPanel
            :isPlaying="runner.isPlaying"
            :canStepBack="runner.stepIndex > 0"
            :canStepForward="runner.stepIndex < steps.length"
            :speed="runner.speed"
            :current="runner.stepIndex"
            :total="steps.length"
            @toggle="runner.toggle"
            @back="runner.stepBack"
            @forward="runner.stepForward"
            @reset="runner.reset"
            @end="runner.skipToEnd"
            @update:speed="runner.setSpeed"
            @share="copyShareLink"
          />
        </div>
        <div class="card p-3">
          <PseudocodePanel
            :lines="pseudocode"
            :highlight="highlightLines"
            :showCode="showCode"
            :code="codeString"
            @toggleView="showCode = !showCode"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataInputForm from '../components/editor/DataInputForm.vue'
import VisualizerCanvas from '../components/visualizer/VisualizerCanvas.vue'
import ControlPanel from '../components/controls/ControlPanel.vue'
import PseudocodePanel from '../components/panels/PseudocodePanel.vue'
import MetricsPanel from '../components/panels/MetricsPanel.vue'
import { useStepRunner } from '../composables/useStepRunner'
import type { Step } from '../types/steps'
import { useAppStore } from '../stores/app'
import { useInputsStore } from '../stores/inputs'
import { getAlgo } from './useAlgoRegistry'
import { buildShareUrl, parseQueryState } from '../lib/utils'

const route = useRoute()
const router = useRouter()
const app = useAppStore()
const inputs = useInputsStore()

const category = computed(() => String(route.params.category || 'sorting'))
const name = computed(() => String(route.params.name || 'bubble'))

// 상태 로드
onMounted(() => {
  const parsed = parseQueryState(route)
  if (parsed) {
    if (parsed.array) inputs.array = parsed.array
    if (parsed.graph) inputs.graphText = parsed.graph
    if (parsed.seq) inputs.seq = parsed.seq
    if (parsed.speed) runner.setSpeed(parsed.speed)
  }
})

// 알고리즘 선택
const algo = computed(() => getAlgo(category.value, name.value))

// 입력 상태
const arrayInput = computed(() => inputs.array)
const graphInput = computed(() => inputs.graphText)
const seqInput = computed(() => inputs.seq)

// steps/pseudocode
const steps = ref<Step[]>([])
const pseudocode = ref<string[]>([])
const codeString = ref<string>('')

// 렌더 상태
const renderState = ref<any>(null)
const canvasMode = computed<'array' | 'graph' | 'tree'>(() => algo.value.canvas)

// 러너
const runner = useStepRunner({
  onTick: (index) => {
    if (index >= 0 && index <= steps.value.length) {
      renderState.value = algo.value.apply(renderState.value, steps.value[index - 1], metrics)
    }
  }
})

// 지표
const metrics = reactive({
  compares: 0,
  swaps: 0,
  visits: 0,
  steps: () => steps.value.length
})

// pseudocode 하이라이트
const highlightLines = computed(() => steps.value[runner.stepIndex - 1]?.pc ?? [])

// 실행 준비
function prepare() {
  const init = algo.value.init({ array: arrayInput.value, graphText: graphInput.value, seq: seqInput.value })
  renderState.value = init.state
  steps.value = [...algo.value.generate(init.input)]
  pseudocode.value = algo.value.pseudocode
  codeString.value = algo.value.code
  runner.reset()
}

watch([arrayInput, graphInput, seqInput, algo], prepare, { immediate: true })

// 입력 업데이트 핸들러
function onArrayUpdate(val: number[]) { inputs.array = val }
function onGraphUpdate(val: string) { inputs.graphText = val }
function onSeqUpdate(val: number[]) { inputs.seq = val }

function loadSample() {
  inputs.loadSample(category.value, name.value)
  prepare()
}

const showCode = ref(false)

async function copyShareLink() {
  const url = buildShareUrl(router, {
    category: category.value,
    name: name.value,
    array: arrayInput.value,
    graph: graphInput.value,
    seq: seqInput.value,
    speed: runner.speed
  })
  await navigator.clipboard.writeText(url)
}

</script>
