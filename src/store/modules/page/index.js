import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

import data from '../../../assets/data/data.json'

export default {
    namespaced: true,
    state() {
        return {
            chiSiamo: data["chi-siamo"],
            attivita: data["attivita"],
            vocazione: data["vocazione"],
            approfondimenti: data["approfondimenti"],
            pregaConNoi: data["prega-con-noi"],
        };
    },
    mutations,
    actions,
    getters
};