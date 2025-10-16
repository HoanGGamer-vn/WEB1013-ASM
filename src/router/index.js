import { createRouter, createWebHistory } from 'vue-router';
import analytics from '@/services/analytics';
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
            meta: { title: 'navigation.home' }
        },
        {
            path: '/news',
            name: 'news',
            component: () => import('@/views/NewsView.vue'),
            meta: { title: 'navigation.news' }
        },
        {
            path: '/characters',
            name: 'characters',
            component: () => import('@/views/CharactersView.vue'),
            meta: { title: 'navigation.characters' }
        },
        {
            path: '/world',
            name: 'world',
            component: () => import('@/views/WorldView.vue'),
            meta: { title: 'navigation.world' }
        },
        {
            path: '/story',
            name: 'story',
            component: () => import('@/views/StoryView.vue'),
            meta: { title: 'navigation.story' }
        },
        // 404 catch-all route - must be last
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/NotFoundView.vue'),
            meta: { title: 'error.pageNotFound' }
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition)
            return savedPosition;
        if (to.hash)
            return { el: to.hash, behavior: 'smooth', top: 80 };
        return { top: 0, behavior: 'smooth' };
    }
});
// Navigation tracking
router.afterEach((to, from) => {
    analytics.trackPageView(to.path, to.meta?.title);
    // Update document title
    if (to.meta?.title) {
        document.title = `${to.meta.title} - Error404`;
    }
    // Set focus for accessibility
    setTimeout(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent)
            mainContent.focus();
    }, 100);
});
router.onError((error) => {
    analytics.trackError(error, 'Router Error');
});
export default router;
