// Quando Bootstrap e' uscito dal progetto, le sue classi sono rimaste
// scritte nei template senza che niente le colpisse piu'. Non fanno
// rumore: il titolo delle sezioni della home aveva "fs-3" ed e' semplicemente
// tornato della grandezza del testo normale, senza errori da nessuna parte.
//
// Qui si elencano le classi che erano solo di Bootstrap e che Tailwind non
// ha. Se una compare in un template, o e' una svista o va definita a mano.

const RE_CLASSE = /\bclass="([^"]*)"/g;
const RE_BLOCCO_STILE = /<style[\s\S]*?<\/style>/g;

// Solo nomi che Bootstrap aveva e Tailwind non ha. Le classi che esistono
// in entrambi (text-center, mx-auto, mb-4, shadow, order-last...) non
// vanno qui: continuano a funzionare.
const SOLO_BOOTSTRAP = [
  'fs-1', 'fs-2', 'fs-3', 'fs-4', 'fs-5', 'fs-6',
  'text-uppercase', 'text-start', 'text-end',
  'text-md-start', 'text-md-end', 'text-sm-start', 'text-sm-end',
  'fw-bold', 'fw-normal', 'fw-light',
  'img-fluid', 'clearfix', 'list-inline', 'list-inline-item',
  'card', 'card-header', 'card-body', 'card-title', 'card-img-top',
  'btn', 'btn-primary', 'form-control', 'form-floating', 'form-label',
  'row', 'col', 'gy-1', 'gy-2', 'gy-3', 'gy-4', 'gy-5',
  'float-start', 'float-end', 'float-md-start', 'float-md-end', 'float-sm-none',
  'align-self-start', 'align-self-end', 'align-items-center',
  'justify-content-center', 'ms-auto', 'me-auto',
  'nav', 'nav-pills', 'nav-link', 'nav-item', 'tab-content', 'tab-pane',
  'navbar', 'navbar-brand', 'navbar-toggler', 'navbar-nav', 'navbar-expand-lg',
  'offcanvas', 'offcanvas-header', 'offcanvas-body',
  'dropdown', 'dropdown-menu', 'dropdown-item', 'dropdown-toggle',
  'text-muted', 'shadow-sm', 'pe-3', 'ps-3',
  'position-absolute', 'position-relative', 'position-fixed',
  'top-50', 'start-50', 'translate-middle',
];

const RE_COLONNA = /^col-(?:sm|md|lg|xl|xxl)?-?\d{1,2}$/;

function classiUsate(sorgente) {
  // Gli stili non contengono classi da controllare, e i commenti dentro i
  // template neppure: si guardano solo gli attributi class del markup.
  const senzaStili = sorgente.replace(RE_BLOCCO_STILE, '');
  const trovate = new Set();
  for (const [, valore] of senzaStili.matchAll(RE_CLASSE)) {
    for (const nome of valore.split(/\s+/)) {
      if (nome) trovate.add(nome);
    }
  }
  return [...trovate];
}

// Una classe elencata puo' restare se il file se la definisce da solo:
// in quel caso non e' orfana, e' sua.
function definitaInLoco(sorgente, nome) {
  const stili = (sorgente.match(RE_BLOCCO_STILE) || []).join('\n');
  return stili.includes(`.${nome}`);
}

/**
 * Elenca le classi di Bootstrap rimaste in un file senza che nulla le
 * definisca.
 */
function classiOrfane(sorgente) {
  return classiUsate(sorgente)
    .filter((nome) => SOLO_BOOTSTRAP.includes(nome) || RE_COLONNA.test(nome))
    .filter((nome) => !definitaInLoco(sorgente, nome))
    .sort();
}

module.exports = { classiOrfane, classiUsate, SOLO_BOOTSTRAP };
