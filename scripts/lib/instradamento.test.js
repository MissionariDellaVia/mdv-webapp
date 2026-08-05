const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const {
  USA_CRONOLOGIA_HTML5, ROTTE_PUBBLICHE, rotteDaPubblicare,
} = require('../../src/router/instradamento');

test('col cancelletto si dichiara solo la radice', () => {
  const rotte = rotteDaPubblicare(false);
  assert.deepStrictEqual(rotte.map((r) => r.path), ['/']);
});

test('senza cancelletto si dichiarano tutte le pagine', () => {
  assert.strictEqual(rotteDaPubblicare(true).length, ROTTE_PUBBLICHE.length);
});

test('ogni rotta pubblica ha i dati che la sitemap richiede', () => {
  for (const rotta of ROTTE_PUBBLICHE) {
    assert.ok(rotta.path.startsWith('/'), `percorso malformato: ${rotta.path}`);
    assert.ok(rotta.lastmod, `manca lastmod per ${rotta.path}`);
    assert.ok(rotta.priority > 0 && rotta.priority <= 1, `priorita' fuori scala per ${rotta.path}`);
  }
});

test('nessuna rotta pubblica contiene un frammento', () => {
  // Nelle sitemap i frammenti non sono ammessi: e' il difetto che si stava
  // correggendo, e da qui non deve rientrare.
  for (const rotta of ROTTE_PUBBLICHE) {
    assert.ok(!rotta.path.includes('#'), `frammento in ${rotta.path}`);
  }
});

test('ogni pagina della sezione vocazionale e\' fra le rotte pubbliche', () => {
  const indice = JSON.parse(fs.readFileSync('src/assets/data/indice-vocazione.json', 'utf8'));
  const percorsi = ROTTE_PUBBLICHE.map((r) => r.path);
  assert.ok(percorsi.includes('/vocazione'));
  assert.strictEqual(
    indice.length,
    percorsi.filter((p) => p.startsWith('/vocazione/')).length,
    'una pagina della sezione non e\' dichiarata fra le rotte pubbliche',
  );
});

test('la sitemap prodotta rispecchia la modalita\' attiva', () => {
  if (!fs.existsSync('dist/sitemap.xml')) return; // niente build, niente da verificare
  const xml = fs.readFileSync('dist/sitemap.xml', 'utf8');
  const dichiarati = (xml.match(/<loc>/g) || []).length;
  assert.strictEqual(dichiarati, rotteDaPubblicare(USA_CRONOLOGIA_HTML5).length);
  assert.ok(!xml.includes('#'), 'la sitemap non deve contenere frammenti');
});
