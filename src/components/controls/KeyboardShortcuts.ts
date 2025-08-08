export const shortcuts = [
  { keys: 'Space', label: '재생/일시정지' },
  { keys: 'ArrowLeft', label: '이전 스텝' },
  { keys: 'ArrowRight', label: '다음 스텝' },
  { keys: 'Home', label: '처음으로' },
  { keys: 'End', label: '끝으로' },
  { keys: '?', label: '단축키 도움말' },
];
export type ShortcutAction =
  | 'toggle'
  | 'back'
  | 'forward'
  | 'home'
  | 'end'
  | 'openHelp';

export interface Shortcut {
  keys: string;
  action: ShortcutAction;
  label: string;
}

export const SHORTCUTS: Shortcut[] = [
  { keys: 'Space', action: 'toggle', label: '재생/일시정지' },
  { keys: 'ArrowLeft', action: 'back', label: '이전' },
  { keys: 'ArrowRight', action: 'forward', label: '다음' },
  { keys: 'Shift+ArrowLeft', action: 'back', label: '이전(5스텝)' },
  { keys: 'Shift+ArrowRight', action: 'forward', label: '다음(5스텝)' },
  { keys: 'Home', action: 'home', label: '처음으로' },
  { keys: 'End', action: 'end', label: '끝으로' },
  { keys: '?', action: 'openHelp', label: '단축키 도움말' },
];

// KeyboardEvent를 받아 실행할 액션을 판별
export function mapKeyToAction(e: KeyboardEvent): { action: ShortcutAction; steps?: number } | null {
  if (e.key === '?' || (e.shiftKey && e.key === '/')) return { action: 'openHelp' };
  if (e.key === ' ') return { action: 'toggle' };
  if (e.key === 'Home') return { action: 'home' };
  if (e.key === 'End') return { action: 'end' };
  if (e.key === 'ArrowLeft') return { action: 'back', steps: e.shiftKey ? 5 : 1 };
  if (e.key === 'ArrowRight') return { action: 'forward', steps: e.shiftKey ? 5 : 1 };
  return null;
}