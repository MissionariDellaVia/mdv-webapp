import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store/index.js';

import Home from '@/view/Home';
import Auth from '@/view/Auth';
import Vocazione from '@/view/Vocazione';
import Attivita from '@/view/Attivita';
import Contatti from '@/view/Contatti';
import Approfondimenti from '@/view/Approfondimenti';
import PregaPerNoi from '@/view/PregaPerNoi';
import Dashboard from '@/view/Dashboard';

const routes = [
    {
        path: '/',
        name: 'chi-siamo',
        component: Home,
        // meta: { requiresUnauth: true }
    },
    {
        path: '/auth',
        name: 'auth',
        component: Auth,
        meta: { requiresUnauth: true, reservedArea: true }
    },
    {
        path: '/vocazione',
        name: 'vocazione',
        component: Vocazione,
        // meta: { requiresAuth: true }
    },
    {
        path: '/attivita',
        name: 'attivita',
        component: Attivita,
        // meta: { requiresAuth: true }
    },
    {
        path: '/contatti',
        name: 'contatti',
        component: Contatti,
        // meta: { requiresAuth: true }
    },
    {
        path: '/approfondimenti',
        name: 'approfondimenti',
        component: Approfondimenti,
        // meta: { requiresAuth: true }
    },
    {
        path: '/prega-con-noi',
        name: 'prega-con-noi',
        component: PregaPerNoi,
        meta: {  }
    },
    {
        path: '/reserved-area/mdv-admin/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, reservedArea: true }
    },
    { path: '/:notFound(.*)', component: Home }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
        // always scroll to top
        return { top: 0 }
    },
});

router.beforeEach(function(to, _, next) {
    if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
        next('/auth');
    } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
        next('/reserved-area/mdv-admin/dashboard');
    } else {
        next();
    }
});

export default router
