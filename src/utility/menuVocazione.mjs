// Il menu della sezione: l'hub piu' le pagine dell'indice.
//
// L'hub non sta nell'indice — l'indice elenca le pagine interne — ma nel
// menu deve esserci, ed e' sempre la prima voce: e' il ritorno.
// Comporlo qui, e non dentro il componente, tiene l'intestazione
// riusabile anche fuori da questa sezione: le basta ricevere delle voci.
const HUB = { nome: 'vocazione', breve: 'Vocazione' };

export function componiMenu(indice) {
  if (!Array.isArray(indice)) return [HUB];
  return [HUB, ...indice.map(({ nome, breve }) => ({ nome, breve }))];
}
