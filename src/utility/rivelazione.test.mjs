import test from 'node:test';
import assert from 'node:assert';
import { deveNascondersi, decidiRivelazione } from './rivelazione.mjs';

test('cio\' che e\' gia\' sullo schermo non si nasconde mai', () => {
  assert.strictEqual(deveNascondersi(0, 900), false);
  assert.strictEqual(deveNascondersi(400, 900), false);
  assert.strictEqual(deveNascondersi(899, 900), false);
});

test('si nasconde solo cio\' che comincia sotto il bordo', () => {
  assert.strictEqual(deveNascondersi(901, 900), true);
  assert.strictEqual(deveNascondersi(4000, 900), true);
});

test('un elemento gia\' scorso via resta visibile', () => {
  assert.strictEqual(deveNascondersi(-2000, 900), false);
});

test('misure assurde non nascondono niente', () => {
  assert.strictEqual(deveNascondersi(NaN, 900), false);
  assert.strictEqual(deveNascondersi(100, undefined), false);
});

test('senza osservatore o con movimento ridotto si rivela e basta', () => {
  const lontano = { cima: 5000, altezzaFinestra: 900 };
  assert.strictEqual(
    decidiRivelazione({ ...lontano, osservabile: false, movimentoRidotto: false }),
    'rivela',
  );
  assert.strictEqual(
    decidiRivelazione({ ...lontano, osservabile: true, movimentoRidotto: true }),
    'rivela',
  );
});

test('con l\'osservatore si nasconde solo quel che sta sotto', () => {
  const opzioni = { altezzaFinestra: 900, osservabile: true, movimentoRidotto: false };
  assert.strictEqual(decidiRivelazione({ ...opzioni, cima: 5000 }), 'nascondi');
  assert.strictEqual(decidiRivelazione({ ...opzioni, cima: 300 }), 'rivela');
});
