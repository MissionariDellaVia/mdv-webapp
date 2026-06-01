import data from '@/assets/data/data.json';
import { fetchLocations } from '@/services/locationsApi';

export default {
    async loadPage(context, page) {
        const lang = localStorage.getItem('lang') || 'it';
        if (page === 'attivita') {
            const supa = await fetchLocations(lang);
            const base = (data[lang] && data[lang].attivita) || { header: {}, main: {}, groups: [] };
            context.commit('setPage', { data: { ...base, groups: supa.groups || [] }, page });
            return;
        }
        const localData = data[lang] && data[lang][page];
        if (!localData) {
            throw new Error(`Contenuto non trovato per pagina "${page}" lingua "${lang}"`);
        }
        context.commit('setPage', { data: localData, page });
    },
    async changeLang(context, payload) {
        localStorage.setItem('lang', '' + payload.lang);
        context.commit('setNavbar', payload.lang);
        context.commit('setFooter', payload.lang);
        await context.dispatch('loadPage', payload.route);
    }
};
