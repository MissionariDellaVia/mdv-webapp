import { createApp } from 'vue';
import { utilityFunction } from './utility/utility.js';
import { direttivaRivela } from './utility/direttivaRivela.mjs';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import router from './router';
import store from './store/index.js';

import App from './App.vue';
import BaseSpinner from './components/ui/BaseSpinner'
import BaseToast from './components/ui/BaseToast'
import BaseButton from "@/components/ui/BaseButton";
import BackButton from "@/components/ui/BackButton";
import ImageDialog from "@/components/ui/ImageDialog";

// Bootstrap Style
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap';

// Token visivi: unica fonte di colori, font e spaziature
import './assets/css/tokens.css';

// Markdown
import Markdown from 'vue3-markdown-it';

// Css
// animate.css e il tema di highlight.js erano importati ma non usati da
// nessuno: 71 KB di CSS scaricati da ogni visitatore per niente. Il tema
// di highlight serve solo ai blocchi di codice, che nei contenuti del
// sito non esistono.
import "/node_modules/flag-icons/css/flag-icons.min.css";

const app = createApp(App)
app.use(router);
app.use(store);
app.use(autoAnimatePlugin);
app.use(Markdown);

app.config.globalProperties.$util = utilityFunction;

app.directive('rivela', direttivaRivela);

app.component('base-spinner', BaseSpinner);
app.component('base-toast', BaseToast);
app.component('base-button', BaseButton);
app.component('back-button', BackButton);
app.component('image-dialog', ImageDialog);

app.mount('#app');
