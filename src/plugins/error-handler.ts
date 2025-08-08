import type { App } from 'vue';

/**
 * 전역 오류 핸들러를 등록합니다.
 * 오류가 발생하면 window에 'app-error' CustomEvent를 디스패치합니다.
 * ErrorDialog.vue는 상위에서 해당 이벤트를 구독해 모달을 표시할 수 있습니다.
 */
export function setupErrorHandler(app: App) {
  app.config.errorHandler = (err, instance, info) => {
    const message = (err instanceof Error ? err.message : String(err)) + (info ? `\n[info] ${info}` : '');
    window.dispatchEvent(new CustomEvent('app-error', { detail: { message } }));
    // 개발 중 콘솔 출력
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[GlobalErrorHandler]', err, info);
    }
  };
}
