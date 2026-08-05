# Sezione vocazionale — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portare la sezione vocazionale dentro `mdv-webapp` seguendo il documento redazionale, usandola come pilota di un sistema visivo centralizzato che il resto del sito adotterà in seguito.

**Architecture:** Fase 1 introduce `tokens.css` (custom properties CSS) e migra la chrome condivisa senza alcun cambiamento visibile, con un test che impedisce il ritorno dei valori scritti a mano. Fase 2 costruisce la sezione come rotte annidate sotto `/vocazione`: un renderer legge blocchi tipizzati da `vocazione.json` e li mappa su componenti di presentazione che ricevono solo props.

**Tech Stack:** Vue 3 (Options API), Vue Router 4 (hash history), Bootstrap 5, `vue3-markdown-it`, `node:test` per i test.

## Global Constraints

- **Solo italiano.** La sezione non ha traduzioni. Nelle altre lingue `/vocazione` serve la pagina breve attuale e `/vocazione/*` reindirizza a `/vocazione`.
- **Nessun valore visivo scritto a mano** in un componente: colori, font e spaziature vengono solo da `tokens.css`. Verificato dal test della Task 1.
- **I componenti di presentazione non accedono a store né `$route`.** Solo props ed eventi.
- **Ogni accesso a `localStorage` passa da `vocStorage`.** Nessuna chiamata diretta nei componenti.
- **Nessun indirizzo email né form nella sezione.** Dove il documento chiude con un recapito, si rimanda a `/contatti`.
- **Nessun Vuex per questa sezione.** Le view importano `vocazione.json` direttamente.
- **Niente framework di test per componenti.** Il rendering si verifica a mano; si testano solo logica pura e integrità del contenuto.
- **Le immagini non si linkano da domini esterni.** Vanno scaricate in `src/assets/img/vocazione/`.
- **Commenti, log, nomi di file di contenuto e testi UI in italiano**, coerentemente col resto del progetto.
- **Formato commit:** `tipo(scope): descrizione`, es. `feat(vocazione): …`, `refactor(stile): …`.

## Sorgente del contenuto

Il testo proviene da `~/Downloads/Nuovo sito vocazionale.docx`. Per ottenerne la versione markdown:

```bash
pip3 install -q 'markitdown[docx]'
python3 -m markitdown "$HOME/Downloads/Nuovo sito vocazionale.docx" > /tmp/vocazionale.md
```

Le testimonianze provengono dal repo `mdv-vocational`, che si assume clonato accanto a questo:
`../mdv-vocational/src/data/testimonianze1.md` (Sr Stella) e `testimonianze4.md` (Mattia & Viviana).
Le 8 domande sono in `../mdv-vocational/src/data/faq.json` e coincidono con quelle del documento.

## File Structure

**Fase 1**

| File | Responsabilità |
|---|---|
| `src/assets/css/tokens.css` | crea — unica fonte dei valori visivi |
| `src/main.js` | modifica — importa `tokens.css` |
| `scripts/lib/style-guard.js` | crea — estrattore puro dei valori visivi |
| `scripts/lib/style-guard.test.js` | crea — fallisce se compaiono valori fuori dai token |
| `scripts/lib/style-guard-deroghe.json` | crea — file non ancora migrati; può solo accorciarsi |
| `package.json` | modifica — script `test` |
| `src/components/layout/MdvNavbar.vue` | modifica — ai token |
| `src/components/layout/MdvFooter.vue` | modifica — ai token |
| `src/components/ui/*.vue` | modifica — ai token |

**Fase 2**

| File | Responsabilità |
|---|---|
| `src/utility/vocStorage.mjs` | crea — unico accesso a `localStorage` per la sezione |
| `src/utility/vocStorage.test.mjs` | crea — test del degrado e della serializzazione |
| `src/utility/accessoVocazione.mjs` | crea — logica pura del presidio lingua |
| `src/utility/accessoVocazione.test.mjs` | crea — test del presidio |
| `scripts/lib/valida-vocazione.js` | crea — validatore puro della struttura del contenuto |
| `scripts/lib/valida-vocazione.test.js` | crea — test del validatore + del contenuto reale |
| `src/assets/data/vocazione.json` | crea — tutto il contenuto della sezione |
| `src/assets/img/vocazione/*.jpg` | crea — foto delle testimonianze |
| `src/components/vocazione/VocProsa.vue` | crea — titolo + testo markdown |
| `src/components/vocazione/VocElenco.vue` | crea — elenchi, varianti `puntato` e `segni` |
| `src/components/vocazione/VocPassi.vue` | crea — passi numerati con avanzamento |
| `src/components/vocazione/VocRiflessioni.vue` | crea — domande con risposta conservata |
| `src/components/vocazione/VocTestimonianze.vue` | crea — testimonianza con foto |
| `src/components/vocazione/VocRimandi.vue` | crea — link ad altri percorsi |
| `src/components/vocazione/VocPorte.vue` | crea — le 4 porte dell'hub |
| `src/components/vocazione/VocFaq.vue` | crea — fisarmonica delle 8 domande |
| `src/view/vocazione/VocazioneLayout.vue` | crea — chrome di sezione + presidio lingua |
| `src/view/vocazione/VocazioneHub.vue` | crea — soglia d'ingresso |
| `src/view/vocazione/VocazionePercorso.vue` | crea — renderer dei blocchi |
| `src/view/vocazione/VocazioneDomande.vue` | crea — le 8 Q&A |
| `src/view/vocazione/VocazioneProposta.vue` | crea — cosa offre la comunità |
| `src/router/index.js` | modifica — rotte annidate |

---

## FASE 1 — Fondamenta

### Task 1: Guardia dei valori visivi

Il test nasce **prima** dei token, con tutti i file esistenti in deroga: parte verde e diventa il contatore del lavoro residuo.

**Files:**
- Create: `scripts/lib/style-guard.js`
- Create: `scripts/lib/style-guard.test.js`
- Create: `scripts/lib/style-guard-deroghe.json`
- Modify: `package.json`

**Interfaces:**
- Produces: `estraiValoriVisivi(contenuto: string) => string[]` — i valori visivi scritti a mano trovati nei blocchi `<style>` e `<script>` di un SFC.

- [ ] **Step 1: Scrivere il test**

```js
// scripts/lib/style-guard.test.js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { estraiValoriVisivi } = require('./style-guard');
const deroghe = require('./style-guard-deroghe.json');

// Alzare questo numero e' vietato: la lista di deroga puo' solo accorciarsi.
const MASSIMO_DEROGHE = 29;

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
  assert.deepStrictEqual(estraiValoriVisivi(sfc), ["#8c681c", "font-family: 'Bubbler One'"]);
});

test('estraiValoriVisivi ignora il template', () => {
  const sfc = `<template><div id="abc" data-bs-target="#pills"/></template><style>.a{color:var(--mdv-oro);}</style>`;
  assert.deepStrictEqual(estraiValoriVisivi(sfc), []);
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
  assert.ok(deroghe.length <= MASSIMO_DEROGHE,
    `deroghe: ${deroghe.length}, massimo consentito: ${MASSIMO_DEROGHE}`);
});
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

Run: `node --test scripts/lib/style-guard.test.js`
Expected: FAIL — `Cannot find module './style-guard'`

- [ ] **Step 3: Implementare l'estrattore**

```js
// scripts/lib/style-guard.js
// Estrae i valori visivi scritti a mano in un Single File Component.
// Guarda solo <style> e <script>: nel <template> "#pills-home" e simili
// sono selettori, non colori.
const RE_BLOCCHI = /<(style|script)\b[\s\S]*?<\/\1>/g;
const RE_COLORE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g;
const RE_FONT = /font-family:\s*'[^']+'/g;

function estraiValoriVisivi(contenuto) {
  const blocchi = (contenuto.match(RE_BLOCCHI) || []).join('\n');
  return [...(blocchi.match(RE_COLORE) || []), ...(blocchi.match(RE_FONT) || [])];
}

module.exports = { estraiValoriVisivi };
```

- [ ] **Step 4: Generare la lista di deroga iniziale**

```bash
node -e "
const fs=require('fs'),path=require('path');
const {estraiValoriVisivi}=require('./scripts/lib/style-guard');
const walk=(d,a=[])=>{for(const v of fs.readdirSync(d,{withFileTypes:true})){
  const p=path.join(d,v.name); v.isDirectory()?walk(p,a):v.name.endsWith('.vue')&&a.push(p);} return a;};
const sporchi=walk('src').filter(f=>estraiValoriVisivi(fs.readFileSync(f,'utf8')).length);
fs.writeFileSync('scripts/lib/style-guard-deroghe.json', JSON.stringify(sporchi.sort(),null,2)+'\n');
console.log('file in deroga:', sporchi.length);
"
```

Allineare `MASSIMO_DEROGHE` nel test al numero stampato.

- [ ] **Step 5: Aggiungere lo script di test**

In `package.json`, dentro `"scripts"`:

```json
"test": "node --test 'scripts/**/*.test.js' 'src/**/*.test.mjs'"
```

- [ ] **Step 6: Eseguire i test**

Run: `npm test`
Expected: PASS — inclusi i 3 test preesistenti di `transform-locations`.

- [ ] **Step 7: Commit**

```bash
git add scripts/lib/style-guard.js scripts/lib/style-guard.test.js scripts/lib/style-guard-deroghe.json package.json
git commit -m "test(stile): guardia contro i valori visivi scritti a mano"
```

---

### Task 2: I token

**Files:**
- Create: `src/assets/css/tokens.css`
- Modify: `src/main.js`

**Interfaces:**
- Produces: le custom properties elencate sotto, disponibili globalmente su `:root`.

- [ ] **Step 1: Creare il foglio dei token**

```css
/* src/assets/css/tokens.css
   Unica fonte dei valori visivi del sito. Nessun componente deve
   contenere colori, font o spaziature scritti a mano. */
