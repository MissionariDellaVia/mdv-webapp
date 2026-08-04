// src/utility/accessoVocazione.mjs
// La sezione vocazionale esiste solo in italiano. L'hub resta raggiungibile
// in ogni lingua perche' continua a servire la pagina breve preesistente.
const HUB = 'vocazione';

export function decidiAccesso(lingua, nomeRotta) {
  if (lingua === 'it' || nomeRotta === HUB) {
    return { consentito: true, redirezione: null };
  }
  return { consentito: false, redirezione: HUB };
}
