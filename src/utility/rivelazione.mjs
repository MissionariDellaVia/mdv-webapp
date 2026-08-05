// Regole della rivelazione allo scorrimento, separate dalla direttiva che
// le applica: qui non si tocca il DOM, quindi si possono provare.

export const CLASSE_NASCOSTO = 'da-rivelare';
export const CLASSE_RIVELATO = 'rivelato';

/**
 * Un elemento si nasconde solo se comincia sotto il bordo dello schermo.
 *
 * E' la regola che tiene in piedi tutto il resto. Nascondere anche cio'
 * che e' gia' davanti agli occhi significa affidare la leggibilita' del
 * testo a un osservatore che deve poi ricordarsi di riaccenderlo: se per
 * qualsiasi ragione non scatta — l'elemento viene riusato invece che
 * ricreato, l'osservatore e' gia' stato staccato, l'API non c'e' — il
 * contenuto resta invisibile. Cosi' invece il caso peggiore e' un'entrata
 * mancata, mai una pagina vuota.
 *
 * @param {number} cima distanza del bordo superiore dal bordo dello schermo
 * @param {number} altezzaFinestra altezza della finestra
 */
export function deveNascondersi(cima, altezzaFinestra) {
  if (!Number.isFinite(cima) || !Number.isFinite(altezzaFinestra)) return false;
  return cima > altezzaFinestra;
}

/**
 * Decide cosa fare di un elemento al montaggio o a ogni suo aggiornamento.
 * Restituisce 'rivela' oppure 'nascondi': la direttiva si limita a
 * eseguire, e questa funzione resta verificabile senza un browser.
 */
export function decidiRivelazione({ cima, altezzaFinestra, osservabile, movimentoRidotto }) {
  if (movimentoRidotto || !osservabile) return 'rivela';
  return deveNascondersi(cima, altezzaFinestra) ? 'nascondi' : 'rivela';
}