:root {
  /* Bruni */
  --mdv-bruno-900: #281d02;
  --mdv-bruno-900-velato: #281d02e5;
  --mdv-bruno-850: #29140b;
  --mdv-bruno-800: #3f2a02;
  --mdv-bruno-700: #655640;
  --mdv-terra: #6e4f3a;

  /* Oro */
  --mdv-oro: #8c681c;
  --mdv-oro-scuro: #59411a;
  --mdv-oro-chiaro: #b6974e;
  --mdv-oro-brillante: #deb865;

  /* Sabbie */
  --mdv-sabbia: #c3ac7d;
  --mdv-sabbia-chiara: #dcbca8;
  --mdv-crema: #e1d9cb;
  --mdv-pietra: #c5c1b9;
  --mdv-pietra-rosata: #c3b5b9;

  /* Neutri */
  --mdv-bianco: #ffffff;
  --mdv-grigio: #7e7e7e;
  --mdv-grigio-scuro: #595959;

  /* Stati */
  --mdv-successo: #417a5a;
  --mdv-errore: #773737;

  /* Marchi di terzi */
  --mdv-social-facebook: #3b5998;
  --mdv-social-telegram: #44bcdd;
  --mdv-social-instagram: #b83dbd;
  --mdv-social-youtube: #ff0000;

  /* Tipografia */
  --mdv-font-titolo: 'Bubbler One', sans-serif;
  --mdv-font-corpo: 'Playfair Display', serif;
  --mdv-font-navigazione: 'Questrial', sans-serif;
  --mdv-font-alternativo: 'Old Standard TT', serif;

  /* Spaziature */
  --mdv-spazio-1: 0.25rem;
  --mdv-spazio-2: 0.5rem;
  --mdv-spazio-3: 1rem;
  --mdv-spazio-4: 1.5rem;
  --mdv-spazio-5: 2rem;
  --mdv-spazio-6: 3rem;

  /* Raggi */
  --mdv-raggio-s: 0.5rem;
  --mdv-raggio-m: 1rem;
  --mdv-raggio-l: 1.563rem;
}
```

- [ ] **Step 2: Importarlo**

In `src/main.js`, subito dopo l'import di Bootstrap (`import 'bootstrap';`), così che i token vincano sui default ma restino sovrascrivibili dagli stili dei componenti:

```js
// Token visivi: unica fonte di colori, font e spaziature
import './assets/css/tokens.css';
```

- [ ] **Step 3: Verificare che nulla sia cambiato**

Run: `npm run serve`
Aprire `http://localhost:9191/mdv-webapp/` e controllare home, `/vocazione`, `/attivita`, `/contatti`.
Expected: nessuna differenza visiva. I token sono dichiarati ma ancora nessuno li usa.

- [ ] **Step 4: Eseguire i test**

Run: `npm test`
Expected: PASS — la lista di deroga non è cambiata.

- [ ] **Step 5: Commit**

```bash
git add src/assets/css/tokens.css src/main.js
git commit -m "feat(stile): introduce i token visivi centrali"
```

---

### Task 3: Migrare MdvNavbar

**Files:**
- Modify: `src/components/layout/MdvNavbar.vue`
- Modify: `scripts/lib/style-guard-deroghe.json`
- Modify: `scripts/lib/style-guard.test.js`

- [ ] **Step 1: Togliere il file dalla lista di deroga**

Rimuovere la riga `"src/components/layout/MdvNavbar.vue"` da `scripts/lib/style-guard-deroghe.json` e abbassare `MASSIMO_DEROGHE` di 1 nel test.

- [ ] **Step 2: Eseguire i test e verificare che falliscano**

Run: `npm test`
Expected: FAIL — il test elenca i valori ancora scritti a mano in `MdvNavbar.vue`.

- [ ] **Step 3: Sostituire i valori con i token**

Nel blocco `<style>`, applicare queste sostituzioni, senza toccare nient'altro:

| Da | A |
|---|---|
| `#c3ac7d` | `var(--mdv-sabbia)` |
| `#dcbca8` | `var(--mdv-sabbia-chiara)` |
| `#c5c1b9` | `var(--mdv-pietra)` |
| `#ffffff` | `var(--mdv-bianco)` |
| `font-family: 'Questrial', …` | `font-family: var(--mdv-font-navigazione)` |

- [ ] **Step 4: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Verificare visivamente**

Run: `npm run serve`
Confrontare la barra di navigazione con `git stash` / `git stash pop` se serve.
Expected: identica — colori del menu, hover, versione mobile aperta.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/MdvNavbar.vue scripts/lib/style-guard-deroghe.json scripts/lib/style-guard.test.js
git commit -m "refactor(stile): MdvNavbar usa i token"
```

---

### Task 4: Migrare MdvFooter

**Files:**
- Modify: `src/components/layout/MdvFooter.vue`
- Modify: `scripts/lib/style-guard-deroghe.json`
- Modify: `scripts/lib/style-guard.test.js`

- [ ] **Step 1: Togliere il file dalla lista di deroga e abbassare `MASSIMO_DEROGHE` di 1**

- [ ] **Step 2: Eseguire i test e verificare che falliscano**

Run: `npm test`
Expected: FAIL con l'elenco dei valori di `MdvFooter.vue`.

- [ ] **Step 3: Sostituire i valori con i token**

| Da | A |
|---|---|
| `#281D02E5` | `var(--mdv-bruno-900-velato)` |
| `#c3ac7d` | `var(--mdv-sabbia)` |
| `#595959` | `var(--mdv-grigio-scuro)` |
| `#fff`, `#FFFFFF` | `var(--mdv-bianco)` |
| `#3B5998` | `var(--mdv-social-facebook)` |
| `#44BCDD` | `var(--mdv-social-telegram)` |
| `#b83dbd` | `var(--mdv-social-instagram)` |
| `#ff0000` | `var(--mdv-social-youtube)` |

- [ ] **Step 4: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Verificare visivamente il footer, in particolare i colori delle icone social al passaggio del mouse**

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/MdvFooter.vue scripts/lib/style-guard-deroghe.json scripts/lib/style-guard.test.js
git commit -m "refactor(stile): MdvFooter usa i token"
```

---

### Task 5: Migrare i componenti ui/

Sette file piccoli, stessa natura: si trattano insieme perché una revisione parziale non avrebbe senso.

**Files:**
- Modify: `src/components/ui/BackButton.vue`, `BaseButton.vue`, `BaseCard.vue`, `BaseDashboard.vue`, `BaseMap.vue`, `BaseSpinner.vue`, `BaseToast.vue`
- Modify: `scripts/lib/style-guard-deroghe.json`
- Modify: `scripts/lib/style-guard.test.js`

- [ ] **Step 1: Togliere i sette file dalla lista di deroga e abbassare `MASSIMO_DEROGHE` di 7**

- [ ] **Step 2: Eseguire i test e verificare che falliscano**

Run: `npm test`
Expected: FAIL con i valori dei sette file.

- [ ] **Step 3: Sostituire i valori con i token**

| File | Da | A |
|---|---|---|
| BackButton | `#6e4f3a` | `var(--mdv-terra)` |
| BackButton | `#c3b5b9` | `var(--mdv-pietra-rosata)` |
| BackButton, BaseButton | `#7E7E7E` | `var(--mdv-grigio)` |
| BackButton, BaseButton | `#fff` | `var(--mdv-bianco)` |
| BaseButton | `#655640` | `var(--mdv-bruno-700)` |
| BaseButton | `#b6974e` | `var(--mdv-oro-chiaro)` |
| BaseButton | `#deb865` | `var(--mdv-oro-brillante)` |
| BaseCard | `#3f2a02` | `var(--mdv-bruno-800)` |
| BaseCard | `#ffffff` | `var(--mdv-bianco)` |
| BaseCard | `border-radius: 1.563rem` | `var(--mdv-raggio-l)` |
| BaseDashboard | `#29140b` | `var(--mdv-bruno-850)` |
| BaseDashboard | `#64553f` | `var(--mdv-bruno-700)` |
| BaseDashboard | `#e1d9cb` | `var(--mdv-crema)` |
| BaseMap, BaseSpinner | `#8c681c` | `var(--mdv-oro)` |
| BaseToast | `#417a5a` | `var(--mdv-successo)` |
| BaseToast | `#773737` | `var(--mdv-errore)` |
| BaseButton, BaseCard, BaseDashboard | `font-family: 'Bubbler One', …` | `var(--mdv-font-titolo)` |
| BaseToast | `font-family: 'Playfair Display', …` | `var(--mdv-font-corpo)` |

**Unica deviazione consapevole dal "resta identico":** `BaseDashboard` usa `#64553f` e `BaseButton` usa `#655640`. Differiscono di 1 su ogni canale, impercettibile. Vengono unificati su `--mdv-bruno-700: #655640`. Annotarlo nel messaggio di commit.

- [ ] **Step 4: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Verificare visivamente**

`npm run serve`, poi: home (pulsanti), `/attivita` (spinner e mappa), `/contatti` (mappa e toast inviando il form con un campo vuoto).

- [ ] **Step 6: Commit**

```bash
git add src/components/ui scripts/lib/style-guard-deroghe.json scripts/lib/style-guard.test.js
git commit -m "refactor(stile): i componenti ui usano i token

Unifica #64553f e #655640 su --mdv-bruno-700: differiscono di 1 su
ogni canale, impercettibile."
```

---

## FASE 2 — Sezione vocazionale

### Task 6: vocStorage

**Files:**
- Create: `src/utility/vocStorage.mjs`
- Create: `src/utility/vocStorage.test.mjs`

Estensione `.mjs` perché il codice in `src/` è ESM mentre `package.json` non dichiara `"type": "module"`: senza `.mjs`, `node --test` non riuscirebbe a importarlo.

**Interfaces:**
- Produces:
  - `creaVocStorage(deposito) => { leggi, scrivi, cancella }`
  - `leggi(percorso: string, ambito: string, predefinito: any) => any`
  - `scrivi(percorso: string, ambito: string, valore: any) => void`
  - `cancella(percorso: string) => void`
  - `vocStorage` — istanza predefinita su `window.localStorage`

- [ ] **Step 1: Scrivere il test**

