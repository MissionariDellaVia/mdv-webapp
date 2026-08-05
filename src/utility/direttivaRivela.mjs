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
  decidiRivelazione,
} from './rivelazione.mjs';

// Soglia zero: basta che ne compaia un pezzo. Con una soglia in
// percentuale, un blocco piu' alto dello schermo non la raggiunge mai —
// non se ne puo' vedere il 10% se nello schermo ce ne sta il 9%.
const OPZIONI = { threshold: 0 };

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
  el.classList.remove(CLASSE_NASCOSTO);
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
