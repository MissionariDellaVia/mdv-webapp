// Dov'e' la radice del sito. Non e' la stessa nei due posti in cui
// pubblichiamo, ed e' per questo che va decisa in un punto solo.
//
// In produzione il sito e' un dominio intero (missionaridellavia.net),
// quindi la radice e' "/". In collaudo e' il sito di progetto di questo
// repository su GitHub Pages, e sta sotto il nome del repository:
// chiedere "/assets/index.js" da li' significa chiederlo alla radice di
// missionaridellavia.github.io, dove non c'e' niente.
//
// Fino ad agosto 2026 la scelta guardava il comando invece della
// modalita': "vite build" dava "/" a ogni build, anche a quella di
// collaudo. Il sito veniva pubblicato e restava bianco, perche' ogni
// asset rispondeva 404 — e la pagina non dice mai perche'.

// Il nome del repository e' anche il percorso sotto cui Pages pubblica.
// Sono la stessa cosa: se il repository viene rinominato, va cambiato
// qui e basta.
export const NOME_REPOSITORY = 'mdv-webapp';

export const BASE_PRODUZIONE = '/';
export const BASE_COLLAUDO = `/${NOME_REPOSITORY}/`;

/**
 * La base da dare a Vite, decisa dalla modalita' del build.
 *
 * "npm run build" gira in modalita' produzione ed e' quel che va su
 * Aruba; "npm run stage" passa --mode development ed e' quel che va su
 * Pages. Il server di sviluppo e' anch'esso in development, e infatti
 * risponde su localhost:9191/mdv-webapp/.
 */
export function basePer(modalita) {
  return modalita === 'production' ? BASE_PRODUZIONE : BASE_COLLAUDO;
}