```js
// src/utility/vocStorage.test.mjs
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
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

Run: `node --test src/utility/vocStorage.test.mjs`
Expected: FAIL — modulo inesistente.

- [ ] **Step 3: Implementare**

```js
// src/utility/vocStorage.mjs
// Unico punto d'accesso a localStorage per la sezione vocazionale.
// Se il deposito non e' utilizzabile (navigazione privata, quota, permessi)
// degrada in memoria volatile: l'interazione continua per la sessione.
const PREFISSO = 'mdv.voc';

const chiave = (percorso, ambito) => `${PREFISSO}.${percorso}.${ambito}`;

export function creaVocStorage(deposito) {
  const memoria = new Map();

  const leggi = (percorso, ambito, predefinito) => {
    const k = chiave(percorso, ambito);
    try {
      const grezzo = deposito ? deposito.getItem(k) : null;
      if (grezzo !== null && grezzo !== undefined) return JSON.parse(grezzo);
    } catch (e) {
      void e; // deposito non disponibile o valore corrotto: si passa alla memoria
    }
    return memoria.has(k) ? memoria.get(k) : predefinito;
  };

  const scrivi = (percorso, ambito, valore) => {
    const k = chiave(percorso, ambito);
    memoria.set(k, valore);
    try {
      if (deposito) deposito.setItem(k, JSON.stringify(valore));
    } catch (e) {
      void e; // scrittura impossibile: resta il valore in memoria
    }
  };

  const cancella = (percorso) => {
    const prefisso = `${PREFISSO}.${percorso}.`;
    for (const k of [...memoria.keys()]) if (k.startsWith(prefisso)) memoria.delete(k);
    try {
      if (!deposito) return;
      const daTogliere = [];
      for (let i = 0; i < deposito.length; i += 1) {
        const k = deposito.key(i);
        if (k && k.startsWith(prefisso)) daTogliere.push(k);
      }
      daTogliere.forEach((k) => deposito.removeItem(k));
    } catch (e) {
      void e;
    }
  };

  return { leggi, scrivi, cancella };
}

const depositoBrowser = (() => {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch (e) {
    void e;
    return null;
  }
})();

export const vocStorage = creaVocStorage(depositoBrowser);
```

- [ ] **Step 4: Eseguire i test**

Run: `npm test`
Expected: PASS — 7 test nuovi.

- [ ] **Step 5: Commit**

```bash
git add src/utility/vocStorage.mjs src/utility/vocStorage.test.mjs
git commit -m "feat(vocazione): vocStorage con degrado in memoria volatile"
```

---

### Task 7: Presidio della lingua

Logica pura, separata dal router perché è l'unica parte del presidio che vale la pena testare.

**Files:**
- Create: `src/utility/accessoVocazione.mjs`
- Create: `src/utility/accessoVocazione.test.mjs`

**Interfaces:**
- Produces: `decidiAccesso(lingua: string, nomeRotta: string) => { consentito: boolean, redirezione: string | null }`

- [ ] **Step 1: Scrivere il test**

```js
// src/utility/accessoVocazione.test.mjs
import test from 'node:test';
import assert from 'node:assert';
import { decidiAccesso } from './accessoVocazione.mjs';

test('in italiano ogni pagina della sezione e\' accessibile', () => {
  for (const r of ['vocazione', 'vocazione-sacerdozio', 'vocazione-domande']) {
    assert.deepStrictEqual(decidiAccesso('it', r), { consentito: true, redirezione: null });
  }
});

test('in altra lingua l\'hub resta accessibile', () => {
  assert.deepStrictEqual(decidiAccesso('en', 'vocazione'), { consentito: true, redirezione: null });
});

test('in altra lingua le sotto-pagine rimandano all\'hub', () => {
  assert.deepStrictEqual(decidiAccesso('en', 'vocazione-matrimonio'),
    { consentito: false, redirezione: 'vocazione' });
});

test('lingua mancante o sconosciuta e\' trattata come non italiana', () => {
  assert.strictEqual(decidiAccesso(null, 'vocazione-passi').consentito, false);
  assert.strictEqual(decidiAccesso('', 'vocazione-sacerdozio').consentito, false);
});
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

Run: `node --test src/utility/accessoVocazione.test.mjs`
Expected: FAIL — modulo inesistente.

- [ ] **Step 3: Implementare**

```js
// src/utility/accessoVocazione.mjs
// La sezione vocazionale esiste solo in italiano. L'hub resta raggiungibile
// in ogni lingua perche' serve la pagina breve preesistente.
const HUB = 'vocazione';

export function decidiAccesso(lingua, nomeRotta) {
  if (lingua === 'it' || nomeRotta === HUB) {
    return { consentito: true, redirezione: null };
  }
  return { consentito: false, redirezione: HUB };
}
```

- [ ] **Step 4: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utility/accessoVocazione.mjs src/utility/accessoVocazione.test.mjs
git commit -m "feat(vocazione): presidio della lingua come logica pura"
```

---

### Task 8: Validatore del contenuto

**Files:**
- Create: `scripts/lib/valida-vocazione.js`
- Create: `scripts/lib/valida-vocazione.test.js`

**Interfaces:**
- Produces:
  - `TIPI_BLOCCO: string[]` — `['prosa','elenco','segni','passi','riflessioni','testimonianze','rimandi']`
  - `validaContenuto(contenuto, { rotteNote: string[], immagineEsiste: (nome: string) => boolean }) => string[]` — elenco degli errori, vuoto se valido.

- [ ] **Step 1: Scrivere il test**

```js
// scripts/lib/valida-vocazione.test.js
const test = require('node:test');
const assert = require('node:assert');
const { validaContenuto, TIPI_BLOCCO } = require('./valida-vocazione');

const opzioni = { rotteNote: ['vocazione-matrimonio'], immagineEsiste: (n) => n === 'stella.jpg' };

const valido = {
  hub: { header: { titolo: 'Vocazione' }, intro: 'x', porte: [], chiusura: 'y' },
  percorsi: {
    matrimonio: { header: { titolo: 'Matrimonio' }, blocchi: [{ tipo: 'prosa', testo: 'x' }] },
  },
  domande: [{ id: 1, domanda: 'a', risposta: 'b' }],
  proposta: { header: { titolo: 'Proposta' }, blocchi: [] },
};

test('un contenuto ben formato non produce errori', () => {
  assert.deepStrictEqual(validaContenuto(valido, opzioni), []);
});

test('i tipi di blocco riconosciuti sono sette', () => {
  assert.strictEqual(TIPI_BLOCCO.length, 7);
});

test('un tipo di blocco sconosciuto viene segnalato', () => {
  const c = JSON.parse(JSON.stringify(valido));
  c.percorsi.matrimonio.blocchi.push({ tipo: 'carosello' });
  assert.deepStrictEqual(validaContenuto(c, opzioni),
    ['percorsi.matrimonio.blocchi[1]: tipo sconosciuto "carosello"']);
});

test('un rimando verso una rotta inesistente viene segnalato', () => {
  const c = JSON.parse(JSON.stringify(valido));
  c.percorsi.matrimonio.blocchi.push({ tipo: 'rimandi', voci: [{ etichetta: 'x', rotta: 'inventata' }] });
  assert.deepStrictEqual(validaContenuto(c, opzioni),
    ['percorsi.matrimonio.blocchi[1].voci[0]: rotta inesistente "inventata"']);
});

test('una foto mancante viene segnalata', () => {
  const c = JSON.parse(JSON.stringify(valido));
  c.percorsi.matrimonio.blocchi.push({
    tipo: 'testimonianze', voci: [{ nome: 'X', foto: 'assente.jpg', testo: 't' }],
  });
  assert.deepStrictEqual(validaContenuto(c, opzioni),
    ['percorsi.matrimonio.blocchi[1].voci[0]: immagine assente "assente.jpg"']);
});

test('una sezione di primo livello mancante viene segnalata', () => {
  const c = JSON.parse(JSON.stringify(valido));
  delete c.domande;
  assert.deepStrictEqual(validaContenuto(c, opzioni), ['manca la sezione "domande"']);
});
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

Run: `node --test scripts/lib/valida-vocazione.test.js`
Expected: FAIL — modulo inesistente.

- [ ] **Step 3: Implementare**

```js
// scripts/lib/valida-vocazione.js
// Verifica la struttura di vocazione.json: i refusi nel contenuto sono
// l'errore realistico su un sito editoriale.
const TIPI_BLOCCO = ['prosa', 'elenco', 'segni', 'passi', 'riflessioni', 'testimonianze', 'rimandi'];
const SEZIONI = ['hub', 'percorsi', 'domande', 'proposta'];

function validaBlocchi(blocchi, percorsoTesto, opzioni, errori) {
  (blocchi || []).forEach((blocco, i) => {
    const dove = `${percorsoTesto}[${i}]`;
    if (!TIPI_BLOCCO.includes(blocco.tipo)) {
      errori.push(`${dove}: tipo sconosciuto "${blocco.tipo}"`);
      return;
    }
    if (blocco.tipo === 'rimandi') {
      (blocco.voci || []).forEach((voce, j) => {
        if (!opzioni.rotteNote.includes(voce.rotta)) {
          errori.push(`${dove}.voci[${j}]: rotta inesistente "${voce.rotta}"`);
        }
      });
    }
    if (blocco.tipo === 'testimonianze') {
      (blocco.voci || []).forEach((voce, j) => {
        if (voce.foto && !opzioni.immagineEsiste(voce.foto)) {
          errori.push(`${dove}.voci[${j}]: immagine assente "${voce.foto}"`);
        }
      });
    }
  });
}

function validaContenuto(contenuto, opzioni) {
  const errori = [];
  for (const sezione of SEZIONI) {
    if (!contenuto[sezione]) errori.push(`manca la sezione "${sezione}"`);
  }
  if (errori.length) return errori;

  for (const [nome, percorso] of Object.entries(contenuto.percorsi)) {
    validaBlocchi(percorso.blocchi, `percorsi.${nome}.blocchi`, opzioni, errori);
  }
  validaBlocchi(contenuto.proposta.blocchi, 'proposta.blocchi', opzioni, errori);

  contenuto.domande.forEach((d, i) => {
    if (!d.domanda || !d.risposta) errori.push(`domande[${i}]: domanda o risposta mancante`);
  });

  return errori;
}

module.exports = { validaContenuto, TIPI_BLOCCO };
```

