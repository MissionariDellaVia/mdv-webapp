const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const { dipendenzeOrfane, contenutiDi, INDIRETTE } = require('./dipendenze');

test('una dipendenza che nessuno nomina viene segnalata', () => {
  assert.deepStrictEqual(
    dipendenzeOrfane({ usata: '1', dimenticata: '1' }, ["import x from 'usata'"]),
    ['dimenticata'],
  );
});

test('le indirette dichiarate non vengono segnalate', () => {
  const nome = Object.keys(INDIRETTE)[0];
  assert.deepStrictEqual(dipendenzeOrfane({ [nome]: '1' }, ['']), []);
});

test('ogni indiretta porta scritto perche\' resta', () => {
  for (const [nome, motivo] of Object.entries(INDIRETTE)) {
    assert.ok(motivo && motivo.length > 10, `motivo troppo vago per ${nome}`);
  }
});

test('nessuna dipendenza orfana nel progetto', () => {
  const { dependencies } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const sorgenti = [
    ...contenutiDi('src'),
    fs.readFileSync('vue.config.js', 'utf8'),
    fs.readFileSync('babel.config.js', 'utf8'),
  ];
  assert.deepStrictEqual(
    dipendenzeOrfane(dependencies, sorgenti),
    [],
    'rimuoverla, oppure spiegare in INDIRETTE perche\' resta',
  );
});
