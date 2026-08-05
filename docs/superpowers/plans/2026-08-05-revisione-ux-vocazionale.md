# Revisione UX della sezione vocazionale — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendere la sezione vocazionale navigabile e riconoscibile come luogo a sé — soglia d'ingresso, barra di sezione, movimento che informa — senza tradire la sobrietà della comunità.

**Architecture:** L'atmosfera è una ridefinizione dei token CSS applicata dal contenitore radice di `App.vue`, unico punto da cui la cascata raggiunge anche navbar e footer. La soglia si innesca sul montaggio di `VocazioneLayout`, che avviene una volta sola all'ingresso. La barra di sezione è un componente di sola presentazione alimentato dal layout, e l'elenco delle pagine vive in un file di dati condiviso fra runtime e test.

**Tech Stack:** Vue 3 (Options API), Vue Router 4, `@formkit/auto-animate` (già nel bundle), `IntersectionObserver`, `node:test`.

## Global Constraints

- **Nessun valore visivo scritto a mano** in un componente: colori, font, spaziature e ora anche `rgb()`/`rgba()`/`hsl()` vengono solo da `tokens.css`.
- **I componenti di presentazione non accedono a store né `$route`.** Solo props ed eventi. `router-link` è consentito: non è accesso allo stato della rotta.
- **Ogni accesso a `localStorage` passa da `vocStorage`.**
- **`prefers-reduced-motion` va rispettato** da velo, atmosfera e rivelazioni.
- **Focus da tastiera visibile** su tutti i controlli della barra; il pannello si chiude con `Esc`.
- **Il velo non si ripete** navigando fra le pagine interne della sezione.
- **Commenti, log e testi UI in italiano.** Commit `tipo(scope): descrizione`.
- **Nessun test sul rendering**: si testano solo logica pura, integrità del contenuto e la guardia.

## File Structure

| File | Responsabilità |
|---|---|
| `scripts/lib/style-guard.js` | modifica — riconosce anche `rgb()`/`rgba()`/`hsl()` |
| `src/assets/css/tokens.css` | modifica — token nuovi, `.voc-atmosfera`, riduci-movimento, classi di rivelazione |
| `src/components/layout/MdvNavbar.vue` | modifica — `rgb()` ai token, altezza come token |
| `src/components/layout/MdvFooter.vue` | modifica — `rgb()` ai token |
| `src/components/ui/BaseDashboard.vue` | modifica — `rgba()` ai token |
| `src/components/ui/BaseToast.vue` | modifica — ombra ai token |
| `src/components/ui/ImageDialog.vue` | modifica — velo e ombra ai token |
| `src/view/Vocazione.vue` | modifica — migrazione completa ai token |
| `src/utility/inVocazione.mjs` | crea — funzione pura: la rotta è dentro la sezione? |
| `src/utility/inVocazione.test.mjs` | crea — test della funzione |
| `src/utility/direttivaRivela.mjs` | crea — direttiva `v-rivela` |
| `src/App.vue` | modifica — classe atmosfera e nome transizione |
| `src/main.js` | modifica — registra `v-rivela` |
| `src/assets/data/indice-vocazione.json` | crea — le 6 pagine non-hub, fonte unica |
| `src/components/vocazione/VocSoglia.vue` | crea — il velo d'ingresso |
| `src/components/vocazione/VocBarraSezione.vue` | crea — ritorno e indice |
| `src/view/vocazione/VocazioneLayout.vue` | modifica — monta soglia e barra, toglie il link in fondo |
| `src/view/vocazione/VocazionePercorso.vue` | modifica — applica `v-rivela` ai blocchi |
| `src/components/vocazione/VocFaq.vue` | modifica — `v-if` + `v-auto-animate` |
| `src/components/vocazione/VocPassi.vue` | modifica — `v-if` + `v-auto-animate` |
| `src/components/vocazione/VocRiflessioni.vue` | modifica — `v-if` + `v-auto-animate` |
| `scripts/lib/valida-vocazione.test.js` | modifica — legge le rotte dall'indice |

---

### Task 1: Estendere la guardia a rgb, rgba e hsl

La regola 1 promette «nessun valore visivo scritto a mano» ma ne verificava circa metà. Si chiude la lacuna e si sistema ciò che emerge.

**Files:**
- Modify: `scripts/lib/style-guard.js`
- Modify: `scripts/lib/style-guard.test.js`
- Modify: `src/assets/css/tokens.css`
- Modify: `src/components/layout/MdvNavbar.vue`, `MdvFooter.vue`
- Modify: `src/components/ui/BaseDashboard.vue`, `BaseToast.vue`, `ImageDialog.vue`

