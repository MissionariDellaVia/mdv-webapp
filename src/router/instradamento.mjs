/* Modalita' degli indirizzi, in un posto solo.
 *
 * Oggi il router usa la cronologia con il cancelletto: l'indirizzo vero di
 * ogni pagina e' /#/vocazione, non /vocazione. E' l'unica cosa che
 * funziona su un hosting statico che non sa riscrivere le richieste.
 *
 * Ha pero' un prezzo che vale la pena scrivere: quello che sta dopo il
 * cancelletto e' un frammento, e i motori di ricerca lo ignorano. Sette
 * pagine della sezione vocazionale, per Google, sono la home. Nelle
 * sitemap i frammenti non sono nemmeno ammessi — infatti il plugin li
 * scartava in silenzio, e il file finiva per dichiarare otto indirizzi
 * che sul server rispondono con un rimando alla pagina di errore.
 *
 * Per passare agli indirizzi veri servono due cose insieme:
 *   1. questa costante a true;
 *   2. il server che, davanti a un indirizzo sconosciuto, restituisce
 *      index.html invece della pagina di errore (su Apache una regola di
 *      riscrittura in .htaccess; su GitHub Pages una copia 404.html).
 *
 * Senza la seconda, cambiare solo la prima rompe ogni collegamento
 * profondo del sito. Per questo la costante sta qui e non nel router: la
 * sitemap la legge dallo stesso posto, e le due non possono divergere.
 */
export const USA_CRONOLOGIA_HTML5 = false;

// Le pagine pubbliche, con i dati che servono alla sitemap.
export const ROTTE_PUBBLICHE = [
  { path: '/', lastmod: '2023-06-13', priority: 1.0, changefreq: 'yearly' },
  { path: '/vocazione', lastmod: '2026-08-04', priority: 0.9, changefreq: 'yearly' },
  { path: '/vocazione/discernimento', lastmod: '2026-08-04', priority: 0.8, changefreq: 'yearly' },
  { path: '/vocazione/matrimonio', lastmod: '2026-08-04', priority: 0.8, changefreq: 'yearly' },
  { path: '/vocazione/sacerdozio', lastmod: '2026-08-04', priority: 0.8, changefreq: 'yearly' },
  { path: '/vocazione/vita-consacrata', lastmod: '2026-08-04', priority: 0.8, changefreq: 'yearly' },
  { path: '/vocazione/domande', lastmod: '2026-08-04', priority: 0.7, changefreq: 'yearly' },
  { path: '/vocazione/proposta', lastmod: '2026-08-04', priority: 0.7, changefreq: 'yearly' },
  { path: '/approfondimenti', lastmod: '2023-06-13', priority: 0.6, changefreq: 'yearly' },
  { path: '/prega-con-noi', lastmod: '2023-06-13', priority: 0.7, changefreq: 'yearly' },
  { path: '/attivita', lastmod: '2023-06-13', priority: 1.0, changefreq: 'monthly' },
  { path: '/contatti', lastmod: '2023-06-13', priority: 0.9, changefreq: 'yearly' },
];

/**
 * Le rotte che ha senso dichiarare in sitemap.
 *
 * Col cancelletto ne esiste una sola raggiungibile: la radice. Meglio
 * dichiarare un indirizzo vero che otto che rimandano a una pagina di
 * errore — quelli fanno danno, non restano semplicemente inutili.
 */
export function rotteDaPubblicare(usaCronologiaHtml5 = USA_CRONOLOGIA_HTML5) {
  if (usaCronologiaHtml5) return ROTTE_PUBBLICHE;
  return ROTTE_PUBBLICHE.filter((rotta) => rotta.path === '/');
}
