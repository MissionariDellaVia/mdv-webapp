import { defineStore } from 'pinia';

const ID_BLOG = '3352192114497284671';

export const usaBlog = defineStore('blog', {
  state: () => ({ articoli: [] }),

  actions: {
    async caricaArticoli(quanti) {
      const base = import.meta.env.VITE_API_BLOG_BASE_URL;
      const chiave = import.meta.env.VITE_BLOG_API_KEY;
      if (!base || !chiave) {
        throw new Error(
          'Configurazione del blog assente: VITE_API_BLOG_BASE_URL, VITE_BLOG_API_KEY. '
          + 'Copiare .env.example in .env e riempirlo.',
        );
      }

      const indirizzo = `${base}/blogs/${ID_BLOG}/posts`
        + `?key=${chiave}&maxResults=${quanti}&orderBy=published&fetchImages=true`;

      const risposta = await fetch(indirizzo);
      const dati = await risposta.json();
      if (!risposta.ok) {
        throw new Error(dati.message || `Errore caricamento articoli: HTTP ${risposta.status}`);
      }
      this.articoli = dati.items || [];
    },
  },
});
