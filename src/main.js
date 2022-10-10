import { createApp } from 'vue';
import { utilityFunction } from './utility/utility.js';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import router from './router';
import store from './store/index.js';

import App from './App.vue';
import BaseSpinner from './components/ui/BaseSpinner'

// Bootstrap Style
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap';

// Markdown
import Markdown from 'vue3-markdown-it';

// Css
import 'animate.css';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import 'highlight.js/styles/monokai.css';

const app = createApp(App)
app.use(router);
app.use(store);
app.use(autoAnimatePlugin);
app.use(Markdown);

app.config.globalProperties.$util = utilityFunction;

app.component('base-spinner', BaseSpinner);

app.mount('#app');
