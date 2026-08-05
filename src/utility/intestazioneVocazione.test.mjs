import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { intestazionePer } from './intestazioneVocazione.mjs';

const contenuto = JSON.parse(fs.readFileSync('src/assets/data/vocazione.json', 'utf8'));
const indice = JSON.parse(fs.readFileSync('src/assets/data/indice-vocazione.json', 'utf8'));

test('l\'hub e\' l\'unica intestazione a tutta altezza', () => {
  const hub = intestazionePer('vocazione', contenuto);
  assert.strictEqual(hub.alta, true);
  assert.strictEqual(hub.titolo, contenuto.hub.header.titolo);
});

test('ogni pagina della sezione ha un titolo', () => {
  for (const voce of indice) {
    const testa = intestazionePer(voce.nome, contenuto);
    assert.ok(testa, `nessuna intestazione per ${voce.nome}`);
    assert.ok(testa.titolo, `titolo mancante per ${voce.nome}`);
    assert.ok(!testa.alta, `solo l'hub e' alto, non ${voce.nome}`);
  }
});

test('ogni intestazione punta a un\'immagine che esiste', () => {
  const rotte = ['vocazione', ...indice.map((v) => v.nome)];
  for (const rotta of rotte) {
    const { immagine } = intestazionePer(rotta, contenuto);
    assert.ok(immagine, `immagine mancante per ${rotta}`);
    assert.ok(
      fs.existsSync(`src/assets/img/${immagine}`),
      `immagine inesistente per ${rotta}: ${immagine}`,
    );
  }
});

test('i percorsi portano l\'occhiello "Percorso"', () => {
  assert.strictEqual(intestazionePer('vocazione-sacerdozio', contenuto).occhiello, 'Percorso');
});

test('una rotta fuori dalla sezione non produce intestazione', () => {
  assert.strictEqual(intestazionePer('contatti', contenuto), null);
  assert.strictEqual(intestazionePer('vocazione-inventata', contenuto), null);
  assert.strictEqual(intestazionePer(undefined, contenuto), null);
  assert.strictEqual(intestazionePer('vocazione', null), null);
});
