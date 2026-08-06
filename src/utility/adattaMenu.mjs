// Quanto rimpicciolire il menu della sezione perche' le voci ci stiano.
//
// Il menu sta su una riga sola: e' il punto fermo della sezione, e una
// riga che va a capo smette di leggersi come una riga. Ma quando le
// voci non ci stanno restano solo tre strade, e due sono brutte:
// tagliarle (e "Proposta" diventa "Propost"), sfumarle ai bordi (e
// sembrano sbiadite anche quando ci starebbero), oppure rimpicciolire
// il testo quel tanto che basta. La terza e' l'unica che non mente su
// cosa c'e' scritto.
//
// Sotto una certa misura pero' non si legge piu', e a quel punto una
// riga che va a capo e' meglio di una riga illeggibile. Quello e' il
// minimo: sotto, si cede sulla riga singola, non sulla leggibilita'.

export const FATTORE_MINIMO = 0.68;

function misuraValida(valore) {
  return Number.isFinite(valore) && valore > 0;
}

/**
 * Decide come far stare il contenuto nello spazio disponibile.
 *
 * Restituisce il fattore per cui moltiplicare corpo del testo e
 * spaziature — che scalano insieme, quindi una passata sola basta e non
 * serve iterare — e se bisogna comunque andare a capo.
 */
export function adattamento(contenuto, disponibile, minimo = FATTORE_MINIMO) {
  if (!misuraValida(contenuto) || !misuraValida(disponibile)) {
    return { fattore: 1, aCapo: false };
  }
  if (contenuto <= disponibile) return { fattore: 1, aCapo: false };

  const richiesto = disponibile / contenuto;
  if (richiesto < minimo) return { fattore: minimo, aCapo: true };
  return { fattore: richiesto, aCapo: false };
}
