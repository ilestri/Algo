// 전역 addEventListener 패치: wheel/mousewheel을 기본 passive: true로 설정
// 라이브러리가 명시적으로 { passive: false }를 지정한 경우는 존중합니다.
export function setupPassiveEvents() {
  const g: any = globalThis as any;
  if (g.__PASSIVE_WHEEL_PATCHED__) return;
  g.__PASSIVE_WHEEL_PATCHED__ = true;

  const origAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (listener && (type === 'wheel' || type === 'mousewheel')) {
      if (options === undefined) {
        options = { passive: true };
      } else if (typeof options === 'boolean') {
        options = { capture: options, passive: true };
      } else if (typeof options === 'object' && !('passive' in options)) {
        options = { ...options, passive: true };
      }
    }
    return origAdd.call(this, type, listener as any, options as any);
  };
}
