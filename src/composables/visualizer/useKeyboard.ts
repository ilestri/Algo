import {ref, onMounted, onBeforeUnmount, type Ref} from 'vue';

interface KeyboardArgs {
  togglePlay: () => void;
  stepForward: (n?: number) => void;
  stepBack: (n?: number) => void;
  jumpTo: (i: number) => void;
  steps: Ref<any[]>;
}

export function useKeyboard({togglePlay, stepForward, stepBack, jumpTo, steps}: KeyboardArgs) {
  const shortcutsOpen = ref(false);

  function onKey(e: KeyboardEvent) {
    if (e.key === '?') {
      shortcutsOpen.value = true;
      e.preventDefault();
      return;
    }
    if (e.key === ' ') {
      togglePlay();
      e.preventDefault();
      return;
    }
    if (e.key === 'ArrowRight') {
      if (e.shiftKey) stepForward(5); else stepForward(1);
      e.preventDefault();
      return;
    }
    if (e.key === 'ArrowLeft') {
      if (e.shiftKey) stepBack(5); else stepBack(1);
      e.preventDefault();
      return;
    }
    if (e.key === 'Home') {
      jumpTo(0);
      e.preventDefault();
      return;
    }
    if (e.key === 'End') {
      jumpTo(steps.value.length);
      e.preventDefault();
      return;
    }
  }

  onMounted(() => window.addEventListener('keydown', onKey));
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey));

  return {shortcutsOpen};
}

