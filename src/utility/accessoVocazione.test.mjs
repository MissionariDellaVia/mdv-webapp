import test from 'node:test';
import assert from 'node:assert';
import { decidiAccesso } from './accessoVocazione.mjs';

test('in italiano ogni pagina della sezione e\' accessibile', () => {
  for (const r of ['vocazione', 'vocazione-sacerdozio', 'vocazione-domande']) {
    assert.deepStrictEqual(decidiAccesso('it', r), { consentito: true, redirezione: null });
  }
});

test('in altra lingua l\'hub resta accessibile', () => {
  assert.deepStrictEqual(decidiAccesso('en', 'vocazione'), { consentito: true, redirezione: null });
});

test('in altra lingua le sotto-pagine rimandano all\'hub', () => {
  assert.deepStrictEqual(
    decidiAccesso('en', 'vocazione-matrimonio'),
    { consentito: false, redirezione: 'vocazione' },
  );
});

test('lingua mancante o sconosciuta e\' trattata come non italiana', () => {
  assert.strictEqual(decidiAccesso(null, 'vocazione-discernimento').consentito, false);
  assert.strictEqual(decidiAccesso('', 'vocazione-sacerdozio').consentito, false);
});
