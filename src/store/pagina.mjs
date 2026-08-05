import { defineStore } from 'pinia';
import data from '@/assets/data/data.json';
import navbar from '@/assets/data/navbar.json';
import footer from '@/assets/data/footer.json';
import { fetchLocations } from '@/services/locationsApi';

// Etichette dei contatti per lingua: i luoghi sono dinamici, queste no.
const ETICHETTE_CONTATTI = {
  it: { frate: 'Frati', suora: 'Suore', phone: 'Telefono' },
  en: { frate: 'Friars', suora: 'Nuns', phone: 'Phone' },
  es: { frate: 'Frailes', suora: 'Hermanas', phone: 'Teléfono' },
  fr: { frate: 'Frères', suora: 'Sœurs', phone: 'Téléphone' },
  pl: { frate: 'Bracia', suora: 'Siostry', phone: 'Telefon' },
  pt: { frate: 'Frades', suora: 'Irmãs', phone: 'Telefone' },
};

// Il nome della rotta e la proprieta' che la contiene non coincidono
// sempre. La corrispondenza sta qui: prima era uno switch di sessanta
// righe dentro le mutation, che diceva la stessa cosa sei volte.
const PROPRIETA = {
  'chi-siamo': 'chiSiamo',
  attivita: 'attivita',
  vocazione: 'vocazione',
  approfondimenti: 'approfondimenti',
  'prega-con-noi': 'pregaConNoi',
  contatti: 'contatti',
};

const LINGUA_PREDEFINITA = 'it';

function linguaSalvata() {
  return localStorage.getItem('lang')
    || navigator.language.substring(0, 2)
    || LINGUA_PREDEFINITA;
}

// data.json e' indicizzato prima per lingua: leggerlo senza passare da li'
// restituisce undefined. Lo stato iniziale lo faceva, quindi ogni pagina
// partiva vuota e si riempiva solo dopo il primo caricamento.
function contenutoLocale(lingua, pagina) {
  return (data[lingua] && data[lingua][pagina]) || null;
}

function costruisciLuoghi(gruppi, lingua) {
  const etichette = ETICHETTE_CONTATTI[lingua] || ETICHETTE_CONTATTI.it;
  return (gruppi || []).map((g) => {
    const righeIndirizzo = String(g.address || '')
      .split('\n').map((s) => s.trim()).filter(Boolean);
    return {
      title: g.city || g.title,
      address: [`**${g.title}**`, ...righeIndirizzo],
      phone: { title: `**${etichette.phone}:**`, number: g.phone || '' },
      emails: (g.emails || []).map((e) => ({
        title: `**${etichette[e.type] || e.type}:**`,
        email: e.email,
      })),
      lat: g.latitude != null ? String(g.latitude) : null,
      lng: g.longitude != null ? String(g.longitude) : null,
    };
  });
}

export const usaPagina = defineStore('pagina', {
  state: () => {
    const lingua = linguaSalvata();
    return {
      lingua,
      navbar: navbar[lingua] || navbar.it,
      footer: footer[lingua] || footer.it,
      chiSiamo: contenutoLocale(lingua, 'chi-siamo'),
      attivita: { header: {}, main: {}, groups: [] },
      vocazione: contenutoLocale(lingua, 'vocazione'),
      approfondimenti: contenutoLocale(lingua, 'approfondimenti'),
      pregaConNoi: contenutoLocale(lingua, 'prega-con-noi'),
      contatti: contenutoLocale(lingua, 'contatti'),
    };
  },

  actions: {
    // In Vuex questa era una mutation con uno switch di sei rami che
    // facevano tutti la stessa assegnazione.
    riponi(pagina, contenuto) {
      const proprieta = PROPRIETA[pagina];
      if (!proprieta) {
        console.warn(`[pagina] nessuna proprieta' per "${pagina}"`);
        return;
      }
      this[proprieta] = contenuto;
    },

    async caricaPagina(pagina) {
      const lingua = this.lingua;

      // Le due pagine ibride: intestazione e testi vengono dal JSON locale,
      // solo gli elenchi da Supabase. Aspettare la rete anche per la parte
      // statica faceva comparire l'intestazione un secondo dopo, e la
      // pagina cresceva di colpo sotto gli occhi.
      if (pagina === 'attivita') {
        const base = contenutoLocale(lingua, 'attivita') || { header: {}, main: {}, groups: [] };
        this.riponi('attivita', { ...base, groups: [] });

        const remoto = await fetchLocations(lingua);
        this.riponi('attivita', { ...base, groups: remoto.groups || [] });
        return;
      }

      if (pagina === 'contatti') {
        const base = contenutoLocale(lingua, 'contatti') || { header: {}, form: {}, places: [] };
        this.riponi('contatti', { ...base, places: [] });

        const remoto = await fetchLocations(lingua);
        this.riponi('contatti', { ...base, places: costruisciLuoghi(remoto.groups, lingua) });
        return;
      }

      const contenuto = contenutoLocale(lingua, pagina);
      if (!contenuto) {
        throw new Error(`Contenuto non trovato per pagina "${pagina}" lingua "${lingua}"`);
      }
      this.riponi(pagina, contenuto);
    },

    async cambiaLingua(lingua, rotta) {
      // La lingua e' nello stato, non solo in localStorage: prima chi
      // doveva reagire al cambio leggeva un getter a caso solo per farsi
      // ricalcolare, ed era un trucco che andava spiegato ogni volta.
      this.lingua = lingua;
      localStorage.setItem('lang', String(lingua));
      this.navbar = navbar[lingua] || navbar.it;
      this.footer = footer[lingua] || footer.it;
      await this.caricaPagina(rotta);
    },
  },
});
