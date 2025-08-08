import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './router'
import App from './App.vue'
import { MotionPlugin } from '@vueuse/motion'
import './styles/tailwind.css'
import { setupPlugins } from '@/plugins/register'
import { setupErrorHandler } from '@/plugins/error-handler'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

app.use(pinia)
app.use(router)
app.use(MotionPlugin)

// 전역 플러그인/스타일(ECharts/A11y/a11y.css) 등록
setupPlugins(app)
// 전역 에러 핸들러 등록
setupErrorHandler(app)

app.mount('#app')
