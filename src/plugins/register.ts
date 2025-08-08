import type { App } from 'vue';
import { setupA11y } from './a11y';
import { setupECharts } from './echarts';
import '@/styles/a11y.css';

/**
 * 앱 전역 플러그인/스타일을 일괄 등록합니다.
 * main.ts에서 setupPlugins(app) 호출만 추가하면 됩니다.
 */
export function setupPlugins(app: App) {
  setupA11y(app);
  setupECharts(app);
}
