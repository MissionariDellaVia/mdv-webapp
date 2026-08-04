import test from 'node:test';
import assert from 'node:assert';
import { creaVocStorage } from './vocStorage.mjs';

function depositoFinto() {
  const dati = new Map();
  return {
    dati,
    getItem: (k) => (dati.has(k) ? dati.get(k) : null),
    setItem: (k, v) => dati.set(k, String(v)),
    removeItem: (k) => dati.delete(k),
    key: (i) => [...dati.keys()][i] ?? null,
    get length() { return dati.size; },
  };
}

const depositoRotto = {
  getItem() { throw new Error('negato'); },
  setItem() { throw new Error('quota'); },
  removeItem() { throw new Error('negato'); },
  key() { throw new Error('negato'); },
  get length() { throw new Error('negato'); },
};

test('scrivi e leggi ritornano il valore', () => {
  const s = creaVocStorage(depositoFinto());
  s.scrivi('sacerdozio', 'riflessioni', { 0: 'ciao' });
  assert.deepStrictEqual(s.leggi('sacerdozio', 'riflessioni', {}), { 0: 'ciao' });
});

test('leggi ritorna il predefinito se la chiave non esiste', () => {
  const s = creaVocStorage(depositoFinto());
  assert.deepStrictEqual(s.leggi('matrimonio', 'passi', []), []);
});

test('le chiavi sono isolate per percorso', () => {
  const s = creaVocStorage(depositoFinto());
  s.scrivi('sacerdozio', 'passi', [1]);
  assert.deepStrictEqual(s.leggi('matrimonio', 'passi', []), []);
});

test('cancella rimuove solo il percorso indicato', () => {
  const s = creaVocStorage(depositoFinto());
  s.scrivi('sacerdozio', 'passi', [1]);
  s.scrivi('matrimonio', 'passi', [2]);
  s.cancella('sacerdozio');
  assert.deepStrictEqual(s.leggi('sacerdozio', 'passi', []), []);
  assert.deepStrictEqual(s.leggi('matrimonio', 'passi', []), [2]);
});

test('un deposito che lancia non propaga eccezioni e degrada in memoria', () => {
  const s = creaVocStorage(depositoRotto);
  assert.doesNotThrow(() => s.scrivi('sacerdozio', 'riflessioni', { 0: 'x' }));
  assert.deepStrictEqual(s.leggi('sacerdozio', 'riflessioni', {}), { 0: 'x' });
  assert.doesNotThrow(() => s.cancella('sacerdozio'));
});

test('un valore corrotto non fa esplodere la lettura', () => {
  const d = depositoFinto();
  d.setItem('mdv.voc.sacerdozio.passi', '{non-json');
  const s = creaVocStorage(d);
  assert.deepStrictEqual(s.leggi('sacerdozio', 'passi', []), []);
});

test('senza deposito funziona comunque in memoria', () => {
  const s = creaVocStorage(null);
  s.scrivi('matrimonio', 'passi', [3]);
  assert.deepStrictEqual(s.leggi('matrimonio', 'passi', []), [3]);
});
