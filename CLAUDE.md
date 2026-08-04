# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandi

```bash
npm install
npm run serve      # dev server su http://localhost:9191/mdv-webapp/
npm run build      # build di produzione (publicPath '/')
npm run stage      # build --mode development (è quella usata dal deploy!)
npm run lint       # eslint via vue-cli-service
npm run deploy     # push del build sul branch gh-pages (scripts/gh-pages-deploy.js)
```

Test (node test runner, nessun framework installato — solo la lib di trasformazione ha test):

```bash
node --test scripts/lib/transform-locations.test.js
```

Nota: `node --test scripts/lib/` fallisce (prova a eseguire la directory) — passare il file.

Altri script:

```bash
node check-build-env.js        # verifica che le VUE_APP_* siano finite in dist/js/app.*.js
npm run migrate:attivita       # one-shot data.json -> Supabase, già eseguito (vedi sotto)
```

## Configurazione

Copiare `.env.example` in `.env`. Le variabili realmente lette dal codice sono solo:

- `VUE_APP_SUPABASE_URL`, `VUE_APP_SUPABASE_ANON_KEY` → `src/services/locationsApi.js`
- `VUE_APP_API_BLOG_BASE_URL`, `VUE_APP_BLOG_API_KEY` → `src/store/modules/blog/actions.js`

`.env.example` elenca ancora variabili Firebase e Aruba (`VUE_APP_FIREBASE_*`, `VUE_APP_API_BASE_URL`, `VUE_APP_AUTH_BASE_URL`): sono **residui** della migrazione, nessun codice le usa più. In CI il `.env` viene generato dai GitHub Secrets (`.github/workflows/cicd.yml`).

## Architettura

Vue 3 (Options API, nessun `<script setup>`) + Vuex 4 + vue-router in **hash history** (`createWebHashHistory`) perché il sito è servito da gh-pages/hosting statico senza rewrite lato server. Alias `@` → `src/`.

### Il punto centrale: contenuto ibrido statico/dinamico

Questa è la cosa da capire prima di toccare qualsiasi pagina. Dopo la migrazione a Supabase (giugno 2026, vedi `docs/superpowers/`), il contenuto arriva da **due sorgenti** e la fusione avviene in un solo posto: `src/store/modules/page/actions.js` → `loadPage`.

- **Statico** (`src/assets/data/data.json`, `navbar.json`, `footer.json`): testi istituzionali che cambiano di rado — chi-siamo, vocazione, approfondimenti, prega-con-noi, header/form delle altre pagine.
- **Dinamico** (Supabase Edge Function `locations` via `src/services/locationsApi.js`): le location e le loro info, amministrate dalla dashboard React esterna. La webapp è un **consumatore in sola lettura**, non scrive mai su Supabase.

Due pagine sono ibride e hanno un ramo dedicato in `loadPage`:

- `attivita` → header/main dal JSON statico, `groups` sostituiti da Supabase.
- `contatti` → header/form dal JSON statico, `places` costruiti da Supabase con `buildPlaces()` (le label tradotte stanno in `CONTACT_LABELS`, non nel JSON).

Tutte le altre pagine leggono solo `data[lang][page]`.

### Store

`page` e `blog`, entrambi namespaced. Ogni view deve fare `dispatch('page/loadPage', '<nome-pagina>')` nel proprio `created()`: lo state iniziale in `src/store/modules/page/index.js` legge `data["chi-siamo"]` sul livello sbagliato del JSON (`data.json` è indicizzato **prima per lingua**), quindi i campi partono `undefined` finché `loadPage` non li riempie. Non fidarsi dello state iniziale.

Aggiungere una pagina significa toccare tre file allineati a mano: `index.js` (state), `mutations.js` (case nello switch di `setPage`), `getters.js`.

### i18n

Fatto a mano, senza vue-i18n. La lingua sta in `localStorage.lang`, normalizzata in `App.vue` (`checkAndSetLang`). Cambio lingua → `page/changeLang`, che riscrive navbar/footer e ricarica la pagina corrente.

Attenzione: `supportedLang` in `App.vue` è `['it','en','pl','es','fr']`, ma `data.json`, `navbar.json` e `CONTACT_LABELS` contengono anche `pt` — quel contenuto oggi è irraggiungibile. Aggiungere una lingua richiede di aggiornare sia `supportedLang` sia gli switch per lingua in `page/mutations.js`.

### Immagini

`$util.getImgUrl(pic)` (`src/utility/utility.js`, registrato come global property in `main.js`) fa passare invariati gli URL `http(s)` — è così che le immagini Supabase Storage convivono con le immagini locali `require`-ate da `@/assets/img/`. Le immagini delle attività ora arrivano da Storage; quelle in `data.json` sotto `groups` restano solo come input dello script di migrazione.

### Componenti

- `src/components/ui/Base*` + `BackButton`/`ImageDialog`: registrati **globalmente** in `main.js` (`<base-card>`, `<base-spinner>`, …), non vanno importati nelle view.
- `src/components/Mdv*` e `layout/Mdv*`: importati localmente.
- Il rendering del testo passa da `vue3-markdown-it` con `:html="true"` — i contenuti in `data.json` e i `body` da Supabase sono markdown/HTML misto.

## Deploy

`npm run deploy` crea un branch orfano `gh-pages`, ci committa il build e fa force-push. Due dettagli non ovvi:

- Il deploy esegue `npm run stage`, cioè `--mode development`, **non** `npm run build`.
- Lo script termina con `git checkout -f develop`: eseguirlo da un altro branch lascia il repo su `develop`.

CI (`.github/workflows/cicd.yml`) fa lo stesso su push a `develop`. Il vecchio `.github/workflows/main.yml` (FTP su cPanel) punta a un branch `master` che non esiste più: è dead code.

## Branch

`develop` è la linea di sviluppo reale; `main` è stata allineata a `develop` con un merge. `gh-pages` contiene solo output di build. `feature/admin-page` è ferma al 2023 e contiene l'area admin che `develop` ha poi rimosso di proposito — non va mergiata.

## Convenzioni

Commenti, log e messaggi utente sono in italiano; i messaggi di commit seguono il formato `tipo(scope): descrizione` (`feat(webapp):`, `refactor(webapp):`, `ci(webapp):`).

`api/SendMail.php` è nel repo ma non è il deployment attivo: `MdvForm.vue` fa POST su `https://vocazione.altervista.org/api/SendMail.php` (endpoint hardcoded, non da env).
