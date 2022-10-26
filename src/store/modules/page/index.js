import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

import data from '../../../assets/data/data.json'
import navbar from '@/assets/data/navbar.json'
// import navbar from '@/assets/data/navbar.json'

export default {
    namespaced: true,
    state() {
        return {
            navbar: navbar[localStorage.getItem('lang') == null ? localStorage.getItem('lang') : navigator.language.slice(0,2)],
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