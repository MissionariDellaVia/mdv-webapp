const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { validaContenuto, TIPI_BLOCCO } = require('./valida-vocazione');

const opzioni = {
  rotteNote: ['vocazione-matrimonio'],
  immagineEsiste: (n) => n === 'stella.jpg',
};

const valido = {
  hub: { header: { titolo: 'Vocazione' }, intro: 'x', porte: [], chiusura: 'y' },
  percorsi: {
    matrimonio: { header: { titolo: 'Matrimonio' }, blocchi: [{ tipo: 'prosa', testo: 'x' }] },
  },
  domande: [{ id: 1, domanda: 'a', risposta: 'b' }],
  proposta: { header: { titolo: 'Proposta' }, blocchi: [] },
};

const copia = (o) => JSON.parse(JSON.stringify(o));

test('un contenuto ben formato non produce errori', () => {
  assert.deepStrictEqual(validaContenuto(valido, opzioni), []);
});

test('i tipi di blocco riconosciuti sono sette', () => {
  assert.strictEqual(TIPI_BLOCCO.length, 7);
});

test('un tipo di blocco sconosciuto viene segnalato', () => {
  const c = copia(valido);
  c.percorsi.matrimonio.blocchi.push({ tipo: 'carosello' });
  assert.deepStrictEqual(
    validaContenuto(c, opzioni),
    ['percorsi.matrimonio.blocchi[1]: tipo sconosciuto "carosello"'],
  );
});

test('un rimando verso una rotta inesistente viene segnalato', () => {
  const c = copia(valido);
  c.percorsi.matrimonio.blocchi.push({
    tipo: 'rimandi', voci: [{ etichetta: 'x', rotta: 'inventata' }],
  });
  assert.deepStrictEqual(
    validaContenuto(c, opzioni),
    ['percorsi.matrimonio.blocchi[1].voci[0]: rotta inesistente "inventata"'],
  );
});

test('una porta dell\'hub verso una rotta inesistente viene segnalata', () => {
  const c = copia(valido);
  c.hub.porte.push({ titolo: 'x', testo: 'y', rotta: 'inventata' });
  assert.deepStrictEqual(
    validaContenuto(c, opzioni),
    ['hub.porte[0]: rotta inesistente "inventata"'],
  );
});

test('una foto mancante viene segnalata', () => {
  const c = copia(valido);
  c.percorsi.matrimonio.blocchi.push({
    tipo: 'testimonianze', voci: [{ nome: 'X', foto: 'assente.jpg', testo: 't' }],
  });
  assert.deepStrictEqual(
    validaContenuto(c, opzioni),
    ['percorsi.matrimonio.blocchi[1].voci[0]: immagine assente "assente.jpg"'],
  );
});

test('una sezione di primo livello mancante viene segnalata', () => {
  const c = copia(valido);
  delete c.domande;
  assert.deepStrictEqual(validaContenuto(c, opzioni), ['manca la sezione "domande"']);
});

// --- Contenuto reale ---------------------------------------------------

const FILE_CONTENUTO = 'src/assets/data/vocazione.json';
const CARTELLA_IMG = 'src/assets/img/vocazione';
const ROTTE_NOTE = [
  'vocazione', 'vocazione-discernimento', 'vocazione-matrimonio',
  'vocazione-sacerdozio', 'vocazione-vita-consacrata',
  'vocazione-domande', 'vocazione-proposta',
];

const leggiContenuto = () => JSON.parse(fs.readFileSync(FILE_CONTENUTO, 'utf8'));

test('vocazione.json e\' valido', () => {
  const errori = validaContenuto(leggiContenuto(), {
    rotteNote: ROTTE_NOTE,
    immagineEsiste: (n) => fs.existsSync(path.join(CARTELLA_IMG, n)),
  });
  assert.deepStrictEqual(errori, []);
});

test('i quattro percorsi del documento sono presenti', () => {
  assert.deepStrictEqual(
    Object.keys(leggiContenuto().percorsi).sort(),
    ['discernimento', 'matrimonio', 'sacerdozio', 'vita-consacrata'],
  );
});

test('le domande del documento sono otto', () => {
  assert.strictEqual(leggiContenuto().domande.length, 8);
});

test('l\'hub ha le quattro porte del documento', () => {
  assert.strictEqual(leggiContenuto().hub.porte.length, 4);
});

test('nessun indirizzo email nel contenuto: i contatti stanno in /contatti', () => {
  const grezzo = fs.readFileSync(FILE_CONTENUTO, 'utf8');
  const trovati = grezzo.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || [];
  assert.deepStrictEqual(trovati, []);
});
