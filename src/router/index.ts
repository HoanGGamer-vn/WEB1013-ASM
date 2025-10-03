import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',               name: 'home',       component: () => import('@/views/HomeView.vue') },
    { path: '/news',           name: 'news',       component: () => import('@/views/NewsView.vue') },
    { path: '/characters',     name: 'characters', component: () => import('@/views/CharactersView.vue') },
    { path: '/world',          name: 'world',      component: () => import('@/views/WorldView.vue') },
    { path: '/story',          name: 'story',      component: () => import('@/views/StoryView.vue') },
  ],
  scrollBehavior(){ return { top: 0 } }
})
