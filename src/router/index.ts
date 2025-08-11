import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/sorting',
    name: 'sorting',
    component: () => import('../views/CategoryView.vue'),
    props: { category: 'sorting' }
  },
  {
    path: '/searching',
    name: 'searching',
    component: () => import('../views/CategoryView.vue'),
    props: { category: 'searching' }
  },
  {
    path: '/graph',
    name: 'graph',
    component: () => import('../views/CategoryView.vue'),
    props: { category: 'graph' }
  },
  {
    path: '/tree',
    name: 'tree',
    component: () => import('../views/CategoryView.vue'),
    props: { category: 'tree' }
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
