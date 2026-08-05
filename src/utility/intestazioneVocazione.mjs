// L'intestazione della sezione vive nel layout, non nelle pagine: cosi'
// non si rimonta a ogni navigazione e il menu non riparte da capo.
// Qui si decide, dal nome della rotta, cosa ci va scritto dentro.

const PREFISSO = 'vocazione-';

// Le domande non hanno un'intestazione in vocazione.json: quel file
// contiene le domande, non una pagina. Il testo sta qui, in chiaro.
const DOMANDE = {
  titolo: 'Le vostre domande',
  sottotitolo: 'Domande vere, risposte dei missionari',
  immagine: 'vocazione/domande.jpg',
  occhiello: 'Vocazione',
};

export function intestazionePer(nomeRotta, contenuto) {
  if (!nomeRotta || !contenuto) return null;

  if (nomeRotta === 'vocazione') {
    // L'hub apre la sezione: e' l'unica intestazione a tutta altezza.
    return { ...contenuto.hub.header, alta: true };
  }
  if (nomeRotta === 'vocazione-domande') return { ...DOMANDE };
  if (nomeRotta === 'vocazione-proposta') {
    return { ...contenuto.proposta.header, occhiello: 'Vocazione' };
  }

  const chiave = nomeRotta.startsWith(PREFISSO)
    ? nomeRotta.slice(PREFISSO.length)
    : null;
  const percorso = chiave && contenuto.percorsi ? contenuto.percorsi[chiave] : null;
  if (!percorso) return null;

  return { ...percorso.header, occhiello: 'Percorso' };
}
