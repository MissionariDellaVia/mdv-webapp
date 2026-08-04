# Sotto-progetto #1 — Core migration: webapp MDV da Firebase/Aruba a Supabase

**Data:** 2026-06-01
**Stato:** Design approvato — in attesa di review della spec
**Repo coinvolti:** `mdv-webapp` (Vue), `mdv-admin-dashboard` (React), progetto Supabase condiviso

---

## 1. Contesto e problema

L'area admin della webapp restituisce `Connection failed: Access denied for user 'Sql842386'@'...' (using password: YES)`. Causa: l'API PHP `images.php` su Aruba valida la `X-Api-Key` interrogando un MySQL Aruba **non più attivo**. La gestione immagini attività è quindi rotta.

Più in generale i dati sono frammentati su **tre backend**:

| Dato | Backend oggi | Stato |
|------|--------------|-------|
| Contenuti pagine (attività, chi-siamo, vocazione…) | Firebase Realtime DB | funziona |
| Immagini attività | PHP `images.php` su Aruba → MySQL Aruba | **rotto** |
| Blog | Google Blogger API | funziona |
| Auth area riservata | Firebase Auth | funziona |

L'ecosistema è però **già 2/3 su Supabase**:
- **Mobile** (Expo/React Native): consuma Edge Functions `gospel-*`. Nessun Firebase.
- **Dashboard** (React): gestisce i contenuti "Via del Vangelo" su Supabase (Postgres + Storage + Auth).

La webapp Vue è **l'unico** consumatore ancora legato a Firebase + Aruba.

## 2. Obiettivo

Centralizzare il dominio "attività" (location-centrico) su Supabase, allineando la webapp al pattern già usato da mobile e dashboard. Esito:
- L'errore sparisce (niente più Aruba/MySQL).
- La webapp diventa un **puro consumatore pubblico** (come la mobile): legge da Supabase, non scrive.
- **Un solo punto di amministrazione**: la dashboard React.
- Firebase, Aruba PHP/MySQL e l'area riservata della webapp vengono **dismessi**.

## 2-bis. Principio guida (north star)

> **Offrire ai frati il modo più semplice possibile per diffondere contenuti religiosi digitali, senza uscirne pazzi.** Semplicità e centralità prima di tutto.

Implicazioni di design che valgono per **tutti** i sotto-progetti:
- **Un unico pannello** (la dashboard) per tutto ciò che i frati pubblicano. Nessun secondo admin, nessun file da toccare a mano per il contenuto che diffondono regolarmente.
- **UX da non-tecnici:** flussi brevi e guidati (es. pubblicare un volantino = scegli location → carica immagine → data → pubblica). Campi minimi, default sensati, validazione chiara, niente gergo tecnico.
- **Confine statico/dinamico al servizio della semplicità:** ciò che i frati cambiano di rado e mai in autonomia (testi istituzionali: chi-siamo, charisma) resta JSON nel repo; ciò che diffondono attivamente (location, info, eventi/volantini) sta nella dashboard. Se domani serve dare ai frati anche l'editing dei testi statici, una pagina si *promuove* alla dashboard con lo stesso pattern — senza riprogettare nulla.
- **Coerenza riduce il carico cognitivo:** stesso pattern editoriale (rich text, upload immagini, pubblica/bozza) per gospel, location ed eventi, così imparano una volta sola.

## 3. Scope

### In scope (#1)
- Tabelle Supabase `locations` + `location_info` (migrazione dei `groups`/`sections` attuali da Firebase).
- Immagini location → **Supabase Storage**.
- Webapp legge le location via **Edge Function** (`locations`), pattern identico a `gospel-*`.
- Pagine statiche (chi-siamo, vocazione, charisma, links, contatti, navbar, footer) → **JSON locali** nel repo (`src/assets/data/`).
- Amministrazione location/info → nuove pagine nella **dashboard** esistente.
- Dismissione: area riservata Vue, Firebase Auth, `src/firebase/*`, `attivitaApi.js`/`images.php`, dipendenza Aruba.

