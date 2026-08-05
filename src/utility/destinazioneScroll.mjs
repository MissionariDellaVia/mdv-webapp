import { inVocazione } from './inVocazione.mjs';

// Ancora sul contenuto della sezione, sotto l'intestazione.
export const ANCORA_CONTENUTO = '#voc-contenuto';

// Quanto spazio lasciare sopra: la navbar e' fissa e coprirebbe le prime
// righe. Vale --mdv-altezza-navbar (6.5rem) piu' un po' d'aria.
export const STACCO = 120;

// Il menu della sezione vive dentro l'intestazione: passando da una
// pagina all'altra, tornare in cima rimetterebbe davanti l'intestazione
// che si e' appena usata, lasciando il contenuto sotto la piega. Fra due
// pagine della sezione si arriva quindi direttamente al contenuto.
// L'hub fa eccezione: e' la copertina, va vista dall'inizio.
export function destinazionePer(percorsoDa, percorsoA) {
  const dentroDa = inVocazione(percorsoDa);
  const dentroA = inVocazione(percorsoA);
  const versoHub = percorsoA === '/vocazione' || percorsoA === '/vocazione/';

  if (dentroDa && dentroA && !versoHub) {
    return { el: ANCORA_CONTENUTO, top: STACCO };
  }
  return { top: 0 };
}