- [ ] **Step 4: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/valida-vocazione.js scripts/lib/valida-vocazione.test.js
git commit -m "test(vocazione): validatore della struttura del contenuto"
```

---

### Task 9: Immagini delle testimonianze

**Files:**
- Create: `src/assets/img/vocazione/stella.jpg`, `src/assets/img/vocazione/ilaria.jpg`

- [ ] **Step 1: Scaricarle**

Sono servite in `http://` da un dominio esterno: su un sito HTTPS il browser le bloccherebbe come mixed content, quindi vanno portate nel repo.

```bash
mkdir -p src/assets/img/vocazione
curl -fsSL http://vocazione.altervista.org/hosted-images/t1.jpg -o src/assets/img/vocazione/stella.jpg
curl -fsSL http://vocazione.altervista.org/hosted-images/t3.jpg -o src/assets/img/vocazione/ilaria.jpg
```

- [ ] **Step 2: Verificare che siano immagini valide e non pagine di errore**

```bash
file src/assets/img/vocazione/*.jpg
```
Expected: `JPEG image data` per entrambe. Se una risulta HTML, il dominio è caduto: proseguire senza foto, il componente le tratta come opzionali.

- [ ] **Step 3: Commit**

```bash
git add src/assets/img/vocazione
git commit -m "feat(vocazione): porta in repo le foto delle testimonianze"
```

---

### Task 10: Il contenuto

Trascrizione dal documento. La struttura è vincolata dal validatore della Task 8; il testo va copiato **alla lettera** dal markdown convertito.

**Files:**
- Create: `src/assets/data/vocazione.json`
- Modify: `scripts/lib/valida-vocazione.test.js`

**Interfaces:**
- Produces: `vocazione.json` con le chiavi `hub`, `percorsi`, `domande`, `proposta`.

- [ ] **Step 1: Aggiungere al test la validazione del contenuto reale**

In fondo a `scripts/lib/valida-vocazione.test.js`:

```js
const fs = require('node:fs');
const path = require('node:path');

test('vocazione.json e\' valido', () => {
  const contenuto = JSON.parse(fs.readFileSync('src/assets/data/vocazione.json', 'utf8'));
  const rotteNote = [
    'vocazione', 'vocazione-discernimento', 'vocazione-matrimonio',
    'vocazione-sacerdozio', 'vocazione-vita-consacrata',
    'vocazione-domande', 'vocazione-proposta',
  ];
  const errori = validaContenuto(contenuto, {
    rotteNote,
    immagineEsiste: (n) => fs.existsSync(path.join('src/assets/img/vocazione', n)),
  });
  assert.deepStrictEqual(errori, []);
});

test('i quattro percorsi del documento sono presenti', () => {
  const contenuto = JSON.parse(fs.readFileSync('src/assets/data/vocazione.json', 'utf8'));
  assert.deepStrictEqual(Object.keys(contenuto.percorsi).sort(),
    ['discernimento', 'matrimonio', 'sacerdozio', 'vita-consacrata']);
});

test('le domande del documento sono otto', () => {
  const contenuto = JSON.parse(fs.readFileSync('src/assets/data/vocazione.json', 'utf8'));
  assert.strictEqual(contenuto.domande.length, 8);
});
```

- [ ] **Step 2: Eseguire i test e verificare che falliscano**

Run: `npm test`
Expected: FAIL — `vocazione.json` non esiste.

- [ ] **Step 3: Scrivere il contenuto**

Struttura, con l'hub compilato per intero dal documento (sezione *"VOCAZIONE: ALLA RICERCA DEL GRANDE TESORO"*):

```jsonc
{
  "hub": {
    "header": {
      "titolo": "Vocazione",
      "sottotitolo": "Alla ricerca del grande tesoro",
      "immagine": "vocazioni.jpg"
    },
    "citazione": "«Il regno dei cieli è simile a un tesoro nascosto nel campo; un uomo lo trova e lo nasconde; poi va, pieno di gioia, vende tutti i suoi averi e compra quel campo» (Mt 13,44).",
    "intro": "**Caro fratello, cara sorella, benvenuto!**\n\nForse sei arrivato qui perché ti porti dentro una domanda…",
    "invito": "Da dove cominciare? Scegli la voce che ti interessa",
    "porte": [
      { "titolo": "Sto cercando la mia strada",
        "testo": "Se senti il desiderio di capire meglio ciò che Dio vuole da te, inizia dal percorso sul discernimento vocazionale.",
        "rotta": "vocazione-discernimento" },
      { "titolo": "Penso al matrimonio",
        "testo": "Se stai vivendo un fidanzamento o desideri formare una famiglia cristiana, scopri la bellezza della vocazione matrimoniale.",
        "rotta": "vocazione-matrimonio" },
      { "titolo": "Mi interrogo sul sacerdozio",
        "testo": "Se avverti nel cuore il desiderio di seguire Gesù come sacerdote e servire il suo popolo, approfondisci questa chiamata.",
        "rotta": "vocazione-sacerdozio" },
      { "titolo": "Mi sento attratto dalla vita consacrata",
        "testo": "Se percepisci il desiderio di appartenere totalmente a Cristo e di seguirlo più da vicino, esplora il cammino della vita consacrata.",
        "rotta": "vocazione-vita-consacrata" }
    ],
    "chiusura": "**E ricorda, si tratta di un cammino, non di una corsa!**\n\nLa vocazione non si scopre in un giorno…"
  },

  "percorsi": {
    "discernimento": {
      "header": { "titolo": "Sto cercando la mia strada", "immagine": "vocazioni-1.jpg" },
      "blocchi": [
        { "tipo": "elenco", "variante": "puntato", "titolo": "Forse ti stai chiedendo:",
          "voci": ["Che cosa farò della mia vita?", "Quale sarà il mio futuro?",
                   "Come posso essere felice?", "Dio ha un progetto per me?"] },
        { "tipo": "prosa", "titolo": "La tua vita è una vocazione", "testo": "…" },
        { "tipo": "elenco", "variante": "puntato", "titolo": "Dio parla ancora oggi",
          "voci": ["la sua Parola", "la preghiera", "gli incontri", "i desideri profondi",
                   "gli avvenimenti della vita", "le persone che ci accompagnano"] },
        { "tipo": "passi", "titolo": "Sei passi per discernere", "passi": [
          { "titolo": "Cerca sinceramente la verità", "testo": "…" },
          { "titolo": "Coltiva l'amicizia con Gesù", "testo": "…" },
          { "titolo": "Ascolta il tuo cuore", "testo": "…" },
          { "titolo": "Rileggi la tua storia", "testo": "…" },
          { "titolo": "Conosci te stesso", "testo": "…" },
          { "titolo": "Non camminare da solo", "testo": "…" }
        ] },
        { "tipo": "segni", "titolo": "Alcuni segnali importanti",
          "voci": ["gioia profonda", "inquietudine, percezione di incompiutezza",
                   "desiderio di donarsi", "perseveranza nel tempo", "crescita nell'amore"] },
        { "tipo": "prosa", "titolo": "Non avere paura", "testo": "…" },
        { "tipo": "rimandi", "titolo": "E adesso?", "voci": [
          { "etichetta": "Matrimonio", "rotta": "vocazione-matrimonio" },
          { "etichetta": "Sacerdozio", "rotta": "vocazione-sacerdozio" },
          { "etichetta": "Vita consacrata", "rotta": "vocazione-vita-consacrata" }
        ] }
      ]
    },

    "matrimonio": {
      "header": { "titolo": "Vocazione al matrimonio", "sottotitolo": "Una chiamata ad amare" },
      "blocchi": [
        { "tipo": "prosa", "testo": "…" },
        { "tipo": "segni", "titolo": "Come capire se questa è la tua strada?", "voci": [
          "il desiderio di condividere la vita con quella persona concreta",
          "la capacità di progettare il futuro insieme",
          "la disponibilità al dono reciproco",
          "la capacità di affrontare insieme gioie e difficoltà"] },
        { "tipo": "prosa", "titolo": "Il tempo del fidanzamento", "testo": "…" },
        { "tipo": "prosa", "titolo": "Un amore che diventa segno", "testo": "…" },
        { "tipo": "riflessioni", "titolo": "Per riflettere", "domande": [
          "Questa relazione mi aiuta a crescere come persona e come credente?",
          "Riesco a immaginare il mio futuro accanto a questa persona?",
          "Il nostro amore ci apre agli altri o ci chiude in noi stessi?",
          "Stiamo costruendo un progetto fondato soltanto sui sentimenti o anche sulla fede?"] },
        { "tipo": "testimonianze", "titolo": "Testimonianze", "voci": [
          { "nome": "Mattia e Viviana", "foto": null, "testo": "…" }] }
      ]
    },

    "sacerdozio": {
      "header": { "titolo": "Vocazione al sacerdozio", "sottotitolo": "«Vieni e seguimi»" },
      "blocchi": [
        { "tipo": "prosa", "testo": "…" },
        { "tipo": "prosa", "titolo": "Come nasce una vocazione sacerdotale?", "testo": "…" },
        { "tipo": "segni", "titolo": "Alcuni segni possibili", "voci": [
          "cresce il desiderio di stare con Gesù",
          "nasce la gioia di servire la comunità",
          "il pensiero del sacerdozio ritorna nel tempo",
          "si avverte il desiderio di dedicare la propria vita al Vangelo",
          "la chiamata continua ad affacciarsi nonostante paure e incertezze"] },
        { "tipo": "prosa", "titolo": "Un dono per gli altri", "testo": "…" },
        { "tipo": "prosa", "titolo": "Il seminario", "testo": "…" },
        { "tipo": "riflessioni", "titolo": "Per riflettere", "domande": [
          "Mi sento attratto dalla figura di Gesù Buon Pastore?",
          "Il servizio agli altri mi dona gioia?",
          "Il pensiero del sacerdozio ritorna nel tempo?",
          "Ho il desiderio di dedicare la mia vita al Vangelo?"] }
      ]
    },

    "vita-consacrata": {
      "header": { "titolo": "Vocazione alla vita consacrata", "sottotitolo": "«Tu solo mi basti»" },
      "blocchi": [
        { "tipo": "prosa", "testo": "…" },
        { "tipo": "prosa", "titolo": "Che cos'è la vita consacrata?", "testo": "…" },
        { "tipo": "segni", "titolo": "Come riconoscere questa chiamata?", "voci": [
          "un forte desiderio di appartenere totalmente al Signore",
          "l'attrazione per una vita di preghiera",
          "il desiderio di vivere in fraternità",
          "la disponibilità alla missione e al servizio",
          "una gioia particolare nel pensare di consacrare tutta la vita a Cristo in quella particolare famiglia religiosa"] },
        { "tipo": "prosa", "titolo": "Una vita per il Regno", "testo": "…" },
        { "tipo": "prosa", "titolo": "La bellezza della fraternità", "testo": "…" },
        { "tipo": "riflessioni", "titolo": "Per riflettere", "domande": [
          "Mi attira l'idea di appartenere totalmente a Cristo?",
          "Sento gioia nella preghiera e nell'incontro con il Signore?",
          "Mi sento chiamato a una vita semplice, fraterna e missionaria?",
          "Questa possibilità ritorna nel mio cuore nel corso del tempo?"] },
        { "tipo": "testimonianze", "titolo": "Testimonianze", "voci": [
          { "nome": "Suor Stella", "foto": "stella.jpg", "testo": "…" },
          { "nome": "Sorella Ilaria", "foto": "ilaria.jpg", "testo": "…" }] }
      ]
    }
  },

  "domande": [
    { "id": 1, "domanda": "Un giovane che sente la chiamata ma trova forti ostacoli in famiglia come deve comportarsi?", "risposta": "…" }
    // … le altre 7, nell'ordine del documento
  ],

  "proposta": {
    "header": { "titolo": "La nostra proposta", "sottotitolo": "Per coloro che vogliono capire meglio" },
    "blocchi": [
      { "tipo": "prosa", "testo": "…" },
      { "tipo": "prosa", "titolo": "Per le coppie di sposi", "testo": "…" }
    ]
  }
}
```

