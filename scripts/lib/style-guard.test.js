const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { estraiValoriVisivi } = require('./style-guard');
const deroghe = require('./style-guard-deroghe.json');

// Alzare questo numero e' vietato: la lista di deroga puo' solo accorciarsi.
const MASSIMO_DEROGHE = 13;

function fileVue(dir, acc = []) {
  for (const voce of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, voce.name);
    if (voce.isDirectory()) fileVue(p, acc);
    else if (voce.name.endsWith('.vue')) acc.push(p);
  }
  return acc;
}

test('estraiValoriVisivi trova colori e font nello style', () => {
  const sfc = `<template><div id="pills-home"/></template>
<style scoped>.a { color: #8c681c; font-family: 'Bubbler One'; }</style>`;
  assert.deepStrictEqual(estraiValoriVisivi(sfc), ['#8c681c', "font-family: 'Bubbler One'"]);
});

test('estraiValoriVisivi ignora il template', () => {
  const sfc = '<template><div id="abc" data-bs-target="#pills"/></template>'
    + '<style>.a{color:var(--mdv-oro);}</style>';
  assert.deepStrictEqual(estraiValoriVisivi(sfc), []);
});

test('estraiValoriVisivi trova anche rgb, rgba e hsl', () => {
  const sfc = '<template><div/></template>'
    + '<style>.a{background:rgb(40, 29, 2, 0.9);color:rgba(0,0,0,.2);border-color:hsl(30 40% 50%);}</style>';
  assert.deepStrictEqual(
    estraiValoriVisivi(sfc),
    ['rgb(40, 29, 2, 0.9)', 'rgba(0,0,0,.2)', 'hsl(30 40% 50%)'],
  );
});

test('nessun valore visivo scritto a mano fuori dalle deroghe', () => {
  const colpevoli = [];
  for (const f of fileVue('src')) {
    if (deroghe.includes(f)) continue;
    const trovati = estraiValoriVisivi(fs.readFileSync(f, 'utf8'));
    if (trovati.length) colpevoli.push(`${f}: ${trovati.join(', ')}`);
  }
  assert.deepStrictEqual(colpevoli, [], 'usare i token di src/assets/css/tokens.css');
});

test('la lista di deroga contiene solo file esistenti', () => {
  for (const f of deroghe) assert.ok(fs.existsSync(f), `deroga obsoleta: ${f}`);
});

test('la lista di deroga non si allunga', () => {
  assert.ok(
    deroghe.length <= MASSIMO_DEROGHE,
    `deroghe: ${deroghe.length}, massimo consentito: ${MASSIMO_DEROGHE}`,
  );
});
