import test from 'node:test';
import assert from 'node:assert';
import { estratto, ripulisci } from './estratto.mjs';

test('la punteggiatura del markdown sparisce dall\'anteprima', () => {
  assert.strictEqual(ripulisci('## Titolo\n\n**Ciao** _mondo_'), 'Titolo Ciao mondo');
  assert.strictEqual(ripulisci('> una citazione'), 'una citazione');
  assert.strictEqual(ripulisci('- primo\n- secondo'), 'primo secondo');
});

test('dei link resta solo l\'etichetta', () => {
  assert.strictEqual(ripulisci('scrivi a [noi](https://esempio.it)'), 'scrivi a noi');
});

test('un testo corto non viene tagliato', () => {
  assert.strictEqual(estratto('Ciao a tutti', 150), 'Ciao a tutti');
});

test('un testo lungo si taglia su uno spazio, non a meta\' parola', () => {
  const risultato = estratto('alfa beta gamma delta epsilon', 12);
  assert.strictEqual(risultato, 'alfa beta…');
  assert.ok(!risultato.includes('gam'));
});

test('valori non testuali non fanno esplodere nulla', () => {
  assert.strictEqual(estratto(undefined), '');
  assert.strictEqual(estratto(null), '');
  assert.strictEqual(ripulisci(42), '');
});
