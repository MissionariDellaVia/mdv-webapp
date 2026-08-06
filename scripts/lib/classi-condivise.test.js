const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ridefinizioni } = require('./classi-condivise');

test('un componente che ridefinisce una classe condivisa viene segnalato', () => {
  const sfc = '<template><a class="mdv-navlink"/></template>'
    + '<style scoped>.mdv-navlink { color: red }</style>';
  assert.deepStrictEqual(ridefinizioni(sfc), ['.mdv-navlink']);
});

test('combinarla con una classe propria e\' ammesso', () => {
  // Serve a posizionarla dentro l'impianto del componente: la regola
  // riguarda quel punto, non la classe condivisa.
  const sfc = '<style scoped>.mdv-navlink.barra__link { flex: 0 0 auto }</style>';
  assert.deepStrictEqual(ridefinizioni(sfc), []);
});

test('nominarla in un commento non conta', () => {
  const sfc = '<style scoped>/* il gesto e\' quello di .mdv-navlink */\n.voce { color: red }</style>';
  assert.deepStrictEqual(ridefinizioni(sfc), []);
});

test('le classi che non appartengono ai token non riguardano questa guardia', () => {
  const sfc = '<style scoped>.barra__link { color: red }</style>';
  assert.deepStrictEqual(ridefinizioni(sfc), []);
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

test('nessun componente ridefinisce una classe dei token', () => {
  const colpevoli = [];
  for (const f of fileVue('src')) {
    const trovate = ridefinizioni(fs.readFileSync(f, 'utf8'));
    if (trovate.length) colpevoli.push(`${f}: ${trovate.join(', ')}`);
  }
  assert.deepStrictEqual(
    colpevoli, [],
    'gli stili con ambito stanno fuori dai layer e vincono sui token: '
    + 'spostare la regola in tokens.css',
  );
});