Regole di trascrizione:

- I `…` vanno sostituiti con il testo integrale del documento. Il `testo` accetta markdown: `**grassetto**`, `«citazioni»`, righe vuote per i paragrafi.
- **Nessun indirizzo email.** Dove il documento chiude con un recapito, il testo si ferma prima: l'invito a `/contatti` lo aggiunge il componente (Task 17).
- Le **domande 1-8** si copiano da `../mdv-vocational/src/data/faq.json`, che contiene le stesse 8 con le risposte già formattate. Ignorare la nona voce dell'elenco del documento: è un duplicato della prima.
- Le **testimonianze**: `Mattia e Viviana` da `testimonianze4.md`, `Suor Stella` da `testimonianze1.md`, `Sorella Ilaria` da `testimonianze3.md`, rimuovendo la prima riga di ciascun file (è il markdown dell'immagine, ora sostituito dal campo `foto`).
- **Sr. Lucia non esiste** nel materiale disponibile: il documento la nomina ma il testo non c'è. Si pubblica con le tre testimonianze reperite.

- [ ] **Step 4: Eseguire i test**

Run: `npm test`
Expected: PASS — inclusi i tre test nuovi sul contenuto reale.

- [ ] **Step 5: Commit**

```bash
git add src/assets/data/vocazione.json scripts/lib/valida-vocazione.test.js
git commit -m "feat(vocazione): contenuto della sezione dal documento redazionale"
```

---

### Task 11: VocProsa e VocElenco

**Files:**
- Create: `src/components/vocazione/VocProsa.vue`
- Create: `src/components/vocazione/VocElenco.vue`

**Interfaces:**
- Produces:
  - `VocProsa` — props `titolo: String` (opzionale), `testo: String` (markdown, obbligatorio)
  - `VocElenco` — props `titolo: String` (opzionale), `voci: Array` (obbligatorio), `variante: String` (`'puntato'` o `'segni'`, default `'puntato'`)

- [ ] **Step 1: Creare VocProsa**

```vue
<template>
  <section class="voc-prosa">
    <h2 v-if="titolo" class="voc-prosa__titolo">{{ titolo }}</h2>
    <Markdown :source="testo" :html="true" class="markdown-mdv" />
  </section>
</template>

<script>
import Markdown from 'vue3-markdown-it';

export default {
  name: 'VocProsa',
  components: { Markdown },
  props: {
    titolo: { type: String, default: '' },
    testo: { type: String, required: true },
  },
};
</script>

<style scoped>
.voc-prosa {
  margin-bottom: var(--mdv-spazio-6);
}
.voc-prosa__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
  margin-bottom: var(--mdv-spazio-4);
}
.voc-prosa :deep(p) {
  font-family: var(--mdv-font-corpo);
  line-height: 1.9;
  margin-bottom: var(--mdv-spazio-4);
}
</style>
```

- [ ] **Step 2: Creare VocElenco**

```vue
<template>
  <section class="voc-elenco">
    <h2 v-if="titolo" class="voc-elenco__titolo">{{ titolo }}</h2>
    <ul :class="['voc-elenco__lista', `voc-elenco__lista--${variante}`]">
      <li v-for="(voce, i) in voci" :key="i" class="voc-elenco__voce">{{ voce }}</li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'VocElenco',
  props: {
    titolo: { type: String, default: '' },
    voci: { type: Array, required: true },
    variante: {
      type: String,
      default: 'puntato',
      validator: (v) => ['puntato', 'segni'].includes(v),
    },
  },
};
</script>

<style scoped>
.voc-elenco {
  margin-bottom: var(--mdv-spazio-6);
}
.voc-elenco__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
  margin-bottom: var(--mdv-spazio-4);
}
.voc-elenco__lista {
  list-style: none;
  padding-left: 0;
}
.voc-elenco__voce {
  font-family: var(--mdv-font-corpo);
  padding-left: var(--mdv-spazio-5);
  margin-bottom: var(--mdv-spazio-3);
  position: relative;
  line-height: 1.7;
}
.voc-elenco__lista--puntato .voc-elenco__voce::before {
  content: '·';
  position: absolute;
  left: var(--mdv-spazio-2);
  color: var(--mdv-sabbia);
  font-size: 1.6rem;
  line-height: 1;
}
.voc-elenco__lista--segni .voc-elenco__voce::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--mdv-oro);
}
</style>
```

- [ ] **Step 3: Eseguire i test**

Run: `npm test`
Expected: PASS — i due file nuovi non sono in deroga e non contengono valori scritti a mano.

- [ ] **Step 4: Commit**

```bash
git add src/components/vocazione/VocProsa.vue src/components/vocazione/VocElenco.vue
git commit -m "feat(vocazione): blocchi prosa ed elenco"
```

---

### Task 12: VocPassi

**Files:**
- Create: `src/components/vocazione/VocPassi.vue`

**Interfaces:**
- Consumes: `vocStorage` da `@/utility/vocStorage.mjs`
- Produces: `VocPassi` — props `titolo: String`, `passi: Array<{titolo, testo}>`, `percorso: String` (chiave di persistenza)

- [ ] **Step 1: Creare il componente**

```vue
<template>
  <section class="voc-passi">
    <h2 v-if="titolo" class="voc-passi__titolo">{{ titolo }}</h2>
    <p class="voc-passi__avanzamento">{{ letti.length }} di {{ passi.length }}</p>

    <ol class="voc-passi__lista">
      <li v-for="(passo, i) in passi" :key="i" class="voc-passi__passo">
        <button
          type="button"
          :class="['voc-passi__intestazione', { 'voc-passi__intestazione--letto': letti.includes(i) }]"
          :aria-expanded="aperto === i"
          @click="apri(i)"
        >
          <span class="voc-passi__numero">{{ i + 1 }}</span>
          <span class="voc-passi__nome">{{ passo.titolo }}</span>
        </button>
        <p v-show="aperto === i" class="voc-passi__testo">{{ passo.testo }}</p>
      </li>
    </ol>
  </section>
</template>

<script>
import { vocStorage } from '@/utility/vocStorage.mjs';

export default {
  name: 'VocPassi',
  props: {
    titolo: { type: String, default: '' },
    passi: { type: Array, required: true },
    percorso: { type: String, required: true },
  },
  data() {
    return {
      aperto: null,
      letti: vocStorage.leggi(this.percorso, 'passi', []),
    };
  },
  methods: {
    apri(i) {
      this.aperto = this.aperto === i ? null : i;
      if (this.aperto === i && !this.letti.includes(i)) {
        this.letti = [...this.letti, i];
        vocStorage.scrivi(this.percorso, 'passi', this.letti);
      }
    },
  },
};
</script>

<style scoped>
.voc-passi { margin-bottom: var(--mdv-spazio-6); }
.voc-passi__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
  margin-bottom: var(--mdv-spazio-2);
}
.voc-passi__avanzamento {
  font-family: var(--mdv-font-navigazione);
  color: var(--mdv-grigio);
  margin-bottom: var(--mdv-spazio-4);
}
.voc-passi__lista { list-style: none; padding-left: 0; }
.voc-passi__passo { margin-bottom: var(--mdv-spazio-3); }
.voc-passi__intestazione {
  display: flex;
  align-items: center;
  gap: var(--mdv-spazio-3);
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid var(--mdv-sabbia);
  padding: var(--mdv-spazio-3) 0;
  text-align: left;
  font-family: var(--mdv-font-corpo);
  cursor: pointer;
}
.voc-passi__numero {
  flex: 0 0 auto;
  width: var(--mdv-spazio-6);
  height: var(--mdv-spazio-6);
  border-radius: 50%;
  border: 1px solid var(--mdv-sabbia);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
}
.voc-passi__intestazione--letto .voc-passi__numero {
  background-color: var(--mdv-oro);
  color: var(--mdv-bianco);
  border-color: var(--mdv-oro);
}
.voc-passi__testo {
  font-family: var(--mdv-font-corpo);
  padding: var(--mdv-spazio-3) 0 var(--mdv-spazio-3) var(--mdv-spazio-6);
  line-height: 1.8;
}
</style>
```

- [ ] **Step 2: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/vocazione/VocPassi.vue
git commit -m "feat(vocazione): blocco passi con avanzamento"
```

---

### Task 13: VocRiflessioni

**Files:**
- Create: `src/components/vocazione/VocRiflessioni.vue`

**Interfaces:**
- Consumes: `vocStorage`
- Produces: `VocRiflessioni` — props `titolo: String`, `domande: Array<String>`, `percorso: String`

- [ ] **Step 1: Creare il componente**

```vue
<template>
  <section class="voc-riflessioni">
    <h2 v-if="titolo" class="voc-riflessioni__titolo">{{ titolo }}</h2>

    <p class="voc-riflessioni__avviso">
      Le tue risposte restano su questo dispositivo: non le riceve nessuno.
    </p>

    <div v-for="(domanda, i) in domande" :key="i" class="voc-riflessioni__voce">
      <button
        type="button"
        class="voc-riflessioni__domanda"
        :aria-expanded="aperta === i"
        @click="aperta = aperta === i ? null : i"
      >
        {{ domanda }}
      </button>
      <textarea
        v-show="aperta === i"
        v-model="risposte[i]"
        class="voc-riflessioni__risposta"
        rows="4"
        placeholder="Puoi scrivere qui, con calma."
        @blur="salva"
      ></textarea>
    </div>

    <button
      v-if="haRisposte"
      type="button"
      class="voc-riflessioni__cancella"
      @click="cancella"
    >
      Cancella le mie risposte
    </button>
  </section>
</template>

<script>
import { vocStorage } from '@/utility/vocStorage.mjs';

export default {
  name: 'VocRiflessioni',
  props: {
    titolo: { type: String, default: '' },
    domande: { type: Array, required: true },
    percorso: { type: String, required: true },
  },
  data() {
    return {
      aperta: null,
      risposte: vocStorage.leggi(this.percorso, 'riflessioni', {}),
    };
  },
  computed: {
    haRisposte() {
      return Object.values(this.risposte).some((r) => r && r.trim().length > 0);
    },
  },
  methods: {
    salva() {
      vocStorage.scrivi(this.percorso, 'riflessioni', this.risposte);
    },
    cancella() {
      this.risposte = {};
      vocStorage.cancella(this.percorso);
    },
  },
};
</script>

<style scoped>
.voc-riflessioni {
  margin-bottom: var(--mdv-spazio-6);
  padding: var(--mdv-spazio-5);
  background-color: var(--mdv-crema);
  border-radius: var(--mdv-raggio-m);
}
.voc-riflessioni__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro-scuro);
}
.voc-riflessioni__avviso {
  font-family: var(--mdv-font-navigazione);
  font-size: 0.9rem;
  color: var(--mdv-grigio-scuro);
  margin-bottom: var(--mdv-spazio-4);
}
.voc-riflessioni__voce { margin-bottom: var(--mdv-spazio-3); }
.voc-riflessioni__domanda {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid var(--mdv-sabbia);
  padding: var(--mdv-spazio-3) 0;
  font-family: var(--mdv-font-corpo);
  cursor: pointer;
}
.voc-riflessioni__risposta {
  width: 100%;
  margin-top: var(--mdv-spazio-2);
  padding: var(--mdv-spazio-3);
  border: 1px solid var(--mdv-sabbia);
  border-radius: var(--mdv-raggio-s);
  font-family: var(--mdv-font-corpo);
  background-color: var(--mdv-bianco);
}
.voc-riflessioni__cancella {
  margin-top: var(--mdv-spazio-4);
  background: none;
  border: 1px solid var(--mdv-grigio);
  border-radius: var(--mdv-raggio-s);
  padding: var(--mdv-spazio-2) var(--mdv-spazio-4);
  font-family: var(--mdv-font-navigazione);
  color: var(--mdv-grigio-scuro);
  cursor: pointer;
}
</style>
```

- [ ] **Step 2: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/vocazione/VocRiflessioni.vue
git commit -m "feat(vocazione): blocco per riflettere con risposte locali"
```

