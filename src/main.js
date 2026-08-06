import { createApp } from 'vue';
import { utilityFunction } from './utility/utility.js';
import { direttivaRivela } from './utility/direttivaRivela.mjs';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import router from './router';
import { createPinia } from 'pinia';

import App from './App.vue';
import BaseSpinner from './components/ui/BaseSpinner.vue'
import BaseToast from './components/ui/BaseToast.vue'
import ImageDialog from "@/components/ui/ImageDialog.vue";


// Un solo foglio d'ingresso: dichiara l'ordine dei layer e tira dentro
// token, Tailwind e quel che resta di Bootstrap.
import './assets/css/stile.css';

// Markdown
import Markdown from 'vue3-markdown-it';

// Css
// animate.css e il tema di highlight.js erano importati ma non usati da
// nessuno: 71 KB di CSS scaricati da ogni visitatore per niente. Il tema
// di highlight serve solo ai blocchi di codice, che nei contenuti del
// sito non esistono.

const app = createApp(App)
app.use(router);
app.use(createPinia());
app.use(autoAnimatePlugin);
app.use(Markdown);

app.config.globalProperties.$util = utilityFunction;

app.directive('rivela', direttivaRivela);

app.component('base-spinner', BaseSpinner);
app.component('base-toast', BaseToast);
app.component('image-dialog', ImageDialog);

app.mount('#app');
