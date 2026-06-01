import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/view/Home';
import Vocazione from '@/view/Vocazione';
import Attivita from '@/view/Attivita';
import Contatti from '@/view/Contatti';
import Approfondimenti from '@/view/Approfondimenti';
import PregaPerNoi from '@/view/PregaPerNoi';
import Links from '@/view/Links';

const routes = [
    { path: '/', name: 'chi-siamo', component: Home },
    { path: '/vocazione', name: 'vocazione', component: Vocazione },
    { path: '/attivita', name: 'attivita', component: Attivita },
    { path: '/contatti', name: 'contatti', component: Contatti },
    { path: '/approfondimenti', name: 'approfondimenti', component: Approfondimenti },
    { path: '/prega-con-noi', name: 'prega-con-noi', component: PregaPerNoi },
    { path: '/links', name: 'links', component: Links, meta: { standalone: true } },
    { path: '/:pathMatch(.*)*', component: Home },
];

const router = createRouter({ history: createWebHashHistory(), routes, scrollBehavior() { return { top: 0 }; } });
export default router