### Fuori scope (sotto-progetti successivi)
- **#2 — Entità `events`** (appuntamenti + volantini, datati, con geo). Progettata qui per dare la rotta, implementata dopo.
- **#3 — Pipeline social** (post FB / storia IG da un evento).
- Notifiche push geolocalizzate (si salvano lat/lng ora, infrastruttura dopo — YAGNI).
- Migrazione del blog (resta su Blogger).
- Migrazione utenti finali (il sito pubblico non ha login utenti).
- **Futuro (solo se servirà):** portare anche i contenuti delle pagine statiche (oggi JSON locali, in arrivo da Firebase) sotto gestione dashboard su Supabase, con lo stesso pattern di `locations`. Si fa **solo** quando emerge il bisogno concreto di editarle dalla dashboard. Per ora i JSON locali bastano (YAGNI). La scelta di rimuoverle da Firebase ora **non** preclude questa evoluzione: si promuove pagina per pagina senza riprogettare nulla.

## 4. Modello dati (location-centrico)

```
Location (es. Santuario Madonna della Catena)
 ├─ Info ricorrenti / statiche  → testuali (orari Sante Messe, confessioni, rosario…)
 └─ Eventi (appuntamenti)       → datati: testuale | volantino  [ENTITÀ #2, non in #1]
```

### Tabelle in scope per #1

**`locations`** — il luogo (mappa i `groups` attuali; `key` → `slug`)

| Campo | Tipo | Note |
|------|------|------|
| `id` | uuid PK | |
| `slug` | text unique | era `key` (es. `madonna-dc`) |
| `name` | text | era `title` |
| `address` | text null | leggibile |
| `latitude` | numeric null | predisposto per push geo future |
| `longitude` | numeric null | predisposto per push geo future |
| `cover_image` | text null | path su Storage |
| `lang` | text | `it` \| `en` \| `es` |
| `position` | int | ordinamento |
| `published` | bool default true | |
| `created_at` / `updated_at` | timestamptz | |

**`location_info`** — blocchi testuali ricorrenti della location (mappa le `sections`; `articles[]` → `body` HTML)

| Campo | Tipo | Note |
|------|------|------|
| `id` | uuid PK | |
| `location_id` | uuid FK → locations | |
| `title` | text null | es. "Orari Sante Messe" |
| `body` | text | HTML (convenzione Tiptap della dashboard) |
| `images` | text[] null | path Storage per il carousel della sezione |
| `position` | int | ordinamento |
| `created_at` / `updated_at` | timestamptz | |

**Associazione immagini (decisione esplicita):** le immagini vengono legate al singolo blocco `location_info` (campo `images`), non alla location globale. Questo supera un'incoerenza dell'attuale codice, dove l'admin associa le immagini per-sezione (`section.image`) ma il caricamento pubblico le carica per-`key` e le assegna a *tutte* le sezioni del gruppo. Il nuovo modello rende l'associazione per-blocco coerente tra scrittura (dashboard) e lettura (Edge Function). La "parità visiva" da validare significa quindi *stesse immagini mostrate dove l'editor le ha messe*, non riprodurre il bug di duplicazione.

**Multilingua:** colonna `lang` per riga (it/en/es), coerente con l'attuale struttura per-lingua dei JSON. Niente tabella di traduzione (over-engineering).

**Storage:** bucket `locations`, path `locations/{slug}/{filename}`. Sostituisce la directory `/attivita/` di Aruba.

**RLS:** lettura pubblica (anon) per le righe `published`; scrittura riservata agli utenti autenticati della dashboard. Si replica il pattern già attivo su Supabase per i contenuti gospel.

### Entità #2 (progettata, NON implementata in #1)

**`events`** — appuntamenti datati, `type` = `text` | `flyer`. Il **volantino** è `type:'flyer'` + `image`.

| Campo | Tipo | Note |
|------|------|------|
| `id` | uuid PK | |
| `location_id` | uuid FK → locations | |
| `type` | text | `text` \| `flyer` |
| `title` | text | |
| `slug` | text | deep-link |
| `body` | text null | HTML, per eventi testuali |
| `image` | text null | path Storage, per i volantini |
| `gallery` | text[] null | immagini extra |
| `starts_at` / `ends_at` | timestamptz | |
| `published` | bool | |
| `lang` | text | |

## 5. Architettura target

