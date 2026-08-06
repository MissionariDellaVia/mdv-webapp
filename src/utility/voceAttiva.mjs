// Quale voce del menu e' quella in cui ti trovi.
//
// Il confronto era esatto, quindi dentro /vocazione/sacerdozio la voce
// "vocazione" si spegneva: la barra smetteva di dire dove sei proprio
// nelle pagine piu' interne, dove serviva di piu'.
//
// Una voce e' accesa anche sulle sue sotto-pagine. La radice fa eccezione:
// e' prefisso di qualunque percorso, e senza eccezione risulterebbe
// sempre accesa.

const RADICE = '/';

export function voceAttiva(percorsoCorrente, destinazione) {
  if (typeof percorsoCorrente !== 'string' || typeof destinazione !== 'string') return false;
  if (!destinazione) return false;
  if (percorsoCorrente === destinazione) return true;
  if (destinazione === RADICE) return false;
  return percorsoCorrente.startsWith(`${destinazione}/`);
}
