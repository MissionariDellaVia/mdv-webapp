import data from '@/assets/data/data.json';
import { fetchLocations } from '@/services/locationsApi';

// Etichette contatti per lingua (i contatti sono dinamici dai luoghi; le label restano UI tradotte).
const CONTACT_LABELS = {
  it: { frate: 'Frati', suora: 'Suore', phone: 'Telefono' },
  en: { frate: 'Friars', suora: 'Nuns', phone: 'Phone' },
  es: { frate: 'Frailes', suora: 'Hermanas', phone: 'Teléfono' },
  fr: { frate: 'Frères', suora: 'Sœurs', phone: 'Téléphone' },
  pl: { frate: 'Bracia', suora: 'Siostry', phone: 'Telefon' },
  pt: { frate: 'Frades', suora: 'Irmãs', phone: 'Telefone' },
};

function buildPlaces(groups, lang) {
  const L = CONTACT_LABELS[lang] || CONTACT_LABELS.it;
  return (groups || []).map((g) => {
    const addressLines = String(g.address || '')
      .split('\n').map((s) => s.trim()).filter(Boolean);
    return {
      title: g.city || g.title,
      address: [`**${g.title}**`, ...addressLines],
      phone: { title: `**${L.phone}:**`, number: g.phone || '' },
      emails: (g.emails || []).map((e) => ({ title: `**${L[e.type] || e.type}:**`, email: e.email })),
      lat: g.latitude != null ? String(g.latitude) : null,
      lng: g.longitude != null ? String(g.longitude) : null,
    };
  });
}

export default {
    async loadPage(context, page) {
        const lang = localStorage.getItem('lang') || 'it';

        if (page === 'attivita') {
            const responseData = await fetchLocations(lang);
            context.commit('setPage', { data: responseData, page });
            return;
        }

        if (page === 'contatti') {
            const supa = await fetchLocations(lang);
            const base = (data[lang] && data[lang].contatti) || { header: {}, form: {}, places: [] };
            context.commit('setPage', { data: { ...base, places: buildPlaces(supa.groups, lang) }, page });
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
