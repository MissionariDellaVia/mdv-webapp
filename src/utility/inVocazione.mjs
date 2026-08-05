// src/utility/inVocazione.mjs
// Decide se una rotta appartiene alla sezione vocazionale. Serve sia per
// l'atmosfera cromatica sia per scegliere la transizione fra le pagine.
const RADICE = '/vocazione';

export function inVocazione(percorso) {
  if (typeof percorso !== 'string' || percorso.length === 0) return false;
  return percorso === RADICE || percorso.startsWith(`${RADICE}/`);
}
