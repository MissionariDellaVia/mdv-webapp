import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

import data from '../../../assets/data/data.json'
import navbar from '@/assets/data/navbar.json'
import footer from '@/assets/data/footer.json'

export default {
    namespaced: true,
    state() {
        return {
            navbar: navbar[localStorage.getItem('lang') ? localStorage.getItem('lang') : navigator.language.substring(0, 2)],
            footer: footer[localStorage.getItem('lang') ? localStorage.getItem('lang') : navigator.language.substring(0, 2)],
            chiSiamo: data["chi-siamo"],
            attivita: data["attivita"],
            vocazione: data["vocazione"],
            approfondimenti: data["approfondimenti"],
            pregaConNoi: data["prega-con-noi"],
            contatti: data["contatti"]
        };
    },
    mutations,
    actions,
    getters
};