// Le classi condivise — .mdv-navlink, .mdv-link, .mdv-invito, i titoli —
// vivono in tokens.css, dentro @layer base. Gli stili con ambito dei
// componenti stanno invece fuori da ogni layer, e il CSS senza layer batte
// qualunque layer: a parita' di specificita', e anche quando il layer
// viene dopo nel foglio.
//
// Quindi una sola dichiarazione in un componente — .barra__link { color }
// — puo' rendere inefficace tutto quello che i token dicono su quel
// pezzo, senza un errore da nessuna parte. E' successo con la barra:
// l'atmosfera vocazionale non riusciva a cambiare il colore delle voci, e
// la ragione non era visibile ne' nel componente ne' nei token, ma solo
// nel rapporto fra i due.
//
// Qui si controlla il caso piu' diretto: un componente che scrive una
// regola per una classe condivisa. Se serve davvero, la si sposta nei
// token — e' li' che quella classe abita.

// Solo il contenuto: il tag di apertura finirebbe dentro il primo
// selettore, che comincerebbe con "<style scoped>".
const RE_CONTENUTO_STILE = /<style[^>]*>([\s\S]*?)<\/style>/g;
const RE_COMMENTO = /\/\*[\s\S]*?\*\//g;

// Il prefisso delle classi che appartengono ai token.
const PREFISSO = 'mdv-';

// Selettori ammessi: un componente puo' aver bisogno di posizionare una
// classe condivisa dentro il proprio impianto — per esempio dargli
// "flex: 0 0 auto" dentro una fila. Lo fa combinandola con una classe
// sua, e in quel caso la regola riguarda quel punto, non la classe.
function selettoriDi(css) {
  const senzaCommenti = css.replace(RE_COMMENTO, '');
  return [...senzaCommenti.matchAll(/([^{}]+)\{/g)].map(([, s]) => s.trim());
}

function soloClasseCondivisa(selettore) {
  // Un selettore che nomina una classe condivisa e nient'altro di proprio
  // del componente: e' una ridefinizione, e verra' ignorata.
  const classi = [...selettore.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map(([, c]) => c);
  if (!classi.length) return false;
  return classi.every((c) => c.startsWith(PREFISSO));
}

/**
 * Elenca i selettori con cui un componente prova a ridefinire una classe
 * che appartiene ai token.
 */
function ridefinizioni(sorgente) {
  const stili = [...sorgente.matchAll(RE_CONTENUTO_STILE)].map(([, c]) => c).join('\n');
  return selettoriDi(stili)
    .filter((s) => s.includes(`.${PREFISSO}`))
    .filter(soloClasseCondivisa)
    .map((s) => s.replace(/\s+/g, ' '))
    .sort();
}

module.exports = { ridefinizioni, PREFISSO };
