<template>
  <div v-if="open" class="fixed inset-0 bg-black flex items-center justify-center z-50">
    <div
        class="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 w-full max-w-md"
        v-trap-focus
        role="dialog"
        aria-modal="true"
        aria-label="오류 안내"
    >
      <header class="flex items-center justify-between mb-2">
        <h3 class="font-semibold">오류가 발생했습니다</h3>
        <button class="btn-ghost" @click="$emit('close')" aria-label="닫기">×</button>
      </header>
      <p class="text-sm whitespace-pre-wrap break-words">{{ message }}</p>
      <div class="mt-3 text-xs opacity-70">
        입력/설정을 점검한 뒤 다시 시도해 주세요. 문제가 지속되면 새로고침(F5)으로 세션을 복구할 수 있습니다.
      </div>
      <footer class="mt-4 flex justify-end gap-2">
        <button class="btn-ghost" @click="$emit('close')">닫기</button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ open: boolean; message: string }>();
defineEmits<{ (e: 'close'): void }>();
</script>
