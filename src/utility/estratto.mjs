// Le testimonianze sono lunghe migliaia di caratteri: in una scheda ci
// va solo l'inizio. Il testo e' markdown, quindi va prima ripulito,
// altrimenti nell'anteprima compaiono asterischi e cancelletti.

const REGOLE = [
  [/```[\s\S]*?```/g, ' '],        // blocchi di codice
  [/!\[[^\]]*\]\([^)]*\)/g, ' '],  // immagini
  [/\[([^\]]*)\]\([^)]*\)/g, '$1'], // link: resta l'etichetta
  [/^\s{0,3}#{1,6}\s+/gm, ''],     // titoli
  [/^\s{0,3}>\s?/gm, ''],          // citazioni
  [/^\s{0,3}[-*+]\s+/gm, ''],      // elenchi
  [/[*_~`]/g, ''],                 // enfasi
  [/<[^>]+>/g, ' '],               // html
];

export function ripulisci(markdown) {
  if (typeof markdown !== 'string') return '';
  let testo = markdown;
  for (const [cerca, sostituisci] of REGOLE) testo = testo.replace(cerca, sostituisci);
  return testo.replace(/\s+/g, ' ').trim();
}

export function estratto(markdown, lunghezza = 150) {
  const testo = ripulisci(markdown);
  if (testo.length <= lunghezza) return testo;
  // Si taglia sull'ultimo spazio, per non spezzare una parola a meta'.
  const tagliato = testo.slice(0, lunghezza);
  const spazio = tagliato.lastIndexOf(' ');
  return `${(spazio > 0 ? tagliato.slice(0, spazio) : tagliato).replace(/[,;:.]$/, '')}…`;
}
