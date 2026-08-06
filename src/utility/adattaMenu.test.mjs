import test from 'node:test';
import assert from 'node:assert';
import { adattamento, FATTORE_MINIMO } from './adattaMenu.mjs';

test('se ci sta non si tocca niente', () => {
  assert.deepStrictEqual(adattamento(400, 800), { fattore: 1, aCapo: false });
  assert.deepStrictEqual(adattamento(800, 800), { fattore: 1, aCapo: false });
});

test('se non ci sta si rimpicciolisce quel tanto che basta', () => {
  assert.deepStrictEqual(adattamento(1000, 900), { fattore: 0.9, aCapo: false });
});

// Il fattore deve essere esatto, non prudenziale: rimpicciolire piu' del
// necessario e' una perdita di leggibilita' gratuita.
test('il fattore riempie lo spazio, non ne lascia', () => {
  const { fattore } = adattamento(1000, 900);
  assert.strictEqual(1000 * fattore, 900);
});

test('sotto il minimo si cede sulla riga, non sulla leggibilita\'', () => {
  const stretto = adattamento(1000, 100);
  assert.strictEqual(stretto.fattore, FATTORE_MINIMO);
  assert.strictEqual(stretto.aCapo, true);
});

// Il confine: al minimo esatto ci sta ancora su una riga, appena sotto no.
test('il confine del minimo', () => {
  const alPelo = adattamento(1000, 1000 * FATTORE_MINIMO);
  assert.strictEqual(alPelo.aCapo, false);
  assert.strictEqual(alPelo.fattore, FATTORE_MINIMO);

  const appenaSotto = adattamento(1000, 1000 * FATTORE_MINIMO - 1);
  assert.strictEqual(appenaSotto.aCapo, true);
});

// Prima che il browser abbia disegnato, le misure sono 0 o NaN. Non e'
// un caso da gestire con un fattore strano: si lascia tutto com'e' e si
// rimisura al giro dopo.
test('misure non ancora disponibili non cambiano niente', () => {
  for (const [c, d] of [[0, 800], [800, 0], [NaN, 800], [800, undefined], [-5, 800]]) {
    assert.deepStrictEqual(adattamento(c, d), { fattore: 1, aCapo: false });
  }
});

test('il minimo si puo\' cambiare da fuori', () => {
  assert.deepStrictEqual(adattamento(1000, 500, 0.4), { fattore: 0.5, aCapo: false });
  assert.deepStrictEqual(adattamento(1000, 300, 0.4), { fattore: 0.4, aCapo: true });
});
