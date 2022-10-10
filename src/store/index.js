import { createStore } from 'vuex';

import pageModule from '@/store/modules/page';
import blogModule from '@/store/modules/blog';
import authModule from '@/store/modules/auth';

export default createStore({
    modules: {
        page: pageModule,
        blog: blogModule,
        auth: authModule
    }
});
