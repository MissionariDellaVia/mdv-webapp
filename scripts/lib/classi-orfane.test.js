const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { classiOrfane, classiUsate } = require('./classi-orfane');

test('legge le classi dagli attributi del markup', () => {
  assert.deepStrictEqual(
    classiUsate('<template><div class="uno due"><p class="tre"/></div></template>').sort(),
    ['due', 'tre', 'uno'],
  );
});

test('gli stili non contano come uso', () => {
  const sfc = '<template><div class="mia"/></template><style>.card { border: 0 }</style>';
  assert.deepStrictEqual(classiOrfane(sfc), []);
});

test('una classe rimasta di Bootstrap viene segnalata', () => {
  const sfc = '<template><h1 class="fs-3 text-uppercase">Titolo</h1></template>';
  assert.deepStrictEqual(classiOrfane(sfc), ['fs-3', 'text-uppercase']);
});

test('le colonne della griglia vengono riconosciute a schema', () => {
  const sfc = '<template><div class="col-md-6"/><div class="col-12"/></template>';
  assert.deepStrictEqual(classiOrfane(sfc), ['col-12', 'col-md-6']);
});

test('quel che il file si definisce da solo non e\' orfano', () => {
  const sfc = '<template><p class="lead"/></template><style>.lead { font-size: 2rem }</style>';
  assert.deepStrictEqual(classiOrfane(sfc), []);
});

test('le classi che esistono anche in Tailwind non si toccano', () => {
  const sfc = '<template><div class="text-center mx-auto mb-4 shadow"/></template>';
  assert.deepStrictEqual(classiOrfane(sfc), []);
});

// --- I file veri ------------------------------------------------------

function fileVue(dir, acc = []) {
  for (const voce of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, voce.name);
    if (voce.isDirectory()) fileVue(p, acc);
    else if (voce.name.endsWith('.vue')) acc.push(p);
  }
  return acc;
}

test('nessuna classe di Bootstrap rimasta senza chi la definisce', () => {
  const colpevoli = [];
  for (const f of fileVue('src')) {
    const orfane = classiOrfane(fs.readFileSync(f, 'utf8'));
    if (orfane.length) colpevoli.push(`${f}: ${orfane.join(', ')}`);
  }
  assert.deepStrictEqual(
    colpevoli, [],
    'Bootstrap non c\'e\' piu\': queste classi non le applica nessuno',
  );
});
