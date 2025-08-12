<template>
  <button class="btn-ghost" @click="copy" aria-label="공유 링크 복사">공유 링크</button>
</template>

<script setup lang="ts">
import { useClipboard } from '@/composables/useClipboard';
import { encodeState } from '@/lib/url-compress';

const props = defineProps<{ input?: any; speed?: number }>();
const emit = defineEmits<{ (e: 'copied'): void }>();

const { copyText } = useClipboard();

async function copy() {
  const url = new URL(location.href);
  const payload: any = { speed: props.speed };
  if (Array.isArray(props.input?.array)) payload.array = props.input.array;
  const s = encodeState(payload);
  url.searchParams.set('s', s);
  const ok = await copyText(url.toString());
  if (ok) emit('copied');
}
</script>
