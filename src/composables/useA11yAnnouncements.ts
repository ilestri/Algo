import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useA11yAnnouncements() {
  const region = ref<HTMLElement | null>(null);

  onMounted(() => {
    const el = document.createElement('div');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    el.className = 'sr-only';
    document.body.appendChild(el);
    region.value = el;
  });

  onBeforeUnmount(() => {
    if (region.value && region.value.parentElement) {
      region.value.parentElement.removeChild(region.value);
    }
  });

  function announce(text: string) {
    if (!region.value) return;
    region.value.textContent = text;
  }

  return { announce };
}
