import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/visualize/:category/:name',
    name: 'visualize',
    component: () => import('../views/VisualizerView.vue'),
    props: true
  },
  {
    path: '/playground',
    name: 'playground',
    component: () => import('../views/Playground.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]
