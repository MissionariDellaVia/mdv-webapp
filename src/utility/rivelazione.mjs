// Regole della rivelazione allo scorrimento, separate dalla direttiva che
// le applica: qui non si tocca il DOM, quindi si possono provare.

export const CLASSE_NASCOSTO = 'da-rivelare';
export const CLASSE_RIVELATO = 'rivelato';

/**
 * Dove passa la linea che fa scattare la rivelazione, in frazione
 * dell'altezza dello schermo contata dall'alto.
 *
 * A 1 la linea coincide col bordo inferiore: l'elemento si rivela appena
 * lo sfiora, cioe' quando e' ancora fuori dagli occhi, e quando lo si
 * guarda l'animazione e' gia' finita da un pezzo — sembra che le cose
 * arrivino gia' fatte. A 0,8 la linea sta un quinto piu' su: l'elemento
 * si scopre mentre entra davvero nel campo visivo.
 */
export const SOGLIA_VISTA = 0.8;

// Il margine che sposta la linea per l'osservatore: la stessa frazione,
// scritta come la vuole IntersectionObserver.
export const MARGINE_OSSERVATORE = `0px 0px -${Math.round((1 - SOGLIA_VISTA) * 100)}% 0px`;

/**
 * Un elemento si nasconde solo se comincia oltre la linea di scatto.
 *
 * E' la regola che tiene in piedi tutto il resto. Nascondere anche cio'
 * che e' gia' davanti agli occhi significa affidare la leggibilita' del
 * testo a un osservatore che deve poi ricordarsi di riaccenderlo: se per
 * qualsiasi ragione non scatta — l'elemento viene riusato invece che
 * ricreato, l'osservatore e' gia' stato staccato, l'API non c'e' — il
 * contenuto resta invisibile. Cosi' invece il caso peggiore e' un'entrata
 * mancata, mai una pagina vuota.
 *
 * La linea e' la stessa che usa l'osservatore per rivelare: se le due
 * non coincidessero, un elemento potrebbe nascondersi e non rivelarsi
 * mai, o rivelarsi prima di essersi nascosto.
 *
 * @param {number} cima distanza del bordo superiore dal bordo dello schermo
 * @param {number} altezzaFinestra altezza della finestra
 */
export function deveNascondersi(cima, altezzaFinestra) {
  if (!Number.isFinite(cima) || !Number.isFinite(altezzaFinestra)) return false;
  return cima > altezzaFinestra * SOGLIA_VISTA;
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
