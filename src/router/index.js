import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/view/Home';
import Attivita from '@/view/Attivita';
import Contatti from '@/view/Contatti';
import Approfondimenti from '@/view/Approfondimenti';
import PregaPerNoi from '@/view/PregaPerNoi';
import Links from '@/view/Links';

import VocazioneLayout from '@/view/vocazione/VocazioneLayout';
import VocazioneHub from '@/view/vocazione/VocazioneHub';
import VocazionePercorso from '@/view/vocazione/VocazionePercorso';
import VocazioneDomande from '@/view/vocazione/VocazioneDomande';
import VocazioneProposta from '@/view/vocazione/VocazioneProposta';
import { decidiAccesso } from '@/utility/accessoVocazione.mjs';
import { scrollDifferito } from '@/utility/tempiTransizione.mjs';
import { destinazionePer } from '@/utility/destinazioneScroll.mjs';

// La sezione vocazionale esiste solo in italiano: nelle altre lingue le
// sotto-pagine tornano all'hub, che continua a servire la pagina breve
// preesistente. Un solo controllo, in un solo posto.
const presidioLingua = (to, from, next) => {
    const lingua = localStorage.getItem('lang') || 'it';
    const esito = decidiAccesso(lingua, to.name);
    return esito.consentito ? next() : next({ name: esito.redirezione });
};

const rotteVocazione = {
    path: '/vocazione',
    component: VocazioneLayout,
    children: [
        { path: '', name: 'vocazione', component: VocazioneHub },
        {
            path: 'discernimento', name: 'vocazione-discernimento', component: VocazionePercorso,
            props: { chiave: 'discernimento' }, beforeEnter: presidioLingua,
        },
        {
            path: 'matrimonio', name: 'vocazione-matrimonio', component: VocazionePercorso,
            props: { chiave: 'matrimonio' }, beforeEnter: presidioLingua,
        },
        {
            path: 'sacerdozio', name: 'vocazione-sacerdozio', component: VocazionePercorso,
            props: { chiave: 'sacerdozio' }, beforeEnter: presidioLingua,
        },
        {
            path: 'vita-consacrata', name: 'vocazione-vita-consacrata', component: VocazionePercorso,
            props: { chiave: 'vita-consacrata' }, beforeEnter: presidioLingua,
        },
        {
            path: 'domande', name: 'vocazione-domande', component: VocazioneDomande,
            beforeEnter: presidioLingua,
        },
        {
            path: 'proposta', name: 'vocazione-proposta', component: VocazioneProposta,
            beforeEnter: presidioLingua,
        },
        // Slug sconosciuto dentro la sezione: all'hub, non alla home.
        { path: ':qualsiasi(.*)', redirect: { name: 'vocazione' } },
    ],
};

const routes = [
    { path: '/', name: 'chi-siamo', component: Home },
    rotteVocazione,
    { path: '/attivita', name: 'attivita', component: Attivita },
    { path: '/contatti', name: 'contatti', component: Contatti },
    { path: '/approfondimenti', name: 'approfondimenti', component: Approfondimenti },
    { path: '/prega-con-noi', name: 'prega-con-noi', component: PregaPerNoi },
    { path: '/links', name: 'links', component: Links, meta: { standalone: true } },
    { path: '/:pathMatch(.*)*', component: Home },
];

// Il ritorno in cima si vedeva perche' avveniva mentre la pagina vecchia
// era ancora sullo schermo: lo scatto era il vero difetto, non lo scroll.
// Differendolo dentro l'uscita, il salto avviene a schermo gia' svuotato.
const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior: (verso, da) => scrollDifferito(destinazionePer(da.path, verso.path)),
});
export default router
