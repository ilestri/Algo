<template>
  <button class="btn-ghost" @click="copy" aria-label="공유 링크 복사">공유 링크</button>
</template>

<script setup lang="ts">
import { useClipboard } from '@/composables/useClipboard';
import { encodeState } from '@/lib/url-compress';

const props = defineProps<{ algo: string; input?: any; speed?: number }>();
const emit = defineEmits<{ (e: 'copied'): void }>();

const { copyText } = useClipboard();

function copy() {
  const url = new URL(location.href);
  url.searchParams.set('algo', props.algo);
  const s = encodeState({ input: props.input, speed: props.speed });
  url.searchParams.set('s', s);
  copyText(url.toString());
  emit('copied');
}
</script>