---

### Task 14: VocTestimonianze, VocRimandi, VocPorte

Tre componenti di sola presentazione, senza stato.

**Files:**
- Create: `src/components/vocazione/VocTestimonianze.vue`
- Create: `src/components/vocazione/VocRimandi.vue`
- Create: `src/components/vocazione/VocPorte.vue`

**Interfaces:**
- Produces:
  - `VocTestimonianze` — props `titolo: String`, `voci: Array<{nome, foto, testo}>`
  - `VocRimandi` — props `titolo: String`, `voci: Array<{etichetta, rotta}>`
  - `VocPorte` — props `porte: Array<{titolo, testo, rotta}>`

- [ ] **Step 1: Creare VocTestimonianze**

```vue
<template>
  <section class="voc-testimonianze">
    <h2 v-if="titolo" class="voc-testimonianze__titolo">{{ titolo }}</h2>
    <article v-for="(voce, i) in voci" :key="i" class="voc-testimonianze__voce">
      <img
        v-if="voce.foto"
        :src="immagine(voce.foto)"
        :alt="voce.nome"
        class="voc-testimonianze__foto"
      />
      <h3 class="voc-testimonianze__nome">{{ voce.nome }}</h3>
      <Markdown :source="voce.testo" :html="true" class="markdown-mdv" />
    </article>
  </section>
</template>

<script>
import Markdown from 'vue3-markdown-it';

export default {
  name: 'VocTestimonianze',
  components: { Markdown },
  props: {
    titolo: { type: String, default: '' },
    voci: { type: Array, required: true },
  },
  methods: {
    immagine(nome) {
      return require(`@/assets/img/vocazione/${nome}`);
    },
  },
};
</script>

<style scoped>
.voc-testimonianze { margin-bottom: var(--mdv-spazio-6); }
.voc-testimonianze__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
  margin-bottom: var(--mdv-spazio-4);
}
.voc-testimonianze__voce {
  margin-bottom: var(--mdv-spazio-6);
  padding-left: var(--mdv-spazio-4);
  border-left: 2px solid var(--mdv-sabbia);
}
.voc-testimonianze__foto {
  float: right;
  width: 10rem;
  margin: 0 0 var(--mdv-spazio-3) var(--mdv-spazio-4);
  border-radius: var(--mdv-raggio-m);
}
.voc-testimonianze__nome {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro-scuro);
}
.voc-testimonianze :deep(p) {
  font-family: var(--mdv-font-corpo);
  line-height: 1.9;
}
@media (max-width: 576px) {
  .voc-testimonianze__foto { float: none; width: 100%; margin: 0 0 var(--mdv-spazio-3) 0; }
}
</style>
```

- [ ] **Step 2: Creare VocRimandi**

```vue
<template>
  <nav class="voc-rimandi">
    <h2 v-if="titolo" class="voc-rimandi__titolo">{{ titolo }}</h2>
    <ul class="voc-rimandi__lista">
      <li v-for="(voce, i) in voci" :key="i">
        <router-link :to="{ name: voce.rotta }" class="voc-rimandi__link">
          {{ voce.etichetta }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'VocRimandi',
  props: {
    titolo: { type: String, default: '' },
    voci: { type: Array, required: true },
  },
};
</script>

<style scoped>
.voc-rimandi { margin-bottom: var(--mdv-spazio-6); }
.voc-rimandi__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
  margin-bottom: var(--mdv-spazio-3);
}
.voc-rimandi__lista {
  list-style: none;
  padding-left: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--mdv-spazio-3);
}
.voc-rimandi__link {
  display: inline-block;
  padding: var(--mdv-spazio-2) var(--mdv-spazio-4);
  border: 1px solid var(--mdv-sabbia);
  border-radius: var(--mdv-raggio-s);
  font-family: var(--mdv-font-navigazione);
  color: var(--mdv-oro-scuro);
  text-decoration: none;
}
.voc-rimandi__link:hover { background-color: var(--mdv-crema); }
</style>
```

- [ ] **Step 3: Creare VocPorte**

```vue
<template>
  <div class="voc-porte">
    <router-link
      v-for="(porta, i) in porte"
      :key="i"
      :to="{ name: porta.rotta }"
      class="voc-porte__porta"
    >
      <h3 class="voc-porte__titolo">{{ porta.titolo }}</h3>
      <p class="voc-porte__testo">{{ porta.testo }}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'VocPorte',
  props: {
    porte: { type: Array, required: true },
  },
};
</script>

<style scoped>
.voc-porte {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: var(--mdv-spazio-4);
  margin: var(--mdv-spazio-6) 0;
}
.voc-porte__porta {
  display: block;
  padding: var(--mdv-spazio-5);
  border: 1px solid var(--mdv-sabbia);
  border-radius: var(--mdv-raggio-m);
  text-decoration: none;
  color: inherit;
  transition: background-color .15s, transform .15s;
}
.voc-porte__porta:hover {
  background-color: var(--mdv-crema);
  transform: translateY(-2px);
}
.voc-porte__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro-scuro);
  margin-bottom: var(--mdv-spazio-3);
}
.voc-porte__testo {
  font-family: var(--mdv-font-corpo);
  line-height: 1.7;
  margin: 0;
}
</style>
```

- [ ] **Step 4: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/vocazione/VocTestimonianze.vue src/components/vocazione/VocRimandi.vue src/components/vocazione/VocPorte.vue
git commit -m "feat(vocazione): blocchi testimonianze, rimandi e porte"
```

---

### Task 15: VocFaq

**Files:**
- Create: `src/components/vocazione/VocFaq.vue`

**Interfaces:**
- Produces: `VocFaq` — props `domande: Array<{id, domanda, risposta}>`

- [ ] **Step 1: Creare il componente**

Le 8 risposte sono lunghe: si apre una alla volta e la domanda resta visibile.

```vue
<template>
  <div class="voc-faq">
    <article v-for="(voce, i) in domande" :key="voce.id" class="voc-faq__voce">
      <button
        type="button"
        :class="['voc-faq__domanda', { 'voc-faq__domanda--aperta': aperta === i }]"
        :aria-expanded="aperta === i"
        @click="aperta = aperta === i ? null : i"
      >
        {{ voce.domanda }}
      </button>
      <div v-show="aperta === i" class="voc-faq__risposta">
        <Markdown :source="voce.risposta" :html="true" class="markdown-mdv" />
      </div>
    </article>
  </div>
