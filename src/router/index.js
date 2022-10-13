import { createRouter, createWebHashHistory } from 'vue-router'
// import store from '../store/index.js';

import Home from '@/view/Home';
import Vocazione from '@/view/Vocazione';
import Attivita from '@/view/Attivita';
import Contatti from '@/view/Contatti';
import Approfondimenti from '@/view/Approfondimenti';
import PregaPerNoi from '@/view/PregaPerNoi';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }
    },
    // {
    //     path: '/auth',
    //     name: 'Auth',
    //     component: Auth,
    //     meta: { requiresUnauth: true }
    // },
    {
        path: '/vocazione',
        name: 'VocazioniPage',
        component: Vocazione,
        meta: { requiresAuth: true }
    },
    {
        path: '/attivita',
        name: 'AttivitaPage',
        component: Attivita,
        meta: { requiresAuth: true }
    },
    {
        path: '/contatti',
        name: 'ContattiPage',
        component: Contatti,
        meta: { requiresAuth: true }
    },
    {
        path: '/approfondimenti',
        name: 'ApprofondimentiPage',
        component: Approfondimenti,
        meta: { requiresAuth: true }
    },
    {
        path: '/prega-con-noi',
        name: 'PregaPerNoiPage',
        component: PregaPerNoi,
        meta: { requiresAuth: true }
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

// router.beforeEach(function(to, _, next) {
//     if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
//         next('/auth');
//     } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
//         next('/');
//     } else {
//         next();
//     }
// });

export default router
