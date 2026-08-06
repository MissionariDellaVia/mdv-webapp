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

  // L'hub apre la sezione ma ha la stessa intestazione delle altre: se
  // fosse piu' alta, il menu si troverebbe a un'altezza diversa e il
  // passaggio si vedrebbe come uno scarto.
  if (nomeRotta === 'vocazione') return { ...contenuto.hub.header };
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
