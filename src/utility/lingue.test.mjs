import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { LINGUE, CODICI, eSupportata, linguaDaUsare, LINGUA_PREDEFINITA } from './lingue.mjs';

const leggi = (nome) => JSON.parse(fs.readFileSync(`src/assets/data/${nome}`, 'utf8'));

test('ogni lingua offerta ha davvero i contenuti', () => {
  // E' il difetto che c'era: il portoghese stava nei contenuti e nel
  // footer ma non fra le lingue attivabili, quindi la bandiera cambiava
  // lingua e al ricaricamento si tornava in italiano.
  for (const file of ['navbar.json', 'data.json', 'footer.json']) {
    const contenuto = leggi(file);
    for (const codice of CODICI) {
      assert.ok(contenuto[codice], `manca "${codice}" in ${file}`);
    }
  }
});

test('non si offrono lingue senza contenuti, ne\' si nascondono contenuti che ci sono', () => {
  const nei_contenuti = Object.keys(leggi('data.json')).sort();
  assert.deepStrictEqual([...CODICI].sort(), nei_contenuti);
});

test('ogni lingua ha bandiera e nome scritto nella lingua stessa', () => {
  for (const lingua of LINGUE) {
    assert.ok(lingua.bandiera, `manca la bandiera per ${lingua.codice}`);
    assert.ok(lingua.nome, `manca il nome per ${lingua.codice}`);
    assert.ok(
      fs.existsSync(`src/assets/img/bandiere/${lingua.bandiera}.svg`),
      `manca il file della bandiera ${lingua.bandiera}.svg`,
    );
  }
});

test('le forme lunghe si accorciano', () => {
  assert.strictEqual(linguaDaUsare('it-IT'), 'it');
  assert.strictEqual(linguaDaUsare(null, 'pt-BR'), 'pt');
  assert.strictEqual(linguaDaUsare('EN'), 'en');
});

test('quel che non si riconosce diventa italiano', () => {
  assert.strictEqual(linguaDaUsare('de', 'ru'), LINGUA_PREDEFINITA);
  assert.strictEqual(linguaDaUsare(null, null), LINGUA_PREDEFINITA);
  assert.strictEqual(linguaDaUsare(undefined, ''), LINGUA_PREDEFINITA);
});

test('la lingua salvata ha la precedenza su quella del browser', () => {
  assert.strictEqual(linguaDaUsare('pl', 'fr'), 'pl');
});

test('eSupportata riconosce solo i codici dell\'elenco', () => {
  assert.strictEqual(eSupportata('pt'), true);
  assert.strictEqual(eSupportata('de'), false);
});
