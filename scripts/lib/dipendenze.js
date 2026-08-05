// Una dipendenza che nessuno usa non fa rumore: resta nel package.json,
// finisce nel bundle e la scaricano tutti. animate.css e' rimasta cosi'
// per anni — importata in main.js, mai usata da una riga di markup.
//
// Qui si verifica solo la forma piu' grossolana del problema: dipendenze
// che non compaiono da nessuna parte. Quelle importate ma inutilizzate
// vanno guardate a mano, e questo commento serve a ricordarlo.

const fs = require('node:fs');
const path = require('node:path');

// Dipendenze che non compaiono in src perche' agiscono altrove: le si
// elenca per iscritto, cosi' aggiungerne una e' una decisione e non una
// svista.
const INDIRETTE = {};

function contenutiDi(dir, acc = []) {
  for (const voce of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, voce.name);
    if (voce.isDirectory()) contenutiDi(p, acc);
    else acc.push(fs.readFileSync(p, 'utf8'));
  }
  return acc;
}

/**
 * Elenca le dipendenze dichiarate che non compaiono ne' nel codice ne'
 * fra le indirette dichiarate qui sopra.
 */
function dipendenzeOrfane(dipendenze, sorgenti) {
  const testo = sorgenti.join('\n');
  return Object.keys(dipendenze)
    .filter((nome) => !INDIRETTE[nome])
    .filter((nome) => !testo.includes(nome));
}

module.exports = { dipendenzeOrfane, contenutiDi, INDIRETTE };