- **Supabase** (progetto condiviso con dashboard e mobile): tabelle + RLS + Storage bucket `locations` + Edge Function `locations`.
- **Dashboard (React):** nuova sezione *Locations* — CRUD location, sotto-CRUD `location_info`, upload immagini su Storage. Riusa i pattern esistenti (`api.ts` namespaced, react-hook-form + zod, TanStack Query, layout `AdminLayout`).
- **Webapp (Vue):**
  - `page/actions.js → loadPage`: per la pagina `attivita` legge dall'Edge Function `locations`; per le altre pagine legge dai **JSON locali**.
  - Rimozione di `src/firebase/*`, `src/services/attivitaApi.js`, modulo auth lato admin, route e viste dell'area riservata (`AttivitaAdmin.vue`, `Dashboard.vue`, `EditPage.vue`).
  - Nuove env `VUE_APP_SUPABASE_URL` + `VUE_APP_SUPABASE_ANON_KEY`; rimozione `VUE_APP_FIREBASE_*` e `VUE_APP_API_*` (immagini).
- **Mobile:** non toccata in #1 (consumerà `locations`/`events` in iterazioni successive).

## 6. Edge Function

`GET /functions/v1/locations?lang=it` → restituisce `locations[]` con `info[]` annidate e URL pubblici delle immagini (risolti dallo Storage). Stesso stile di `gospel-*` (header anon key, CORS condiviso da `_shared/cors.ts`).

## 7. Migrazione dati (one-shot)

1. Export Firebase RTDB `/pages/{lang}/attivita.json` per `it`/`en`/`es`.
2. Transform: `groups` → `locations`, `sections` → `location_info` (`articles[]` concatenati/convertiti in `body` HTML).
3. Estrazione immagini: ri-caricare i file su Storage.
   - **Rischio:** se `images.php` è completamente down (per via del MySQL), l'endpoint di list potrebbe non rispondere. Le immagini sono però file statici serviti su `missionaridellavia.net/.../attivita/` e dovrebbero risolvere via URL pubblico senza passare dal check API. **Da verificare nel piano**: se il list API non funziona, scaricare i file dai loro URL pubblici noti.
4. Snapshot dei contenuti delle **pagine statiche** da Firebase → `src/assets/data/data.json` (verificare il delta con il `data.json` già presente, 86KB: probabilmente è il seed e Firebase contiene le modifiche successive).

## 8. Validazione

- L'Edge Function `locations` restituisce la struttura attesa per ogni lingua.
- La pagina `/attivita` della webapp rende **identica** a oggi (parità visiva, inclusa la logica carousel singola/array immagini).
- Le immagini caricano dal CDN Storage.
- Le pagine statiche rendono dai JSON locali.
- Nessuna chiamata residua a Firebase o Aruba (verifica Network tab).
- `npm run build` passa; `check-build-env.js` aggiornato (rimozione var obsolete, aggiunta Supabase).

## 9. Rischi e mitigazioni

| Rischio | Mitigazione |
|--------|-------------|
| `images.php` down impedisce l'estrazione immagini | Fallback: download dai URL pubblici statici della directory `/attivita/` |
| Completezza dati multilingua (it/en/es) | Migrare e validare le tre lingue; default a `it` se mancante |
| Parità visiva del carousel | Replicare in Edge Function la logica "1 immagine = stringa, >1 = array" |
| Coordinamento due repo | Sequenza rigida: schema+dashboard → migrazione → switch webapp → dismissione |
| Delta data.json locale vs Firebase | Diff esplicito nel piano prima di sovrascrivere i JSON locali |

## 10. Sequenza di implementazione (dettaglio nel piano)

1. **Supabase:** schema (`locations`, `location_info`) + RLS + bucket Storage + policy.
2. **Script di migrazione:** Firebase + immagini → Supabase.
3. **Dashboard:** sezione Locations/Info (CRUD + upload immagini).
4. **Edge Function:** `locations`.
5. **Webapp:** lettura da Edge Function + JSON locali; rimozione Firebase/Aruba/area riservata.
6. **Verifica parità + dismissione** Firebase/Aruba.

## 11. Definition of Done (#1)

- [ ] La pagina `/attivita` carica da Supabase, identica all'attuale.
- [ ] Le immagini sono su Storage e visibili.
- [ ] Le location si gestiscono interamente dalla dashboard.
- [ ] Le pagine statiche sono servite da JSON locali.
- [ ] Nessuna dipendenza residua da Firebase o Aruba nella webapp.
- [ ] Area riservata Vue rimossa; build verde.
