import { createApp } from 'vue';
import { utilityFunction } from './utility/utility.js';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import router from './router';
import store from './store/index.js';

import App from './App.vue';
import BaseSpinner from './components/ui/BaseSpinner'
import BaseToast from './components/ui/BaseToast'
import BaseCard from './components/ui/BaseCard'
import BaseDashboard from "@/components/ui/BaseDashboard";
import BaseButton from "@/components/ui/BaseButton";
import BackButton from "@/components/ui/BackButton";

// Bootstrap Style
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap';

// Markdown
import Markdown from 'vue3-markdown-it';

// Css
import 'animate.css';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import 'highlight.js/styles/monokai.css';

window.localStorage.setItem('lang', ''+navigator.language);

const app = createApp(App)
app.use(router);
app.use(store);
app.use(autoAnimatePlugin);
app.use(Markdown);

app.config.globalProperties.$util = utilityFunction;

app.component('base-spinner', BaseSpinner);
app.component('base-toast', BaseToast);
app.component('base-card', BaseCard);
app.component('base-dashboard', BaseDashboard);
app.component('base-button', BaseButton);
app.component('back-button', BackButton);

app.mount('#app');
