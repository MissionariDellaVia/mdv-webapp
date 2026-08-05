import test from 'node:test';
import assert from 'node:assert';
import { attraversaSoglia } from './soglia.mjs';

test('si entra nella sezione da fuori: il velo serve', () => {
  assert.strictEqual(attraversaSoglia('/', '/vocazione'), true);
  assert.strictEqual(attraversaSoglia('/contatti', '/vocazione/matrimonio'), true);
});

test('dentro la sezione il velo non si rialza', () => {
  assert.strictEqual(attraversaSoglia('/vocazione', '/vocazione/sacerdozio'), false);
  assert.strictEqual(attraversaSoglia('/vocazione/sacerdozio', '/vocazione'), false);
});

test('uscendo dalla sezione non c\'e\' nessuna soglia da attraversare', () => {
  assert.strictEqual(attraversaSoglia('/vocazione', '/contatti'), false);
});

test('al primo caricamento non c\'e\' niente da coprire', () => {
  assert.strictEqual(attraversaSoglia(undefined, '/vocazione'), false);
  assert.strictEqual(attraversaSoglia(null, '/vocazione'), false);
});

test('restare fermi non e\' un passaggio', () => {
  assert.strictEqual(attraversaSoglia('/vocazione', '/vocazione'), false);
  assert.strictEqual(attraversaSoglia('/', '/'), false);
});

test('una rotta che inizia allo stesso modo non e\' la sezione', () => {
  assert.strictEqual(attraversaSoglia('/', '/vocazioni-famose'), false);
});
