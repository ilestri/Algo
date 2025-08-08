import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './router'
import App from './App.vue'
import { MotionPlugin } from '@vueuse/motion'
import './styles/tailwind.css'

const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

app.use(pinia)
app.use(router)
app.use(MotionPlugin)

app.mount('#app')
