<template>
  <div class="flex items-center gap-3">
    <label for="speed" class="text-sm w-20">속도</label>
    <input
      id="speed"
      type="range"
      min="0.25"
      max="4"
      step="0.25"
      :value="value"
      @input="$emit('change', Number(($event.target as HTMLInputElement).value))"
      aria-valuemin="0.25"
      aria-valuemax="4"
      :aria-valuenow="value"
      class="w-full"
    />
    <span class="text-sm w-14 text-right">{{ value.toFixed(2) }}x</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ value: number }>();
defineEmits<{ (e: 'change', v: number): void }>();
</script>
