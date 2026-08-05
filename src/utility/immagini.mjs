// Le immagini si risolvevano con require() a runtime, che webpack sapeva
// leggere e trasformare in un percorso finale. Vite no: il grafo dei
// moduli lo costruisce prima, quindi un percorso composto a mano non
// esiste per lui. import.meta.glob e' il modo previsto — dichiara in
// anticipo l'intera cartella e restituisce una mappa da percorso a URL.
//
// La mappa e' costruita una volta sola, all'avvio.
const MAPPA = import.meta.glob('../assets/img/**/*.{jpg,jpeg,png,gif,svg,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

// Le chiavi arrivano come '../assets/img/vocazione/stella.jpg': quello che
// il codice chiede e' 'vocazione/stella.jpg'.
const PREFISSO = '../assets/img/';

const perNome = new Map(
  Object.entries(MAPPA).map(([percorso, url]) => [percorso.slice(PREFISSO.length), url]),
);

/**
 * URL finale di un'immagine della cartella assets, dal suo nome.
 * Restituisce stringa vuota se non c'e': un'immagine mancante non deve
 * far esplodere la pagina che la conteneva.
 */
export function urlImmagine(nome) {
  if (!nome) return '';
  return perNome.get(nome) || '';
}

// Serve solo ai test, per sapere cosa c'e' davvero in cartella.
export function nomiDisponibili() {
  return [...perNome.keys()];
}
