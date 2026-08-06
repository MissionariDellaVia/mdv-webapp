import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { componiMenu } from './menuVocazione.mjs';

const indice = JSON.parse(fs.readFileSync('src/assets/data/indice-vocazione.json', 'utf8'));

test('il ritorno all\'hub e\' sempre la prima voce', () => {
  const menu = componiMenu(indice);
  assert.strictEqual(menu[0].nome, 'vocazione');
  assert.strictEqual(menu[0].breve, 'Vocazione');
});

test('il menu elenca l\'hub piu\' tutte le pagine dell\'indice', () => {
  const menu = componiMenu(indice);
  assert.strictEqual(menu.length, indice.length + 1);
  assert.deepStrictEqual(menu.slice(1).map((v) => v.nome), indice.map((v) => v.nome));
});

test('ogni voce porta solo cio\' che serve al menu', () => {
  for (const voce of componiMenu(indice)) {
    assert.deepStrictEqual(Object.keys(voce).sort(), ['breve', 'nome']);
  }
});

test('senza indice resta almeno il ritorno', () => {
  assert.deepStrictEqual(componiMenu(undefined).map((v) => v.nome), ['vocazione']);
  assert.deepStrictEqual(componiMenu(null).map((v) => v.nome), ['vocazione']);
});
