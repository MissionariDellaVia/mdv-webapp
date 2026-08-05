// src/utility/direttivaRivela.mjs
// Rivela un elemento quando entra in vista, una volta sola: se il movimento
// si ripetesse a ogni scorrimento, rileggere una pagina diventerebbe faticoso.

// Soglia zero: basta che ne compaia un pezzo. Con una soglia in
// percentuale, un blocco piu' alto dello schermo non la raggiunge mai —
// non se ne puo' vedere il 10% se nello schermo ce ne sta il 9% — e resta
// invisibile per sempre. E' cosi' che il contenuto spariva.
const OPZIONI = { threshold: 0, rootMargin: '0px 0px -5% 0px' };

// Rete di sicurezza: se per qualunque ragione l'osservatore non parte, il
// testo si mostra comunque. Un'animazione mancata e' un dettaglio; del
// testo invisibile e' una pagina rotta.
const RESA_MS = 1500;

const stati = new WeakMap();

function rivela(el) {
  el.classList.add('rivelato');
  smetti(el);
}

function smetti(el) {
  const stato = stati.get(el);
  if (!stato) return;
  if (stato.osservatore) stato.osservatore.disconnect();
  clearTimeout(stato.resa);
  stati.delete(el);
}

export const direttivaRivela = {
  mounted(el) {
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (ridotto || typeof IntersectionObserver === 'undefined') {
      el.classList.add('rivelato');
      return;
    }

    el.classList.add('da-rivelare');
    const stato = {};
    stati.set(el, stato);

    stato.osservatore = new IntersectionObserver((voci) => {
      if (voci.some((voce) => voce.isIntersecting)) rivela(el);
    }, OPZIONI);
    stato.osservatore.observe(el);
    stato.resa = setTimeout(() => rivela(el), RESA_MS);
  },
  // Senza questo, ogni navigazione lasciava dietro un osservatore e un
  // timer per ogni blocco della pagina appena lasciata.
  unmounted(el) {
    smetti(el);
  },
};
