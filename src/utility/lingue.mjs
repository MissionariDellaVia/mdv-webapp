// Le lingue del sito, in un posto solo.
//
// Erano in tre: un elenco in App.vue decideva quali fossero accettabili,
// il footer disegnava le bandiere da un elenco suo, e i file di contenuto
// ne avevano un terzo. Il portoghese stava nei contenuti e nel footer ma
// non fra le accettabili: premendo la bandiera la pagina cambiava lingua,
// e al ricaricamento tornava in italiano senza spiegazioni.

export const LINGUA_PREDEFINITA = 'it';

// bandiera: il codice del paese, che non sempre coincide con quello della
// lingua — l'inglese si mostra con la bandiera del Regno Unito.
export const LINGUE = [
  { codice: 'it', bandiera: 'it', nome: 'Italiano' },
  { codice: 'en', bandiera: 'gb', nome: 'English' },
  { codice: 'es', bandiera: 'es', nome: 'Español' },
  { codice: 'pt', bandiera: 'pt', nome: 'Português' },
  { codice: 'fr', bandiera: 'fr', nome: 'Français' },
  { codice: 'pl', bandiera: 'pl', nome: 'Polski' },
];

export const CODICI = LINGUE.map((l) => l.codice);

export function eSupportata(codice) {
  return CODICI.includes(codice);
}

/**
 * La lingua da usare, a partire da quella salvata e da quella del
 * browser. Normalizza le forme lunghe ("it-IT" -> "it") e ripiega
 * sull'italiano se non riconosce niente.
 */
export function linguaDaUsare(salvata, delBrowser) {
  for (const candidata of [salvata, delBrowser]) {
    if (typeof candidata !== 'string' || !candidata) continue;
    const breve = candidata.substring(0, 2).toLowerCase();
    if (eSupportata(breve)) return breve;
  }
  return LINGUA_PREDEFINITA;
}
