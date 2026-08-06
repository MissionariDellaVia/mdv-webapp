// Ogni vista sta dentro una <transition>. Una <transition> puo' animare
// un solo elemento: se il componente ne espone piu' d'uno alla radice —
// e un commento accanto agli elementi conta come nodo — con mode="out-in"
// la fine dell'uscita non viene mai riconosciuta e il componente che
// doveva entrare non viene mai montato. In pagina non compare nulla, ma
// solo navigando: ricaricando funziona, perche' non c'e' nessuna uscita
// da aspettare.
//
// Costa mezzo secondo verificarlo e ha richiesto molto trovarlo.

const { parse } = require('@vue/compiler-sfc');

const ELEMENTO = 1;
const TESTO = 2;
const COMMENTO = 3;

// Lo spazio fra i tag non conta; un commento si'.
function significativo(nodo) {
  return !(nodo.type === TESTO && !nodo.content.trim());
}

function descrivi(nodo) {
  if (nodo.type === ELEMENTO) return nodo.tag;
  if (nodo.type === COMMENTO) return 'commento';
  return 'testo';
}

/**
 * Elenca i nodi radice significativi del <template> di un file .vue.
 * Un file senza template non ha radici da controllare.
 *
 * @param {string} sorgente contenuto del file .vue
 * @param {string} nomeFile solo per i messaggi d'errore del compilatore
 * @returns {string[]} descrizione di ogni nodo radice, in ordine
 */
function radiciDi(sorgente, nomeFile = 'anonimo.vue') {
  const { descriptor } = parse(sorgente, { filename: nomeFile });
  if (!descriptor.template || !descriptor.template.ast) return [];
  return descriptor.template.ast.children.filter(significativo).map(descrivi);
}

module.exports = { radiciDi };
