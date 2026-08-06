import test from 'node:test';
import assert from 'node:assert';
import { voceAttiva } from './voceAttiva.mjs';

test('la voce e\' accesa sulla sua pagina', () => {
  assert.strictEqual(voceAttiva('/vocazione', '/vocazione'), true);
  assert.strictEqual(voceAttiva('/contatti', '/contatti'), true);
});

test('resta accesa anche nelle sue sotto-pagine', () => {
  // E' il difetto che c'era: dentro /vocazione/sacerdozio la barra
  // smetteva di dire dove sei, proprio nelle pagine piu' interne.
  assert.strictEqual(voceAttiva('/vocazione/sacerdozio', '/vocazione'), true);
  assert.strictEqual(voceAttiva('/vocazione/domande', '/vocazione'), true);
});

test('la radice non e\' accesa ovunque', () => {
  // E' prefisso di qualunque percorso: senza eccezione risulterebbe
  // sempre la pagina in cui ti trovi.
  assert.strictEqual(voceAttiva('/contatti', '/'), false);
  assert.strictEqual(voceAttiva('/', '/'), true);
});

test('un percorso che comincia allo stesso modo non basta', () => {
  assert.strictEqual(voceAttiva('/vocazionale', '/vocazione'), false);
  assert.strictEqual(voceAttiva('/contattici', '/contatti'), false);
});

test('valori assenti non accendono niente', () => {
  assert.strictEqual(voceAttiva(undefined, '/vocazione'), false);
  assert.strictEqual(voceAttiva('/vocazione', ''), false);
  assert.strictEqual(voceAttiva(null, null), false);
});