**Interfaces:**
- Produces: `estraiValoriVisivi(contenuto: string) => string[]` — ora include le notazioni funzionali di colore.

- [ ] **Step 1: Aggiungere il test dell'estrattore**

In `scripts/lib/style-guard.test.js`, dopo il test `estraiValoriVisivi ignora il template`:

```js
test('estraiValoriVisivi trova anche rgb, rgba e hsl', () => {
  const sfc = '<template><div/></template>'
    + '<style>.a{background:rgb(40, 29, 2, 0.9);color:rgba(0,0,0,.2);border-color:hsl(30 40% 50%);}</style>';
  assert.deepStrictEqual(
    estraiValoriVisivi(sfc),
    ['rgb(40, 29, 2, 0.9)', 'rgba(0,0,0,.2)', 'hsl(30 40% 50%)'],
  );
});
```

- [ ] **Step 2: Eseguire e verificare che fallisca**

Run: `node --test scripts/lib/style-guard.test.js`
Expected: FAIL — l'estrattore ritorna `[]` per quei valori.

- [ ] **Step 3: Estendere l'estrattore**

In `scripts/lib/style-guard.js`, aggiungere la costante e includerla nel risultato:

```js
const RE_COLORE_FUNZIONE = /\b(?:rgba?|hsla?)\([^)]*\)/g;

function estraiValoriVisivi(contenuto) {
  const blocchi = (contenuto.match(RE_BLOCCHI) || []).join('\n');
  return [
    ...(blocchi.match(RE_COLORE) || []),
    ...(blocchi.match(RE_COLORE_FUNZIONE) || []),
    ...(blocchi.match(RE_FONT) || []),
  ];
}
```

- [ ] **Step 4: Eseguire i test**

Run: `npm test`
Expected: il test dell'estrattore passa; **fallisce** il test sui file, che elenca 8 occorrenze in 5 file, fra cui `ImageDialog.vue` che non è in deroga.

- [ ] **Step 5: Aggiungere i token mancanti**

In `src/assets/css/tokens.css`, dentro `:root`, dopo il blocco `/* Stati */`:

```css
  /* Veli e ombre — il nero non e' un colore di marca: token propri */
  --mdv-bianco-velato: rgba(248, 248, 248, 0.9);
  --mdv-velo-scuro: rgba(0, 0, 0, 0.75);
  --mdv-ombra-media: rgba(0, 0, 0, 0.26);
  --mdv-ombra-lieve: rgba(0, 0, 0, 0.2);

  /* Misure condivise */
  --mdv-altezza-navbar: 6.5rem;
```

- [ ] **Step 6: Sostituire le 8 occorrenze**

| File | Riga | Da | A |
|---|---|---|---|
| `MdvNavbar.vue` | 114, 149, 189 | `rgb(40, 29, 2, 0.9)` | `var(--mdv-bruno-900-velato)` |
| `MdvFooter.vue` | 108 | `rgb(40, 29, 2, 0.9)` | `var(--mdv-bruno-900-velato)` |
| `BaseDashboard.vue` | 21 | `rgba(248, 248, 248, 0.9)` | `var(--mdv-bianco-velato)` |
| `ImageDialog.vue` | 53 | `rgba(0, 0, 0, 0.75)` | `var(--mdv-velo-scuro)` |
| `ImageDialog.vue` | 64 | `rgba(0, 0, 0, 0.26)` | `var(--mdv-ombra-media)` |
| `BaseToast.vue` | 36 | `rgba(0,0,0,0.2)` | `var(--mdv-ombra-lieve)` |

`--mdv-bruno-900-velato` vale `#281d02e5`, che è `rgba(40, 29, 2, 0.898)`: differenza di alfa dello 0,2%, non percepibile.

- [ ] **Step 7: In `MdvNavbar.vue`, sostituire l'altezza con il token**

Alla riga `height: 6.5rem;` dentro `.navbar`, sostituire con `height: var(--mdv-altezza-navbar);`.

- [ ] **Step 8: Eseguire i test**

Run: `npm test`
Expected: PASS. `ImageDialog.vue` non va aggiunto alle deroghe: è stato migrato.

- [ ] **Step 9: Verificare visivamente**

