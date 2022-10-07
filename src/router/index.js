import { createRouter, createWebHashHistory } from 'vue-router'
// import store from '../store/index.js';

import Home from '../view/Home';
import Vocazione from '../view/Vocazione';
import Attivita from '../view/Attivita';
import Contatti from '../view/Contatti';
import PregaConNoi from '../view/PregaConNoi';

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
        name: 'Vocazione',
        component: Vocazione,
        meta: { requiresAuth: true }
    },
    {
        path: '/attivita',
        name: 'Attivita',
        component: Attivita,
        meta: { requiresAuth: true }
    },
    {
        path: '/contatti',
        name: 'Contatti',
        component: Contatti,
        meta: { requiresAuth: true }
    },
    {
        path: '/prega-con-noi',
        name: 'PregaConNoi',
        component: PregaConNoi,
        meta: { requiresAuth: true }
    },
    { path: '/:notFound(.*)', component: Home }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
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
