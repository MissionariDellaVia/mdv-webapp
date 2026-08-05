import test from 'node:test';
import assert from 'node:assert';
import { inVocazione } from './inVocazione.mjs';

test('l\'hub e le sue sotto-pagine sono dentro la sezione', () => {
  assert.strictEqual(inVocazione('/vocazione'), true);
  assert.strictEqual(inVocazione('/vocazione/'), true);
  assert.strictEqual(inVocazione('/vocazione/sacerdozio'), true);
  assert.strictEqual(inVocazione('/vocazione/domande'), true);
});

test('le altre pagine sono fuori', () => {
  assert.strictEqual(inVocazione('/'), false);
  assert.strictEqual(inVocazione('/attivita'), false);
  assert.strictEqual(inVocazione('/contatti'), false);
});

test('un percorso che inizia allo stesso modo non e\' dentro la sezione', () => {
  assert.strictEqual(inVocazione('/vocazionale'), false);
  assert.strictEqual(inVocazione('/vocazioni-famose'), false);
});

test('valori assenti non fanno esplodere nulla', () => {
  assert.strictEqual(inVocazione(undefined), false);
  assert.strictEqual(inVocazione(null), false);
  assert.strictEqual(inVocazione(''), false);
});