Run: `npm run serve`
Controllare: navbar scurita dopo 50px di scroll, footer, toast (form contatti con campo vuoto), ImageDialog (aprire un'immagine nelle attività).

- [ ] **Step 10: Commit**

```bash
git add scripts/lib/style-guard.js scripts/lib/style-guard.test.js src/assets/css/tokens.css src/components
git commit -m "test(stile): la guardia copre anche rgb, rgba e hsl

Verificava circa meta' dei valori visivi: una garanzia parziale
spacciata per totale, su cui la fase 3 si sarebbe appoggiata.
Sistemate le 8 occorrenze emerse."
```

---

### Task 2: Migrare `src/view/Vocazione.vue` ai token

È la pagina che le lingue non italiane vedono su `/vocazione`: sta dentro la sezione e riceverà l'atmosfera, ma con i colori scritti a mano risponderebbe solo in parte.

**Files:**
- Modify: `src/view/Vocazione.vue`
- Modify: `scripts/lib/style-guard-deroghe.json`
- Modify: `scripts/lib/style-guard.test.js`

- [ ] **Step 1: Togliere il file dalla deroga**

Rimuovere `"src/view/Vocazione.vue"` da `scripts/lib/style-guard-deroghe.json` e abbassare `MASSIMO_DEROGHE` di 1.

- [ ] **Step 2: Eseguire e verificare che fallisca**

Run: `npm test`
Expected: FAIL con l'elenco dei valori di `Vocazione.vue`.

- [ ] **Step 3: Sostituire i valori**

Nel blocco `<style scoped>`:

| Da | A |
|---|---|
| `font-family: 'Playfair Display', sans-serif` (in `.main-title`) | `font-family: var(--mdv-font-corpo)` |
| `font-family: 'Playfair Display', serif` (in `.caption`) | `font-family: var(--mdv-font-corpo)` |
| `font-family: 'Old Standard TT', sans-serif` (in `p`) | `font-family: var(--mdv-font-alternativo)` |
| `#8c681c` | `var(--mdv-oro)` |
| `#59411a` | `var(--mdv-oro-scuro)` |

- [ ] **Step 4: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Verificare visivamente**

`npm run serve`, poi in console `localStorage.setItem('lang','en')` e ricaricare su `/#/vocazione`: la pagina breve deve risultare identica a prima.

- [ ] **Step 6: Commit**

```bash
git add src/view/Vocazione.vue scripts/lib/style-guard-deroghe.json scripts/lib/style-guard.test.js
git commit -m "refactor(stile): Vocazione.vue usa i token

Sta dentro la sezione e ricevera' l'atmosfera: coi colori scritti a
mano risponderebbe solo in parte."
```

---

### Task 3: La funzione `inVocazione`

**Files:**
- Create: `src/utility/inVocazione.mjs`
- Create: `src/utility/inVocazione.test.mjs`

**Interfaces:**
- Produces: `inVocazione(percorso: string) => boolean`

- [ ] **Step 1: Scrivere il test**

```js
// src/utility/inVocazione.test.mjs
import test from 'node:test';
import assert from 'node:assert';
import { inVocazione } from './inVocazione.mjs';

test('l\'hub e le sue sotto-pagine sono dentro la sezione', () => {
  assert.strictEqual(inVocazione('/vocazione'), true);
  assert.strictEqual(inVocazione('/vocazione/'), true);
  assert.strictEqual(inVocazione('/vocazione/sacerdozio'), true);
  assert.strictEqual(inVocazione('/vocazione/domande'), true);
});

test('le altre pagine sono fuori', () => {
  assert.strictEqual(inVocazione('/'), false);
  assert.strictEqual(inVocazione('/attivita'), false);
  assert.strictEqual(inVocazione('/contatti'), false);
});

test('un percorso che inizia allo stesso modo non e\' dentro la sezione', () => {
  assert.strictEqual(inVocazione('/vocazionale'), false);
  assert.strictEqual(inVocazione('/vocazioni-famose'), false);
});

test('valori assenti non fanno esplodere nulla', () => {
  assert.strictEqual(inVocazione(undefined), false);
  assert.strictEqual(inVocazione(null), false);
  assert.strictEqual(inVocazione(''), false);
});
```

- [ ] **Step 2: Eseguire e verificare che fallisca**

Run: `node --test src/utility/inVocazione.test.mjs`
Expected: FAIL — modulo inesistente.

- [ ] **Step 3: Implementare**

```js
// src/utility/inVocazione.mjs
// Decide se una rotta appartiene alla sezione vocazionale. Serve sia per
// l'atmosfera cromatica sia per scegliere la transizione fra le pagine.
const RADICE = '/vocazione';

export function inVocazione(percorso) {
  if (typeof percorso !== 'string' || percorso.length === 0) return false;
  return percorso === RADICE || percorso.startsWith(`${RADICE}/`);
}
```

- [ ] **Step 4: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utility/inVocazione.mjs src/utility/inVocazione.test.mjs
git commit -m "feat(vocazione): funzione pura per riconoscere le rotte della sezione"
```

---

### Task 4: L'atmosfera

**Files:**
- Modify: `src/assets/css/tokens.css`
- Modify: `src/App.vue`

**Interfaces:**
- Consumes: `inVocazione(percorso)` dalla Task 3.

- [ ] **Step 1: Aggiungere atmosfera, riduci-movimento e classi di rivelazione**

In fondo a `src/assets/css/tokens.css`, dopo la chiusura di `:root`:

```css
/* Atmosfera della sezione vocazionale: ridefinisce i token invece di
   introdurre regole nuove, cosi' ogni componente cambia senza saperlo. */
.voc-atmosfera {
  --mdv-bianco: #faf6ee;
  --mdv-bruno-900: #1d1508;
  --mdv-crema: #f0e7d6;
  --mdv-sabbia: #b89f6d;

  background-color: var(--mdv-bianco);
  transition: background-color 700ms ease, color 700ms ease;
}

/* Rivelazione allo scroll: la direttiva v-rivela aggiunge le classi. */
.da-rivelare {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 500ms ease, transform 500ms ease;
}
.rivelato {
  opacity: 1;
  transform: none;
}

/* Transizione fra le pagine della sezione. */
.dissolvenza-enter-active,
.dissolvenza-leave-active {
  transition: opacity 300ms ease;
}
.dissolvenza-enter-from,
.dissolvenza-leave-to {
  opacity: 0;
}

/* Chi ha attivato "riduci movimento" spesso lo ha fatto per disturbi
   vestibolari: velo e dissolvenze sono precisamente cio' che li scatena. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .da-rivelare {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 2: Collegare `App.vue`**

Sostituire il template e lo script di `src/App.vue` nelle parti indicate.

Template — riga 2 e righe 4-8:

```vue
  <div :class="{ 'standalone-page': $route.meta.standalone, 'voc-atmosfera': inSezione }">
    <MdvNavbar v-show="!$route.meta.reservedArea && !$route.meta.standalone"/>
    <router-view v-slot="{ Component }">
      <transition :name="inSezione ? 'dissolvenza' : 'scale'" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view >
    <MdvFooter v-show="!$route.meta.reservedArea && !$route.meta.standalone" />
  </div>
```

Script — aggiungere l'import in cima e la proprietà calcolata:

```js
import { inVocazione } from '@/utility/inVocazione.mjs';
```

e dentro `export default`, dopo `components`:

```js
  computed: {
    inSezione() {
      return inVocazione(this.$route.path);
    },
  },
```

- [ ] **Step 3: Eseguire i test**

Run: `npm test`
Expected: PASS. `App.vue` resta in deroga: contiene ancora valori propri, che appartengono alla fase 3.

- [ ] **Step 4: Verificare visivamente**

`npm run serve`. Passare dalla home a `/#/vocazione`: fondo, navbar e footer devono scaldarsi gradualmente. Tornare alla home: devono raffreddarsi.
Attivare «riduci movimento» nelle impostazioni di sistema e ripetere: il cambio deve essere istantaneo, senza sfumatura.

- [ ] **Step 5: Commit**

```bash
git add src/assets/css/tokens.css src/App.vue
git commit -m "feat(vocazione): atmosfera cromatica della sezione

La classe sta sul contenitore radice di App.vue perche' navbar e footer
sono fratelli del router-view: da li' la cascata raggiunge tutto."
```

---

### Task 5: La soglia

**Files:**
- Create: `src/components/vocazione/VocSoglia.vue`
- Modify: `src/view/vocazione/VocazioneLayout.vue`

**Interfaces:**
- Produces: `VocSoglia` — nessuna prop; si anima al montaggio e si toglie da sola.

- [ ] **Step 1: Creare il componente**

```vue
<template>
  <div v-if="visibile" class="voc-soglia" aria-hidden="true"></div>
</template>

<script>
export default {
  name: 'VocSoglia',
  data() {
    return { visibile: true };
  },
  mounted() {
    // Il velo esiste solo per la durata del passaggio: dopo si smonta,
    // cosi' non resta un elemento a tutto schermo sopra la pagina.
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => { this.visibile = false; }, ridotto ? 0 : 900);
  },
};
</script>

<style scoped>
.voc-soglia {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background-color: var(--mdv-bruno-900);
  pointer-events: none;
  animation: voc-velo 900ms ease forwards;
}

@keyframes voc-velo {
  0%   { opacity: 0; }
  35%  { opacity: 1; }
  100% { opacity: 0; }
}
</style>
```

- [ ] **Step 2: Montarla nel layout**

In `src/view/vocazione/VocazioneLayout.vue`, aggiungere `<VocSoglia />` come primo elemento del template e registrarne l'import:

```vue
<template>
  <div class="voc-layout">
    <VocSoglia />
    <router-view />
  </div>
</template>
```

```js
import VocSoglia from '@/components/vocazione/VocSoglia';
// e dentro export default: components: { VocSoglia },
```

Il layout si monta una volta sola entrando nella sezione e resta montato navigando fra le pagine: il velo scatta all'ingresso e non si ripete.

- [ ] **Step 3: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 4: Verificare visivamente**

Entrare nella sezione dalla home: il velo attraversa una volta. Navigare fra tre pagine della sezione: **non** deve ripetersi. Uscire e rientrare: riparte.
Con «riduci movimento» attivo: nessun velo percepibile.

- [ ] **Step 5: Commit**

```bash
git add src/components/vocazione/VocSoglia.vue src/view/vocazione/VocazioneLayout.vue
git commit -m "feat(vocazione): velo di soglia all'ingresso della sezione"
```

---

### Task 6: L'indice come fonte unica

**Files:**
- Create: `src/assets/data/indice-vocazione.json`
- Modify: `scripts/lib/valida-vocazione.test.js`

**Interfaces:**
- Produces: `indice-vocazione.json` — array di `{ nome, etichetta, gruppo }`, sei voci.

- [ ] **Step 1: Far leggere al test l'indice invece della lista copiata**

In `scripts/lib/valida-vocazione.test.js`, sostituire la costante `ROTTE_NOTE`:

```js
const FILE_INDICE = 'src/assets/data/indice-vocazione.json';
const indice = JSON.parse(fs.readFileSync(FILE_INDICE, 'utf8'));
// L'hub non e' nell'indice: e' raggiunto dalla freccia della barra.
const ROTTE_NOTE = ['vocazione', ...indice.map((v) => v.nome)];
```

e aggiungere in fondo al file:

```js
test('l\'indice elenca le sei pagine non-hub', () => {
  assert.strictEqual(indice.length, 6);
  assert.deepStrictEqual(
    indice.map((v) => v.nome).sort(),
    [
      'vocazione-discernimento', 'vocazione-domande', 'vocazione-matrimonio',
      'vocazione-proposta', 'vocazione-sacerdozio', 'vocazione-vita-consacrata',
    ],
  );
});

test('ogni voce dell\'indice ha etichetta e gruppo', () => {
  for (const voce of indice) {
    assert.ok(voce.etichetta, `manca etichetta per ${voce.nome}`);
    assert.ok(['percorsi', 'altro'].includes(voce.gruppo), `gruppo non valido per ${voce.nome}`);
  }
});
```

- [ ] **Step 2: Eseguire e verificare che fallisca**

Run: `npm test`
Expected: FAIL — `ENOENT` su `indice-vocazione.json`.

- [ ] **Step 3: Creare l'indice**

```json
[
  { "nome": "vocazione-discernimento",   "etichetta": "Sto cercando la mia strada", "gruppo": "percorsi" },
  { "nome": "vocazione-matrimonio",      "etichetta": "Matrimonio",                 "gruppo": "percorsi" },
  { "nome": "vocazione-sacerdozio",      "etichetta": "Sacerdozio",                 "gruppo": "percorsi" },
  { "nome": "vocazione-vita-consacrata", "etichetta": "Vita consacrata",            "gruppo": "percorsi" },
  { "nome": "vocazione-domande",         "etichetta": "Le vostre domande",          "gruppo": "altro" },
  { "nome": "vocazione-proposta",        "etichetta": "La nostra proposta",         "gruppo": "altro" }
]
```

- [ ] **Step 4: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/assets/data/indice-vocazione.json scripts/lib/valida-vocazione.test.js
git commit -m "feat(vocazione): indice della sezione come fonte unica

Letto sia dal layout sia dai test: la lista di rotte non e' piu'
copiata dentro il test del contenuto."
```

---

### Task 7: La barra di sezione

**Files:**
- Create: `src/components/vocazione/VocBarraSezione.vue`
- Modify: `src/view/vocazione/VocazioneLayout.vue`

**Interfaces:**
- Consumes: `indice-vocazione.json` dalla Task 6.
- Produces: `VocBarraSezione` — props `pagine: Array<{nome, etichetta, gruppo}>`, `rottaCorrente: String`.

- [ ] **Step 1: Creare la barra**

```vue
<template>
  <div class="voc-barra">
    <div class="container voc-barra__contenuto">
      <router-link :to="{ name: 'vocazione' }" class="voc-barra__ritorno">
        <span aria-hidden="true">←</span> Vocazione
      </router-link>

      <span class="voc-barra__separatore" aria-hidden="true">›</span>

      <button
        type="button"
        class="voc-barra__corrente"
        :aria-expanded="apertoIndice ? 'true' : 'false'"
        @click="apertoIndice = !apertoIndice"
      >
        {{ etichettaCorrente }}
        <span class="voc-barra__freccia" aria-hidden="true">⌄</span>
      </button>
    </div>

    <div v-if="apertoIndice" class="voc-barra__pannello">
      <ul class="container voc-barra__lista">
        <li v-for="(voce, i) in pagine" :key="voce.nome">
          <hr v-if="i > 0 && voce.gruppo !== pagine[i - 1].gruppo" class="voc-barra__divisione" />
          <router-link
            :to="{ name: voce.nome }"
            :class="['voc-barra__voce', { 'voc-barra__voce--attiva': voce.nome === rottaCorrente }]"
          >
            {{ voce.etichetta }}
            <span v-if="voce.nome === rottaCorrente" class="voc-barra__qui">sei qui</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VocBarraSezione',
  props: {
    pagine: { type: Array, required: true },
    rottaCorrente: { type: String, default: '' },
  },
  data() {
    return { apertoIndice: false };
  },
  computed: {
    etichettaCorrente() {
      const voce = this.pagine.find((v) => v.nome === this.rottaCorrente);
      return voce ? voce.etichetta : '';
    },
  },
  watch: {
    // Cambiata pagina, il pannello non ha piu' ragione di restare aperto.
    rottaCorrente() {
      this.apertoIndice = false;
    },
  },
  mounted() {
    window.addEventListener('keydown', this.chiudiConEsc);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.chiudiConEsc);
  },
  methods: {
    chiudiConEsc(evento) {
      if (evento.key === 'Escape') this.apertoIndice = false;
    },
  },
};
</script>

<style scoped>
.voc-barra {
  position: sticky;
  top: var(--mdv-altezza-navbar);
  z-index: 1000;
  background-color: var(--mdv-bianco);
  border-bottom: 1px solid var(--mdv-sabbia);
}
.voc-barra__contenuto {
  display: flex;
  align-items: center;
  gap: var(--mdv-spazio-2);
  padding-top: var(--mdv-spazio-2);
  padding-bottom: var(--mdv-spazio-2);
  font-family: var(--mdv-font-navigazione);
  font-size: 0.95rem;
}
.voc-barra__ritorno {
  color: var(--mdv-oro-scuro);
  text-decoration: none;
  white-space: nowrap;
}
.voc-barra__separatore {
  color: var(--mdv-sabbia);
}
.voc-barra__corrente {
  background: none;
  border: none;
  padding: var(--mdv-spazio-1) var(--mdv-spazio-2);
  font-family: inherit;
  font-size: inherit;
  color: var(--mdv-bruno-900);
  cursor: pointer;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.voc-barra__freccia {
  color: var(--mdv-oro);
}
.voc-barra__pannello {
  background-color: var(--mdv-bianco);
  border-top: 1px solid var(--mdv-sabbia);
  box-shadow: 0 4px 12px var(--mdv-ombra-lieve);
}
.voc-barra__lista {
  list-style: none;
  padding-top: var(--mdv-spazio-2);
  padding-bottom: var(--mdv-spazio-2);
  margin: 0;
}
.voc-barra__voce {
  display: flex;
  justify-content: space-between;
  padding: var(--mdv-spazio-3) 0;
  font-family: var(--mdv-font-corpo);
  color: var(--mdv-bruno-900);
  text-decoration: none;
}
.voc-barra__voce:hover {
  color: var(--mdv-oro);
}
.voc-barra__voce--attiva {
  color: var(--mdv-oro);
}
.voc-barra__qui {
  font-family: var(--mdv-font-navigazione);
  font-size: 0.8rem;
  color: var(--mdv-grigio);
}
.voc-barra__divisione {
  border: none;
  border-top: 1px solid var(--mdv-sabbia);
  margin: var(--mdv-spazio-2) 0;
  opacity: 0.6;
}
.voc-barra__ritorno:focus-visible,
.voc-barra__corrente:focus-visible,
.voc-barra__voce:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: 2px;
}
</style>
```

- [ ] **Step 2: Riscrivere il layout**

`src/view/vocazione/VocazioneLayout.vue` diventa:

```vue
<template>
  <div class="voc-layout">
    <VocSoglia />
    <VocBarraSezione v-if="!inHub" :pagine="pagine" :rotta-corrente="$route.name" />
    <router-view />
  </div>
</template>

<script>
import VocSoglia from '@/components/vocazione/VocSoglia';
import VocBarraSezione from '@/components/vocazione/VocBarraSezione';
import indice from '@/assets/data/indice-vocazione.json';

export default {
  name: 'VocazioneLayout',
  components: { VocSoglia, VocBarraSezione },
  data() {
    return { pagine: indice };
  },
  computed: {
    // Sull'hub la barra non serve: il ritorno non ha destinazione e le
    // quattro porte sono gia' in pagina. L'hub e' l'indice.
    inHub() {
      return this.$route.name === 'vocazione';
    },
  },
  watch: {
    // Cambiando lingua dentro la sezione, le sotto-pagine non esistono in
    // quella lingua: si torna all'hub invece di restare su una pagina orfana.
    $route(rotta) {
      const lingua = localStorage.getItem('lang') || 'it';
      if (rotta.name !== 'vocazione' && lingua !== 'it') {
        this.$router.replace({ name: 'vocazione' });
      }
    },
  },
};
</script>
```

Il link «Torna all'inizio del cammino» e il blocco `<style>` che lo accompagnava spariscono: con la freccia sempre presente è ridondante, e ridondante in fondo a una pagina lunga è il difetto da correggere.

- [ ] **Step 3: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 4: Verificare visivamente**

Aprire `/#/vocazione/sacerdozio`: la barra sta sotto la navbar e resta visibile scorrendo. La freccia torna all'hub. Il nome apre l'indice con «sei qui» sulla voce attiva e una riga fra i percorsi e le due pagine di servizio. Scegliere un'altra voce: il pannello si chiude.
Sull'hub la barra non c'è.
Con Tab si raggiungono freccia, apertura e voci, con contorno visibile. `Esc` chiude il pannello.

- [ ] **Step 5: Commit**

```bash
git add src/components/vocazione/VocBarraSezione.vue src/view/vocazione/VocazioneLayout.vue
git commit -m "feat(vocazione): barra di sezione con ritorno e indice

Sostituisce il link in fondo alla pagina: dopo 3.000 caratteri l'uscita
era raggiungibile solo risalendo tutto."
```

---

### Task 8: Il movimento

**Files:**
- Create: `src/utility/direttivaRivela.mjs`
- Modify: `src/main.js`
- Modify: `src/components/vocazione/VocFaq.vue`, `VocPassi.vue`, `VocRiflessioni.vue`
- Modify: `src/view/vocazione/VocazionePercorso.vue`

**Interfaces:**
- Produces: direttiva `v-rivela`, registrata globalmente.

- [ ] **Step 1: Creare la direttiva**

```js
// src/utility/direttivaRivela.mjs
// Rivela un elemento quando entra in vista, una volta sola: se il
// movimento si ripetesse a ogni scorrimento, rileggere una pagina
// diventerebbe faticoso.
export const direttivaRivela = {
  mounted(el) {
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (ridotto || typeof IntersectionObserver === 'undefined') {
      el.classList.add('rivelato');
      return;
    }

    el.classList.add('da-rivelare');
    const osservatore = new IntersectionObserver((voci) => {
      voci.forEach((voce) => {
        if (!voce.isIntersecting) return;
        voce.target.classList.add('rivelato');
        osservatore.disconnect();
      });
    }, { threshold: 0.1 });
    osservatore.observe(el);
  },
};
```

- [ ] **Step 2: Registrarla in `main.js`**

Dopo `app.use(Markdown);`:

```js
import { direttivaRivela } from './utility/direttivaRivela.mjs';
// …
app.directive('rivela', direttivaRivela);
```

- [ ] **Step 3: Applicarla ai blocchi**

In `src/view/vocazione/VocazionePercorso.vue`, aggiungere `v-rivela` al componente dinamico:

```vue
      <component
        :is="componentePer(blocco.tipo)"
        v-for="(blocco, i) in blocchiValidi"
        :key="i"
        v-rivela
        v-bind="propsPer(blocco)"
      />
```

- [ ] **Step 4: Passare le fisarmoniche ad auto-animate**

`auto-animate` reagisce a elementi aggiunti e rimossi, non a `display: none`: i corpi delle fisarmoniche devono passare da `v-show` a `v-if`.

In `VocFaq.vue`: mettere `v-auto-animate` su `<article class="voc-faq__voce">` e cambiare `v-show="aperta === i"` in `v-if="aperta === i"` su `.voc-faq__risposta`.

In `VocPassi.vue`: mettere `v-auto-animate` su `<li class="voc-passi__passo">` e cambiare `v-show` in `v-if` su `.voc-passi__testo`.

In `VocRiflessioni.vue`: mettere `v-auto-animate` su `<div class="voc-riflessioni__voce">` e cambiare `v-show` in `v-if` su `.voc-riflessioni__risposta`. Le risposte non si perdono: il testo vive in `risposte`, non nel campo.

- [ ] **Step 5: Eseguire i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 6: Verificare visivamente**

Le fisarmoniche si aprono fluide. Scorrendo un percorso i blocchi compaiono con una leggera salita, una volta sola: risalendo non si ripetono. Aprire una riflessione, scrivere, chiudere e riaprire: il testo è ancora lì.
Con «riduci movimento» attivo tutto compare già visibile, senza animazioni.

- [ ] **Step 7: Commit**

```bash
git add src/utility/direttivaRivela.mjs src/main.js src/components/vocazione src/view/vocazione/VocazionePercorso.vue
git commit -m "feat(vocazione): movimento che informa

auto-animate era gia' nel bundle e mai usato. Le fisarmoniche passano da
v-show a v-if perche' auto-animate reagisce agli elementi aggiunti e
rimossi, non a display:none."
```

---

### Task 9: Verifica d'insieme

Nessun test copre il rendering: questa è la verifica manuale, da fare prima di considerare la revisione conclusa.

- [ ] **Step 1: Avviare l'applicazione**

```bash
npm run serve
```

- [ ] **Step 2: Percorrere la revisione**

| Verifica | Atteso |
|---|---|
| Home → `/vocazione` | velo che attraversa, fondo e navbar che si scaldano |
| Navigare fra tre pagine della sezione | il velo **non** si ripete; dissolvenza fra le pagine |
| Uscire verso `/attivita` | l'atmosfera si raffredda |
| Barra su una sotto-pagina | resta sotto la navbar scorrendo |
| Freccia della barra | torna all'hub |
| Indice | «sei qui» sulla voce attiva, riga fra percorsi e servizio |
| Hub | la barra non compare |
| Fisarmoniche | apertura fluida |
| Scorrere un percorso | i blocchi salgono una volta sola |
| Risalire | non si ripetono |

- [ ] **Step 3: Verificare con riduci-movimento attivo**

Attivare la preferenza a livello di sistema e ripetere: nessun velo, nessuna dissolvenza, nessuna salita. Il contenuto resta pienamente utilizzabile.

- [ ] **Step 4: Verificare da tastiera**

Con Tab raggiungere freccia, apertura dell'indice e voci: contorno oro visibile su ciascuno. `Esc` chiude il pannello.

- [ ] **Step 5: Verificare le altre lingue**

`localStorage.setItem('lang','en')`, ricaricare `/#/vocazione`: la pagina breve, ora ai token, riceve l'atmosfera in modo coerente. Da URL diretto `/#/vocazione/sacerdozio` si torna all'hub.

- [ ] **Step 6: Contrasto sui testi lunghi**

Aprire due o tre risposte in `/#/vocazione/domande` e leggerle per intero. Se il fondo caldo rende il testo faticoso, scurire `--mdv-bruno-900` dentro `.voc-atmosfera`. È l'unico parametro da toccare.

- [ ] **Step 7: Build di produzione**

```bash
npm run build
```
Expected: nessun errore.

- [ ] **Step 8: Tutti i test**

Run: `npm test`
Expected: PASS

- [ ] **Step 9: Commit di eventuali correzioni**

```bash
git add -A
git commit -m "fix(vocazione): correzioni emerse dalla verifica d'insieme"
```

---

## Ordine

Le task vanno eseguite nell'ordine dato. La 5 e la 7 modificano entrambe `VocazioneLayout.vue`: la 7 ne riscrive il file completo, quindi va dopo. La 8 dipende dalle classi di rivelazione introdotte dalla 4.

## Fuori dal piano, segnalato

`animate.css` è importato in `main.js` e non usato da nessun componente: pesa nel bundle senza effetto. Rimuoverlo tocca l'intero sito e non questa sezione, quindi resta per la fase 3.
