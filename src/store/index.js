import { createStore } from 'vuex';

import pageModule from '@/store/modules/page';
import authModule from '@/store/modules/auth';

export default createStore({
    modules: {
        page: pageModule,
        auth: authModule
    }
});