</template>

<script>
import Markdown from 'vue3-markdown-it';

export default {
  name: 'VocFaq',
  components: { Markdown },
  props: {
    domande: { type: Array, required: true },
  },
  data() {
    return { aperta: null };
  },
};
</script>

<style scoped>
.voc-faq__voce { border-bottom: 1px solid var(--mdv-sabbia); }
.voc-faq__domanda {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: var(--mdv-spazio-4) 0;
  font-family: var(--mdv-font-corpo);
  font-size: 1.1rem;
  color: var(--mdv-bruno-900);
  cursor: pointer;
}
.voc-faq__domanda--aperta { color: var(--mdv-oro); }
.voc-faq__risposta {
  padding: 0 0 var(--mdv-spazio-5) 0;
  max-width: 42rem;
}
.voc-faq__risposta :deep(p) {
  font-family: var(--mdv-font-corpo);
  line-height: 1.9;
  margin-bottom: var(--mdv-spazio-4);
}
</style>
```

- [ ] **Step 2: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/vocazione/VocFaq.vue
git commit -m "feat(vocazione): fisarmonica delle domande"
```

---

### Task 16: Rotte e layout di sezione

**Files:**
- Create: `src/view/vocazione/VocazioneLayout.vue`
- Modify: `src/router/index.js`

**Interfaces:**
- Consumes: `decidiAccesso` da `@/utility/accessoVocazione.mjs`
- Produces: le rotte `vocazione`, `vocazione-discernimento`, `vocazione-matrimonio`, `vocazione-sacerdozio`, `vocazione-vita-consacrata`, `vocazione-domande`, `vocazione-proposta`.

- [ ] **Step 1: Creare il layout**

```vue
<template>
  <div class="voc-layout">
    <router-view />
    <nav v-if="!inHub" class="voc-layout__ritorno">
      <router-link :to="{ name: 'vocazione' }" class="voc-layout__link">
        Torna all'inizio del cammino
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'VocazioneLayout',
  computed: {
    inHub() {
      return this.$route.name === 'vocazione';
    },
    lingua() {
      return localStorage.getItem('lang') || 'it';
    },
  },
  watch: {
    // Se l'utente cambia lingua mentre e' dentro la sezione, le sotto-pagine
    // non esistono in quella lingua: si torna all'hub.
    '$route'(rotta) {
      if (rotta.name !== 'vocazione' && this.lingua !== 'it') {
        this.$router.replace({ name: 'vocazione' });
      }
    },
  },
};
</script>

<style scoped>
.voc-layout__ritorno {
  margin: var(--mdv-spazio-6) 0;
  text-align: center;
}
.voc-layout__link {
  font-family: var(--mdv-font-navigazione);
  color: var(--mdv-oro-scuro);
  text-decoration: none;
  border-bottom: 1px solid var(--mdv-sabbia);
}
</style>
```

- [ ] **Step 2: Sostituire la rotta `/vocazione` nel router**

In `src/router/index.js`, rimuovere l'import di `Vocazione` e la riga `{ path: '/vocazione', name: 'vocazione', component: Vocazione }`, sostituendola con:

```js
import VocazioneLayout from '@/view/vocazione/VocazioneLayout';
import VocazioneHub from '@/view/vocazione/VocazioneHub';
import VocazionePercorso from '@/view/vocazione/VocazionePercorso';
import VocazioneDomande from '@/view/vocazione/VocazioneDomande';
import VocazioneProposta from '@/view/vocazione/VocazioneProposta';
import { decidiAccesso } from '@/utility/accessoVocazione.mjs';

const presidioLingua = (to, from, next) => {
  const lingua = localStorage.getItem('lang') || 'it';
  const esito = decidiAccesso(lingua, to.name);
  if (esito.consentito) return next();
  return next({ name: esito.redirezione });
};

const rotteVocazione = {
  path: '/vocazione',
  component: VocazioneLayout,
  children: [
    { path: '', name: 'vocazione', component: VocazioneHub },
    { path: 'discernimento', name: 'vocazione-discernimento', component: VocazionePercorso,
      props: { chiave: 'discernimento' }, beforeEnter: presidioLingua },
    { path: 'matrimonio', name: 'vocazione-matrimonio', component: VocazionePercorso,
      props: { chiave: 'matrimonio' }, beforeEnter: presidioLingua },
    { path: 'sacerdozio', name: 'vocazione-sacerdozio', component: VocazionePercorso,
      props: { chiave: 'sacerdozio' }, beforeEnter: presidioLingua },
    { path: 'vita-consacrata', name: 'vocazione-vita-consacrata', component: VocazionePercorso,
      props: { chiave: 'vita-consacrata' }, beforeEnter: presidioLingua },
    { path: 'domande', name: 'vocazione-domande', component: VocazioneDomande,
      beforeEnter: presidioLingua },
    { path: 'proposta', name: 'vocazione-proposta', component: VocazioneProposta,
      beforeEnter: presidioLingua },
    // Slug sconosciuto dentro la sezione: all'hub, non alla home.
    { path: ':qualsiasi(.*)', redirect: { name: 'vocazione' } },
  ],
};
```

Inserire `rotteVocazione` nell'array `routes` al posto della vecchia voce, mantenendo l'ordine attuale.

- [ ] **Step 3: Verificare che l'applicazione compili**

Run: `npm run serve`
Expected: compilazione senza errori. Le view delle Task 17-19 non esistono ancora: **questo passo va eseguito dopo di esse.** Se si segue l'ordine del piano, completare prima le Task 17, 18 e 19 e tornare qui.

- [ ] **Step 4: Commit**

```bash
git add src/view/vocazione/VocazioneLayout.vue src/router/index.js
git commit -m "feat(vocazione): rotte annidate e presidio della lingua"
```

---

### Task 17: VocazioneHub

**Files:**
- Create: `src/view/vocazione/VocazioneHub.vue`

**Interfaces:**
- Consumes: `vocazione.json`, `VocPorte`, `MdvHeader`
- Produces: la soglia d'ingresso della sezione; in lingua diversa dall'italiano mostra il contenuto breve preesistente dallo store.

- [ ] **Step 1: Creare la view**

```vue
<template>
  <!-- Altre lingue: si riusa la pagina preesistente cosi' com'e'.
       E' gia' autosufficiente (header, spinner, caricamento dallo store):
       reimplementarla qui significherebbe solo poterla far divergere. -->
  <VocazioneLegacy v-if="!inItaliano" />

  <section v-else>
    <MdvHeader
      :image="contenuto.hub.header.immagine"
      :title="contenuto.hub.header.titolo"
      :caption="contenuto.hub.header.sottotitolo"
    />

    <div class="container voc-hub">
      <blockquote class="voc-hub__citazione">{{ contenuto.hub.citazione }}</blockquote>
      <Markdown :source="contenuto.hub.intro" :html="true" class="markdown-mdv" />
      <h2 class="voc-hub__invito">{{ contenuto.hub.invito }}</h2>
      <VocPorte :porte="contenuto.hub.porte" />
      <Markdown :source="contenuto.hub.chiusura" :html="true" class="markdown-mdv" />
      <VocRimandi
        titolo="Puoi anche"
        :voci="[
          { etichetta: 'Le vostre domande', rotta: 'vocazione-domande' },
          { etichetta: 'La nostra proposta', rotta: 'vocazione-proposta' },
        ]"
      />
    </div>
  </section>
</template>

<script>
import Markdown from 'vue3-markdown-it';
import MdvHeader from '@/components/layout/MdvHeader';
import VocazioneLegacy from '@/view/Vocazione';
import VocPorte from '@/components/vocazione/VocPorte';
import VocRimandi from '@/components/vocazione/VocRimandi';
import contenuto from '@/assets/data/vocazione.json';

export default {
  name: 'VocazioneHub',
  components: { Markdown, MdvHeader, VocazioneLegacy, VocPorte, VocRimandi },
  data() {
    return {
      contenuto,
      inItaliano: (localStorage.getItem('lang') || 'it') === 'it',
    };
  },
};
</script>

<style scoped>
.voc-hub { max-width: 46rem; padding-top: var(--mdv-spazio-6); }
.voc-hub__citazione {
  font-family: var(--mdv-font-alternativo);
  font-style: italic;
  color: var(--mdv-oro-scuro);
  border-left: 3px solid var(--mdv-sabbia);
  padding-left: var(--mdv-spazio-4);
  margin-bottom: var(--mdv-spazio-6);
}
.voc-hub__invito {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
  margin-top: var(--mdv-spazio-6);
}
</style>
```

**Perché si riusa `src/view/Vocazione.vue` invece di reimplementarlo:** quel file gestisce già da solo spinner, `loadPage` e stato iniziale non popolato dello store. Riusarlo elimina ogni possibilità di regressione per le cinque lingue non italiane e impedisce che diventi codice morto. Resta nella lista di deroga dei token fino alla fase 3.

**`inItaliano` è in `data`, non in `computed`:** la lingua viene letta una volta alla creazione. Se l'utente la cambia mentre è nella sezione, non serve reattività qui — ci pensa il watcher di `VocazioneLayout` (Task 16) a riportarlo all'hub, che viene rimontato.

- [ ] **Step 2: Verificare visivamente**

Non ancora possibile: le rotte arrivano con la Task 16. Procedere.

- [ ] **Step 3: Commit**

```bash
git add src/view/vocazione/VocazioneHub.vue
git commit -m "feat(vocazione): hub della sezione"
```

---

### Task 18: VocazionePercorso

**Files:**
- Create: `src/view/vocazione/VocazionePercorso.vue`

**Interfaces:**
- Consumes: tutti i componenti blocco, `vocazione.json`
- Produces: il renderer; prop `chiave: String` (nome del percorso in `vocazione.json`)

- [ ] **Step 1: Creare la view**

