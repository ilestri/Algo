import type { App, DirectiveBinding } from 'vue';

function getFocusable(root: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  return Array.from(root.querySelectorAll<HTMLElement>(selectors)).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}

const TrapFocus = {
  mounted(el: HTMLElement, _binding: DirectiveBinding) {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const list = getFocusable(el);
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !el.contains(active)) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (active === last || !el.contains(active)) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    (el as any).__trapHandler = handler;
    el.addEventListener('keydown', handler);
  },
  unmounted(el: HTMLElement) {
    const handler = (el as any).__trapHandler as (e: KeyboardEvent) => void;
    if (handler) el.removeEventListener('keydown', handler);
  },
};

export function setupA11y(app: App) {
  app.directive('trap-focus', TrapFocus);
}
