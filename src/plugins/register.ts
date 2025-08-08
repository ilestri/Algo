import type { App } from 'vue';
import { setupA11y } from './a11y';
import { setupECharts } from './echarts';
import { setupPassiveEvents } from './passive-events';
import '@/styles/a11y.css';

/**
 * 앱 전역 플러그인/스타일을 일괄 등록합니다.
 * main.ts에서 setupPlugins(app) 호출만 추가하면 됩니다.
 */
export function setupPlugins(app: App) {
  // 스크롤 차단 이벤트에 대한 성능 경고 방지(라이브러리의 wheel/mousewheel을 passive로)
  setupPassiveEvents();

  setupA11y(app);
  setupECharts(app);
}
