import test from 'node:test';
import assert from 'node:assert';
import { destinazionePer, ANCORA_CONTENUTO, STACCO } from './destinazioneScroll.mjs';

const AL_CONTENUTO = { el: ANCORA_CONTENUTO, top: STACCO };
const IN_CIMA = { top: 0 };

test('fra due pagine della sezione si arriva al contenuto', () => {
  assert.deepStrictEqual(
    destinazionePer('/vocazione/sacerdozio', '/vocazione/matrimonio'),
    AL_CONTENUTO,
  );
  assert.deepStrictEqual(destinazionePer('/vocazione', '/vocazione/domande'), AL_CONTENUTO);
});

test('verso l\'hub si torna in cima: e\' la copertina', () => {
  assert.deepStrictEqual(destinazionePer('/vocazione/sacerdozio', '/vocazione'), IN_CIMA);
  assert.deepStrictEqual(destinazionePer('/vocazione/sacerdozio', '/vocazione/'), IN_CIMA);
});

test('entrando o uscendo dalla sezione si torna in cima', () => {
  assert.deepStrictEqual(destinazionePer('/', '/vocazione/proposta'), IN_CIMA);
  assert.deepStrictEqual(destinazionePer('/vocazione/proposta', '/contatti'), IN_CIMA);
});

test('fuori dalla sezione vale la regola di sempre', () => {
  assert.deepStrictEqual(destinazionePer('/attivita', '/contatti'), IN_CIMA);
  assert.deepStrictEqual(destinazionePer(undefined, '/'), IN_CIMA);
});

test('una rotta che inizia allo stesso modo non e\' la sezione', () => {
  assert.deepStrictEqual(destinazionePer('/vocazionale', '/vocazioni-famose'), IN_CIMA);
});