```vue
<template>
  <section>
    <MdvHeader
      :image="percorso.header.immagine"
      :title="percorso.header.titolo"
      :caption="percorso.header.sottotitolo"
    />

    <div class="container voc-percorso">
      <component
        :is="componentePer(blocco.tipo)"
        v-for="(blocco, i) in blocchiValidi"
        :key="i"
        v-bind="propsPer(blocco)"
      />

      <!-- La proposta chiude ogni percorso: vive qui, non nel contenuto,
           per non averne quattro copie destinate a divergere. -->
      <aside class="voc-percorso__proposta">
        <h2 class="voc-percorso__proposta-titolo">Vuoi parlarne con qualcuno?</h2>
        <p class="voc-percorso__proposta-testo">
          Accompagniamo spiritualmente chi è in ricerca vocazionale e proponiamo ritiri.
        </p>
        <router-link :to="{ name: 'vocazione-proposta' }" class="voc-percorso__proposta-link">
          Scopri la nostra proposta
        </router-link>
      </aside>
    </div>
  </section>
</template>

<script>
import MdvHeader from '@/components/layout/MdvHeader';
import VocProsa from '@/components/vocazione/VocProsa';
import VocElenco from '@/components/vocazione/VocElenco';
import VocPassi from '@/components/vocazione/VocPassi';
import VocRiflessioni from '@/components/vocazione/VocRiflessioni';
import VocTestimonianze from '@/components/vocazione/VocTestimonianze';
import VocRimandi from '@/components/vocazione/VocRimandi';
import contenuto from '@/assets/data/vocazione.json';

const PER_TIPO = {
  prosa: 'VocProsa',
  elenco: 'VocElenco',
  segni: 'VocElenco',
  passi: 'VocPassi',
  riflessioni: 'VocRiflessioni',
  testimonianze: 'VocTestimonianze',
  rimandi: 'VocRimandi',
};

export default {
  name: 'VocazionePercorso',
  components: { MdvHeader, VocProsa, VocElenco, VocPassi, VocRiflessioni, VocTestimonianze, VocRimandi },
  props: {
    chiave: { type: String, required: true },
  },
  computed: {
    percorso() {
      return contenuto.percorsi[this.chiave];
    },
    blocchiValidi() {
      return this.percorso.blocchi.filter((b) => {
        if (PER_TIPO[b.tipo]) return true;
        console.warn(`[vocazione] blocco ignorato, tipo sconosciuto: "${b.tipo}"`);
        return false;
      });
    },
  },
  methods: {
    componentePer(tipo) {
      return PER_TIPO[tipo];
    },
    propsPer(blocco) {
      const { tipo, ...resto } = blocco;
      // "segni" e' un elenco con la spunta; i blocchi con stato hanno bisogno
      // di sapere in che percorso si trovano, per non mescolare le risposte.
      if (tipo === 'segni') return { ...resto, variante: 'segni' };
      if (tipo === 'passi' || tipo === 'riflessioni') return { ...resto, percorso: this.chiave };
      return resto;
    },
  },
};
</script>

<style scoped>
.voc-percorso { max-width: 46rem; padding-top: var(--mdv-spazio-6); }
.voc-percorso__proposta {
  margin: var(--mdv-spazio-6) 0;
  padding: var(--mdv-spazio-5);
  border-top: 1px solid var(--mdv-sabbia);
  text-align: center;
}
.voc-percorso__proposta-titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
}
.voc-percorso__proposta-testo {
  font-family: var(--mdv-font-corpo);
  margin-bottom: var(--mdv-spazio-4);
}
.voc-percorso__proposta-link {
  font-family: var(--mdv-font-navigazione);
  color: var(--mdv-oro-scuro);
  border-bottom: 1px solid var(--mdv-sabbia);
  text-decoration: none;
}
</style>
```

- [ ] **Step 2: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/view/vocazione/VocazionePercorso.vue
git commit -m "feat(vocazione): renderer dei percorsi"
```

---

### Task 19: VocazioneDomande e VocazioneProposta

**Files:**
- Create: `src/view/vocazione/VocazioneDomande.vue`
- Create: `src/view/vocazione/VocazioneProposta.vue`

- [ ] **Step 1: Creare VocazioneDomande**

```vue
<template>
  <section>
    <MdvHeader title="Le vostre domande" caption="Domande vere, risposte dei missionari" />
    <div class="container voc-domande">
      <p class="voc-domande__invito">
        Hai una domanda da fare o un pensiero da condividere?
        <router-link :to="{ name: 'contatti' }">Scrivici</router-link>: la tua domanda e la
        nostra risposta potranno essere pubblicate qui, nel rispetto della tua privacy.
      </p>
      <VocFaq :domande="contenuto.domande" />
    </div>
  </section>
</template>

<script>
import MdvHeader from '@/components/layout/MdvHeader';
import VocFaq from '@/components/vocazione/VocFaq';
import contenuto from '@/assets/data/vocazione.json';

export default {
  name: 'VocazioneDomande',
  components: { MdvHeader, VocFaq },
  data() {
    return { contenuto };
  },
};
</script>

<style scoped>
.voc-domande { max-width: 46rem; padding-top: var(--mdv-spazio-6); }
.voc-domande__invito {
  font-family: var(--mdv-font-corpo);
  color: var(--mdv-grigio-scuro);
  margin-bottom: var(--mdv-spazio-6);
}
</style>
```

- [ ] **Step 2: Creare VocazioneProposta**

```vue
<template>
  <section>
    <MdvHeader
      :title="contenuto.proposta.header.titolo"
      :caption="contenuto.proposta.header.sottotitolo"
    />
    <div class="container voc-proposta">
      <VocProsa
        v-for="(blocco, i) in contenuto.proposta.blocchi"
        :key="i"
        :titolo="blocco.titolo"
        :testo="blocco.testo"
      />
      <p class="voc-proposta__contatto">
        <router-link :to="{ name: 'contatti' }" class="voc-proposta__link">
          Scrivici per un primo contatto
        </router-link>
      </p>
    </div>
  </section>
</template>

<script>
import MdvHeader from '@/components/layout/MdvHeader';
import VocProsa from '@/components/vocazione/VocProsa';
import contenuto from '@/assets/data/vocazione.json';

export default {
  name: 'VocazioneProposta',
  components: { MdvHeader, VocProsa },
  data() {
    return { contenuto };
  },
};
</script>

<style scoped>
.voc-proposta { max-width: 46rem; padding-top: var(--mdv-spazio-6); }
.voc-proposta__contatto { text-align: center; margin: var(--mdv-spazio-6) 0; }
.voc-proposta__link {
  font-family: var(--mdv-font-navigazione);
  color: var(--mdv-oro-scuro);
  border-bottom: 1px solid var(--mdv-sabbia);
  text-decoration: none;
}
</style>
```

- [ ] **Step 3: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/view/vocazione/VocazioneDomande.vue src/view/vocazione/VocazioneProposta.vue
git commit -m "feat(vocazione): pagine domande e proposta"
```

---

### Task 20: Verifica d'insieme

Nessun test automatico copre il rendering: questa è la verifica manuale, e va fatta prima di considerare la sezione conclusa.

**Files:** nessuno, salvo correzioni emerse.

- [ ] **Step 1: Avviare l'applicazione**

```bash
npm run serve
```

- [ ] **Step 2: Percorrere la sezione in italiano**

Con `lang` impostato su `it`, dal menu "Vocazione":

| Verifica | Atteso |
|---|---|
| `/vocazione` | citazione, introduzione, 4 porte, chiusura |
| ogni porta | porta alla pagina giusta |
| `/vocazione/discernimento` | i 6 passi si aprono uno alla volta, il contatore avanza |
| ricaricare la pagina | i passi già aperti restano segnati |
| `/vocazione/matrimonio` | "Per riflettere" si apre, si scrive, si perde il fuoco, si ricarica: il testo è ancora lì |
| "Cancella le mie risposte" | i campi si svuotano e restano vuoti dopo il ricaricamento |
| `/vocazione/vita-consacrata` | le foto delle testimonianze si vedono, nessun errore di mixed content in console |
| fine di ogni percorso | il richiamo alla proposta porta a `/vocazione/proposta` |
| `/vocazione/domande` | una risposta alla volta; l'invito porta a `/contatti` |
| `/vocazione/inventata` | reindirizza a `/vocazione` |

- [ ] **Step 3: Verificare le altre lingue**

Passare a inglese dal menu.

| Verifica | Atteso |
|---|---|
| `/vocazione` | la pagina breve di prima, in inglese |
| `/vocazione/sacerdozio` da URL diretto | reindirizza a `/vocazione` |
| cambio lingua mentre si è su `/vocazione/sacerdozio` | riporta all'hub |

- [ ] **Step 4: Verificare in navigazione privata**

Aprire `/vocazione/matrimonio` in una finestra privata, scrivere in "Per riflettere", cambiare pagina e tornare.
Expected: nessun errore in console. La risposta può non sopravvivere al ricaricamento — è il degrado previsto.

- [ ] **Step 5: Verificare la compilazione di produzione**

```bash
npm run build
```
Expected: build senza errori né avvisi su asset mancanti.

- [ ] **Step 6: Eseguire tutti i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 7: Commit di eventuali correzioni**

```bash
git add -A
git commit -m "fix(vocazione): correzioni emerse dalla verifica d'insieme"
```

---

## Nota sull'ordine

La Task 16 modifica il router importando view che nascono nelle Task 17-19. Per non lasciare l'applicazione non compilabile fra un commit e l'altro, eseguire nell'ordine: **17, 18, 19, poi 16**, e infine 20. Le Task 1-15 seguono l'ordine dato.

## Lacune di contenuto note

- **Sr. Lucia:** il documento la elenca fra le testimonianze ma il testo non esiste in nessuna fonte disponibile. Si pubblica con le tre reperite; se la comunità fornisce il testo, si aggiunge una voce a `percorsi.vita-consacrata` senza toccare il codice.
- **`/materiale-scaricabile`:** il vecchio sito ha una pagina di materiale scaricabile che il documento non prevede. Prima di archiviare `mdv-vocational`, verificare se contiene file realmente usati: in tal caso è una funzione che si perde, non della prosa.
