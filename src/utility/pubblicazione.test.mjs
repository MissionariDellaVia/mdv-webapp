import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import {
  basePer, BASE_PRODUZIONE, BASE_COLLAUDO, NOME_REPOSITORY,
} from './pubblicazione.mjs';

test('la produzione sta alla radice del dominio', () => {
  assert.strictEqual(basePer('production'), '/');
});

test('il collaudo sta sotto il nome del repository', () => {
  assert.strictEqual(basePer('development'), `/${NOME_REPOSITORY}/`);
  assert.strictEqual(basePer('development'), '/mdv-webapp/');
});

// La distinzione vera e' una sola: quel che finisce su Aruba sta alla
// radice, tutto il resto sotto il nome del repository. Una modalita'
// nuova deve ricadere dalla parte prudente, non produrre un sito bianco.
test('qualunque modalita\' che non sia produzione e\' collaudo', () => {
  assert.strictEqual(basePer('staging'), BASE_COLLAUDO);
  assert.strictEqual(basePer(undefined), BASE_COLLAUDO);
  assert.strictEqual(basePer(''), BASE_COLLAUDO);
});

test('le due basi sono percorsi assoluti che finiscono con la barra', () => {
  for (const base of [BASE_PRODUZIONE, BASE_COLLAUDO]) {
    assert.ok(base.startsWith('/'), `${base} non comincia da /`);
    assert.ok(base.endsWith('/'), `${base} non finisce con /`);
  }
});

// Il difetto non stava nella funzione, stava in chi la chiamava: la base
// veniva decisa dal comando ("build" o "serve"), che e' lo stesso per il
// build di produzione e per quello di collaudo. Guardare la modalita' e'
// l'unica cosa che distingue i due.
test('vite.config.mjs decide la base dalla modalita\', non dal comando', () => {
  const config = fs.readFileSync('vite.config.mjs', 'utf8');
  assert.ok(
    config.includes('basePer('),
    'vite.config.mjs deve chiedere la base a pubblicazione.mjs',
  );
  assert.ok(
    !/base:\s*command\s*===/.test(config),
    'la base non puo\' dipendere dal comando: "vite build" li fa entrambi',
  );
});
