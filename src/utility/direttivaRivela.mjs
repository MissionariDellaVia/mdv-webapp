// src/utility/direttivaRivela.mjs
// Rivela un elemento quando entra in vista, una volta sola: se il movimento
// si ripetesse a ogni scorrimento, rileggere una pagina diventerebbe faticoso.
//
// La direttiva applica soltanto le decisioni prese in rivelazione.mjs, che
// non tocca il DOM ed e' verificabile. Qui restano il ciclo di vita e
// l'osservatore.
import {
  CLASSE_NASCOSTO,
  CLASSE_RIVELATO,
  MARGINE_OSSERVATORE,
  decidiRivelazione,
} from './rivelazione.mjs';

// Soglia zero: basta che ne compaia un pezzo. Con una soglia in
// percentuale, un blocco piu' alto dello schermo non la raggiunge mai —
// non se ne puo' vedere il 10% se nello schermo ce ne sta il 9%.
//
// Il margine alza la linea di scatto rispetto al bordo inferiore: senza,
// l'elemento si rivela mentre lo sfiora e quando lo si guarda ha gia'
// finito. La frazione e' la stessa che decide chi nascondere.
const OPZIONI = { threshold: 0, rootMargin: MARGINE_OSSERVATORE };

const stati = new WeakMap();

function osservabile() {
  return typeof IntersectionObserver !== 'undefined';
}

function movimentoRidotto() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function stacca(el) {
  const stato = stati.get(el);
  if (!stato) return;
  stato.osservatore.disconnect();
  stati.delete(el);
}

function rivela(el) {
  // La classe "nascosto" NON si toglie: e' lei a dichiarare la
  // transizione. Togliendola, il browser non ha piu' niente da cui
  // interpolare e l'elemento salta da trasparente a pieno di colpo.
  // "rivelato" viene dopo nel foglio e ne sovrascrive i valori: la
  // transizione resta e il passaggio si vede.
  el.classList.add(CLASSE_RIVELATO);
  stacca(el);
}

function nascondi(el) {
  if (stati.has(el)) return;
  el.classList.add(CLASSE_NASCOSTO);
  const osservatore = new IntersectionObserver((voci) => {
    if (voci.some((voce) => voce.isIntersecting)) rivela(el);
  }, OPZIONI);
  osservatore.observe(el);
  stati.set(el, { osservatore });
}

function valuta(el) {
  if (el.classList.contains(CLASSE_RIVELATO)) return;
  const esito = decidiRivelazione({
    cima: el.getBoundingClientRect().top,
    altezzaFinestra: window.innerHeight,
    osservabile: osservabile(),
    movimentoRidotto: movimentoRidotto(),
  });
  if (esito === 'rivela') rivela(el);
  else nascondi(el);
}

export const direttivaRivela = {
  mounted: valuta,
  // Cambiando pagina dentro una sezione, Vue riusa gli elementi invece di
  // ricrearli: senza questo controllo un blocco rimasto nascosto sulla
  // pagina precedente resterebbe nascosto anche qui, dove magari e'
  // perfettamente in vista.
  updated: valuta,
  unmounted: stacca,
};
