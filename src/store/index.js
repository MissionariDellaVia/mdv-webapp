import { createStore } from 'vuex';

import pageModule from '@/store/modules/page';
import blogModule from '@/store/modules/blog';

export default createStore({
    modules: {
        page: pageModule,
        blog: blogModule,
    }
});
