# Webapp Supabase Core Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrare il dominio "attività" (location-centrico) della webapp MDV da Firebase RTDB + PHP/MySQL Aruba a Supabase (Postgres + Storage + Edge Function), gestito da un unico pannello (la dashboard React), e dismettere Firebase/Aruba/area riservata.

**Architecture:** Tre layer. (1) Supabase: tabelle `locations` + `location_info`, RLS, bucket Storage `location-media`, Edge Function `locations` (stile `gospel-*`). (2) Dashboard React: nuova sezione CRUD "Luoghi" che scrive su Supabase, riusa i pattern `api.ts`/react-hook-form/TanStack Query, con test (Vitest) a protezione del layer dati. (3) Webapp Vue: legge le location dall'Edge Function, le pagine statiche dai JSON locali, e perde ogni dipendenza Firebase/Aruba/area riservata.

**Tech Stack:** Supabase (Postgres, Storage, Deno Edge Functions), React 19 + Vite + TanStack Query + react-hook-form + zod + Vitest (dashboard), Vue 3 + Vuex (webapp), Node (script di migrazione, `node:test`).

**Spec di riferimento:** `docs/superpowers/specs/2026-06-01-webapp-supabase-core-migration-design.md`

**Convenzioni allineate al codebase esistente (scostamenti dalla spec sketch):**
- ID `BIGSERIAL`/`BIGINT` (come `gospel*`/`seeds`), non `uuid`. I tipi TS usano `number`.
- Bucket Storage chiamato `location-media` (convenzione `<dominio>-media`, come `gospel-media`).
- `lang` come `VARCHAR(5)`; default `'it'`.
- Trigger `update_updated_at_column()` già esistente, riusato.

**Strategia di test (richiesta esplicita: proteggere il modello e chi interagisce con i dati):**
- **Dashboard:** si introduce **Vitest** e si testano i layer che toccano i dati: `locationsApi`/`locationInfoApi` (con client Supabase mockato) e la **funzione pura di shaping** dell'Edge Function (estratta in un modulo testabile). Questi test sono la rete anti-regressione del modello.
- **Script di migrazione (webapp):** TDD con `node:test` sulla trasformazione pura.
- **Webapp Vue:** nessun test runner presente; si verifica con build + run visivo (il consumo è una lettura sottile sopra l'Edge Function già testata).

**Repo coinvolti:**
- `C:\dev\Workspace\local\workspace_web\mdv-admin-dashboard` (Supabase SQL, Edge Function, UI admin, test)
- `C:\dev\Workspace\local\workspace_web\mdv-webapp` (consumo, cleanup, script di migrazione)

---

## File Structure

**Dashboard (`mdv-admin-dashboard`):**
- Create: `supabase/migrations/20260601_add_locations.sql` — schema + RLS + Storage bucket.
- Create: `supabase/functions/_shared/locations-shape.ts` — funzione pura di shaping risposta (testabile).
- Create: `supabase/functions/locations/index.ts` — Edge Function (usa lo shaping).
- Create: `supabase/functions/_shared/locations-shape.test.ts` — test shaping.
- Modify: `src/lib/types.ts` — `Location`, `LocationInfo`, form types.
- Modify: `src/lib/api.ts` — `locationsApi`, `locationInfoApi`.
- Create: `src/lib/api.locations.test.ts` — test del layer API (mock supabase).
- Create: `src/pages/locations/LocationList.tsx`, `src/pages/locations/LocationEdit.tsx`.
- Modify: `src/App.tsx`, `src/components/layout/Sidebar.tsx`.
- Modify: `package.json` (script `test`), `vitest.config.ts` (nuovo), `src/test/setup.ts` (nuovo).

**Webapp (`mdv-webapp`):**
- Create: `scripts/lib/transform-locations.js` + `scripts/lib/transform-locations.test.js`.
- Rewrite: `scripts/migrate-attivita.js`.
- Create: `src/services/locationsApi.js`; Delete: `src/services/attivitaApi.js`.
- Modify: `src/store/modules/page/actions.js`, `src/router/index.js`, `src/store/index.js`.
- Delete: `src/firebase/`, `src/store/modules/auth/`, `src/view/admin/`, `src/view/Auth.vue`.
- Modify: `.env`, `.env.production`, `check-build-env.js`, `CLAUDE.md`.

---

## Phase 0 — Preparazione

> **Policy branch + rilascio (richiesta utente):** lo sviluppo avviene su **`develop`** in entrambi i repo. Il **rilascio è guidato dal tag**: quando una versione su `develop` è verificata, si crea un **tag di versione** (`vX.Y.Z`) sul commit di `develop`; quel tag **promuove `main`** allineandolo a quel commit (fast-forward/merge di `main` al commit taggato). Così `main` punta sempre a una versione stabile taggata. Niente feature branch.
>
> Flusso di rilascio:
> ```bash
> # su develop, a versione verificata:
> git tag -a vX.Y.Z -m "Release vX.Y.Z: <sintesi>"
> git push origin vX.Y.Z
> # promuovi main alla versione taggata:
> git checkout main && git merge --ff-only vX.Y.Z && git push origin main
> git checkout develop
> ```

### Task 0: Allineare `develop` in entrambi i repo

**Files:** nessuno (operazione git)

- [ ] **Step 1: Dashboard su `develop` aggiornato**

```bash
cd /c/dev/Workspace/local/workspace_web/mdv-admin-dashboard
git checkout develop 2>/dev/null || git checkout -b develop
git pull --ff-only origin develop 2>/dev/null || true
```

- [ ] **Step 2: Webapp su `develop` aggiornato**

```bash
cd /c/dev/Workspace/local/workspace_web/mdv-webapp
git checkout develop
git pull --ff-only origin develop 2>/dev/null || true
```

- [ ] **Step 3: Verifica branch**

Run: `git -C /c/dev/Workspace/local/workspace_web/mdv-admin-dashboard branch --show-current && git -C /c/dev/Workspace/local/workspace_web/mdv-webapp branch --show-current`
Expected: `develop` in entrambi.

---

## Phase 1 — Supabase: schema, RLS, Storage

### Task 1: Migration SQL per `locations` e `location_info`

**Files:**
- Create: `mdv-admin-dashboard/supabase/migrations/20260601_add_locations.sql`

- [ ] **Step 1: Scrivere la migration**

```sql
-- Locations domain: luoghi MDV con info ricorrenti (orari messe, confessioni…)
-- Eseguire nel SQL Editor di Supabase (o via supabase db push)

CREATE TABLE locations (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(120) NOT NULL,
  name VARCHAR(255) NOT NULL,
  lang VARCHAR(5) NOT NULL DEFAULT 'it',
  address VARCHAR(500),
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  cover_image TEXT,
  intro TEXT,
  position INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (slug, lang)
);

COMMENT ON COLUMN locations.intro IS 'Testo introduttivo (era attivita.main.caption)';
COMMENT ON COLUMN locations.latitude IS 'Predisposto per notifiche push geolocalizzate future';

CREATE TABLE location_info (
  id BIGSERIAL PRIMARY KEY,
  location_id BIGINT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  title VARCHAR(255),
  body TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN location_info.body IS 'Contenuto HTML (era sections.articles[])';
COMMENT ON COLUMN location_info.images IS 'URL pubblici Storage per il carousel della sezione';

CREATE INDEX idx_locations_lang ON locations(lang);
CREATE INDEX idx_locations_published ON locations(is_published);
CREATE INDEX idx_locations_position ON locations(lang, position);
CREATE INDEX idx_location_info_location ON location_info(location_id);
CREATE INDEX idx_location_info_order ON location_info(location_id, position);

CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_location_info_updated_at
  BEFORE UPDATE ON location_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published locations are viewable by everyone"
  ON locations FOR SELECT
  USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Locations are insertable by authenticated users"
  ON locations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Locations are updatable by authenticated users"
  ON locations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Locations are deletable by authenticated users"
  ON locations FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Location info are viewable by everyone"
  ON location_info FOR SELECT USING (true);
CREATE POLICY "Location info are insertable by authenticated users"
  ON location_info FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Location info are updatable by authenticated users"
  ON location_info FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Location info are deletable by authenticated users"
  ON location_info FOR DELETE USING (auth.role() = 'authenticated');

INSERT INTO storage.buckets (id, name, public)
VALUES ('location-media', 'location-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for location-media"
  ON storage.objects FOR SELECT USING (bucket_id = 'location-media');
CREATE POLICY "Authenticated users can upload to location-media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'location-media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update location-media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'location-media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete from location-media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'location-media' AND auth.role() = 'authenticated');
```

- [ ] **Step 2: Applicare la migration** — SQL Editor di Supabase (incolla ed esegui) oppure `supabase db push`.

- [ ] **Step 3: Verificare tabelle e bucket**

```sql
SELECT table_name FROM information_schema.tables WHERE table_name IN ('locations','location_info');
SELECT id FROM storage.buckets WHERE id = 'location-media';
```
Expected: due righe tabelle + una riga bucket.

- [ ] **Step 4: Commit**

```bash
cd /c/dev/Workspace/local/workspace_web/mdv-admin-dashboard
git add supabase/migrations/20260601_add_locations.sql
git commit -m "feat(db): add locations + location_info tables, RLS, storage bucket"
```

---

## Phase 2 — Script di migrazione dati (one-shot)

### Task 2: Funzione pura di trasformazione (TDD)

**Files:**
- Create: `mdv-webapp/scripts/lib/transform-locations.js`
- Test: `mdv-webapp/scripts/lib/transform-locations.test.js`

- [ ] **Step 1: Scrivere il test che fallisce**

```js
// scripts/lib/transform-locations.test.js
const test = require('node:test');
const assert = require('node:assert');
const { transformAttivita, articlesToHtml } = require('./transform-locations');

test('articlesToHtml wraps markdown-bold lines into an HTML list', () => {
  const html = articlesToHtml([
    '**Santa Messa** Domenica ore 17:00',
    '**Rosario** Domenica ore 16:00',
  ]);
  assert.strictEqual(
    html,
    '<ul><li><strong>Santa Messa</strong> Domenica ore 17:00</li>' +
    '<li><strong>Rosario</strong> Domenica ore 16:00</li></ul>'
  );
});

test('transformAttivita maps groups->locations and sections->info', () => {
  const attivita = {
    main: { caption: 'A seguire le attività' },
    groups: [{
      key: 'madonna-dc',
      title: 'Santuario Madonna della Catena',
      sections: [{ articles: ['**Santa Messa** Domenica ore 17:00'], image: { url: ['attivita-1.png'] } }],
    }],
  };
  const result = transformAttivita(attivita, 'it');
  assert.strictEqual(result.length, 1);
  const loc = result[0];
  assert.strictEqual(loc.slug, 'madonna-dc');
  assert.strictEqual(loc.name, 'Santuario Madonna della Catena');
  assert.strictEqual(loc.lang, 'it');
  assert.strictEqual(loc.intro, 'A seguire le attività');
  assert.strictEqual(loc.position, 0);
  assert.strictEqual(loc.info.length, 1);
  assert.strictEqual(loc.info[0].position, 0);
  assert.ok(loc.info[0].body.includes('<strong>Santa Messa</strong>'));
  assert.deepStrictEqual(loc.info[0].imageFilenames, ['attivita-1.png']);
});

test('transformAttivita returns empty array when no groups', () => {
  assert.deepStrictEqual(transformAttivita({ groups: [] }, 'it'), []);
  assert.deepStrictEqual(transformAttivita({}, 'it'), []);
});
```

- [ ] **Step 2: Eseguire il test e verificarne il fallimento**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-webapp && node --test scripts/lib/`
Expected: FAIL — `Cannot find module './transform-locations'`

- [ ] **Step 3: Implementare la funzione pura**

```js
// scripts/lib/transform-locations.js
function inlineMarkdown(text) {
  return String(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
function articlesToHtml(articles) {
  if (!Array.isArray(articles) || articles.length === 0) return '';
  return `<ul>${articles.map((a) => `<li>${inlineMarkdown(a)}</li>`).join('')}</ul>`;
}
function imageFilenames(section) {
  const url = section && section.image ? section.image.url : null;
  if (!url) return [];
  return Array.isArray(url) ? url.slice() : [url];
}
function transformAttivita(attivita, lang) {
  if (!attivita || !Array.isArray(attivita.groups)) return [];
  const intro = attivita.main && attivita.main.caption ? attivita.main.caption : null;
  return attivita.groups.map((group, gIndex) => ({
    slug: group.key,
    name: group.title || group.key,
    lang,
    intro,
    position: gIndex,
    info: (Array.isArray(group.sections) ? group.sections : []).map((section, sIndex) => ({
      title: section.title || null,
      body: articlesToHtml(section.articles),
      imageFilenames: imageFilenames(section),
      position: sIndex,
    })),
  }));
}
module.exports = { transformAttivita, articlesToHtml, imageFilenames, inlineMarkdown };
```

- [ ] **Step 4: Eseguire il test e verificarne il successo**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-webapp && node --test scripts/lib/`
Expected: PASS — 3 test passati.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/transform-locations.js scripts/lib/transform-locations.test.js
git commit -m "feat(migration): pure transform attivita -> locations (tested)"
```

### Task 3: Script di migrazione completo (dati + immagini → Supabase)

**Files:**
- Rewrite: `mdv-webapp/scripts/migrate-attivita.js`

**Prerequisiti (env per l'esecuzione):** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (service role, NON committare), `VUE_APP_API_BASE_URL` (opzionale, tentativo download immagini Aruba).

- [ ] **Step 1: Installare la dipendenza Supabase (dev) nel repo webapp**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-webapp && npm install --save-dev @supabase/supabase-js`
Expected: pacchetto in devDependencies.

- [ ] **Step 2: Riscrivere lo script**

```js
// scripts/migrate-attivita.js
// Migrazione one-shot: data.json (attivita) -> Supabase (locations + location_info) + immagini su Storage.
// Uso: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-attivita.js
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { transformAttivita } = require('./lib/transform-locations');

const DATA_FILE = path.join(__dirname, '../src/assets/data/data.json');
const LOCAL_IMG_DIR = path.join(__dirname, '../src/assets/img');
const BUCKET = 'location-media';
const LANGS = ['it', 'en', 'es'];

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ARUBA_BASE = process.env.VUE_APP_API_BASE_URL || 'https://www.missionaridellavia.net/api/v1';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Servono SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const contentType = (name) => {
  const ext = path.extname(name).toLowerCase();
  return ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.gif' ? 'image/gif' : 'image/jpeg';
};

async function resolveImageBytes(slug, filename) {
  try {
    const res = await fetch(`${ARUBA_BASE}/images.php?key=${encodeURIComponent(slug)}`);
    if (res.ok) {
      const data = await res.json();
      const match = (data.images || []).find((i) => i.url && i.url.endsWith(filename));
      if (match) {
        const img = await fetch(match.url);
        if (img.ok) return Buffer.from(await img.arrayBuffer());
      }
    }
  } catch (_) { /* fallback */ }
  const local = path.join(LOCAL_IMG_DIR, filename);
  if (fs.existsSync(local)) return fs.readFileSync(local);
  console.warn(`   ⚠️  Immagine non trovata (né API né locale): ${filename}`);
  return null;
}

async function uploadImage(slug, filename, bytes) {
  const storagePath = `${slug}/${filename}`;
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, bytes, { contentType: contentType(filename), upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function migrate() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  for (const lang of LANGS) {
    const attivita = data[lang] && data[lang].attivita;
    if (!attivita) { console.log(`⚠️  Nessun attivita per "${lang}", salto`); continue; }
    const locations = transformAttivita(attivita, lang);
    console.log(`\n📦 ${lang}: ${locations.length} location`);
    for (const loc of locations) {
      const { data: inserted, error: locErr } = await supabase
        .from('locations')
        .upsert({ slug: loc.slug, name: loc.name, lang: loc.lang, intro: loc.intro, position: loc.position }, { onConflict: 'slug,lang' })
        .select().single();
      if (locErr) throw locErr;
      console.log(`   ✓ location "${loc.slug}" (id ${inserted.id})`);
      await supabase.from('location_info').delete().eq('location_id', inserted.id);
      for (const info of loc.info) {
        const urls = [];
        for (const filename of info.imageFilenames) {
          const bytes = await resolveImageBytes(loc.slug, filename);
          if (bytes) urls.push(await uploadImage(loc.slug, filename, bytes));
        }
        const { error: infoErr } = await supabase.from('location_info').insert({
          location_id: inserted.id, title: info.title, body: info.body, images: urls, position: info.position,
        });
        if (infoErr) throw infoErr;
        console.log(`      ✓ info #${info.position} (${urls.length} immagini)`);
      }
    }
  }
  console.log('\n✨ Migrazione completata.');
}
migrate().catch((err) => { console.error('❌ Migrazione fallita:', err); process.exit(1); });
```

- [ ] **Step 3: Dry-check del transform su dati reali**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-webapp && node -e "const {transformAttivita}=require('./scripts/lib/transform-locations'); const d=require('./src/assets/data/data.json'); console.log(JSON.stringify(transformAttivita(d.it.attivita,'it'),null,2))"`
Expected: location `it` con `info[]`, `body` HTML, `imageFilenames`.

- [ ] **Step 4: Eseguire la migrazione**

Run (PowerShell): `cd C:\dev\Workspace\local\workspace_web\mdv-webapp; $env:SUPABASE_URL="<url>"; $env:SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"; node scripts/migrate-attivita.js`
Expected: log location/info per `it`/`en`/`es`, nessun errore.

- [ ] **Step 5: Verificare i dati**

```sql
SELECT l.lang, l.slug, l.name, count(i.id) AS info
FROM locations l LEFT JOIN location_info i ON i.location_id = l.id
GROUP BY l.id ORDER BY l.lang, l.position;
```
Expected: una riga per location col conteggio info; file presenti nel bucket sotto `{slug}/`.

- [ ] **Step 6: Commit**

```bash
git add scripts/migrate-attivita.js package.json package-lock.json
git commit -m "feat(migration): one-shot attivita -> Supabase (data + images)"
```

---

## Phase 3 — Dashboard: setup test + tipi + API (con test anti-regressione)

### Task 4: Setup Vitest nella dashboard

**Files:**
- Modify: `mdv-admin-dashboard/package.json`
- Create: `mdv-admin-dashboard/vitest.config.ts`
- Create: `mdv-admin-dashboard/src/test/setup.ts`

- [ ] **Step 1: Installare Vitest**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-admin-dashboard && npm install --save-dev vitest @vitest/coverage-v8`
Expected: pacchetti in devDependencies.

- [ ] **Step 2: Aggiungere gli script in `package.json`**

Nel blocco `"scripts"` aggiungere:

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 3: Creare `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'supabase/functions/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Creare il setup file (placeholder per env di test)**

```ts
// src/test/setup.ts
// Variabili minime per far inizializzare il client Supabase nei moduli importati durante i test.
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://localhost';
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'test-anon-key';
```

- [ ] **Step 5: Verificare che Vitest parta (nessun test ancora)**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-admin-dashboard && npm test`
Expected: Vitest gira e riporta "no test files" (o 0 test) senza errori di config.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts
git commit -m "test(dashboard): add Vitest setup"
```

### Task 5: Tipi TypeScript

**Files:**
- Modify: `mdv-admin-dashboard/src/lib/types.ts` (append in fondo)

- [ ] **Step 1: Aggiungere le interfacce**

```ts
// LOCATIONS

export interface LocationInfo {
  id: number;
  location_id: number;
  title: string | null;
  body: string;
  images: string[];
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: number;
  slug: string;
  name: string;
  lang: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  cover_image: string | null;
  intro: string | null;
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  location_info?: LocationInfo[];
}

export interface LocationFormData {
  slug: string;
  name: string;
  lang: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  cover_image?: string | null;
  intro?: string | null;
  position?: number;
  is_published?: boolean;
}

export interface LocationInfoFormData {
  title?: string | null;
  body: string;
  images?: string[];
  position?: number;
}
```

- [ ] **Step 2: Type-check**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-admin-dashboard && npx tsc --noEmit`
Expected: nessun errore.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat(dashboard): location types"
```

### Task 6: API layer con test anti-regressione (TDD)

**Files:**
- Modify: `mdv-admin-dashboard/src/lib/api.ts` (append in fondo)
- Create: `mdv-admin-dashboard/src/lib/api.locations.test.ts`

- [ ] **Step 1: Scrivere i test che falliscono (mock del client Supabase)**

```ts
// src/lib/api.locations.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock del client supabase usato da api.ts
const mockSingle = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockFrom = vi.fn();

vi.mock('./supabase', () => ({
  supabase: { from: (...a: unknown[]) => mockFrom(...a) },
}));

import { locationsApi, locationInfoApi } from './api';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('locationsApi.getAll', () => {
  it('filtra per lang e ordina per position', async () => {
    const rows = [{ id: 1, slug: 'madonna-dc', name: 'Santuario', lang: 'it', location_info: [] }];
    mockOrder.mockReturnValue({ eq: () => Promise.resolve({ data: rows, error: null }) });
    mockSelect.mockReturnValue({ order: mockOrder });
    mockFrom.mockReturnValue({ select: mockSelect });

    const result = await locationsApi.getAll('it');

    expect(mockFrom).toHaveBeenCalledWith('locations');
    expect(mockSelect).toHaveBeenCalledWith('*, location_info(*)');
    expect(result).toEqual(rows);
  });

  it('propaga l’errore Supabase', async () => {
    mockOrder.mockReturnValue({ eq: () => Promise.resolve({ data: null, error: new Error('boom') }) });
    mockSelect.mockReturnValue({ order: mockOrder });
    mockFrom.mockReturnValue({ select: mockSelect });

    await expect(locationsApi.getAll('it')).rejects.toThrow('boom');
  });
});

describe('locationInfoApi.create', () => {
  it('inserisce con location_id e ritorna la riga', async () => {
    const row = { id: 9, location_id: 1, title: 'Orari', body: '<ul></ul>', images: [], position: 0 };
    mockSingle.mockResolvedValue({ data: row, error: null });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockFrom.mockReturnValue({ insert: mockInsert });

    const result = await locationInfoApi.create(1, { body: '<ul></ul>', title: 'Orari', images: [], position: 0 });

    expect(mockFrom).toHaveBeenCalledWith('location_info');
    expect(mockInsert).toHaveBeenCalledWith([{ body: '<ul></ul>', title: 'Orari', images: [], position: 0, location_id: 1 }]);
    expect(result).toEqual(row);
  });
});
```

- [ ] **Step 2: Eseguire i test e verificarne il fallimento**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-admin-dashboard && npm test`
Expected: FAIL — `locationsApi`/`locationInfoApi` non esportati da `./api`.

- [ ] **Step 3: Implementare il layer API (append a `src/lib/api.ts`)**

```ts
import type { Location, LocationFormData, LocationInfo, LocationInfoFormData } from './types';

// LOCATIONS API
export const locationsApi = {
  async getAll(lang?: string) {
    let q = supabase.from('locations').select('*, location_info(*)').order('position', { ascending: true });
    if (lang) q = q.eq('lang', lang);
    const { data, error } = await q;
    if (error) throw error;
    return data as Location[];
  },
  async getById(id: number) {
    const { data, error } = await supabase.from('locations').select('*, location_info(*)').eq('id', id).single();
    if (error) throw error;
    return data as Location;
  },
  async create(location: LocationFormData) {
    const { data, error } = await supabase.from('locations').insert([location]).select().single();
    if (error) throw error;
    return data as Location;
  },
  async update(id: number, location: Partial<LocationFormData>) {
    const { data, error } = await supabase.from('locations').update(location).eq('id', id).select().single();
    if (error) throw error;
    return data as Location;
  },
  async delete(id: number) {
    const { error } = await supabase.from('locations').delete().eq('id', id);
    if (error) throw error;
  },
  async uploadImage(file: File, slug: string) {
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${slug}/${Date.now()}_${cleanName}`;
    const { error } = await supabase.storage.from('location-media').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('location-media').getPublicUrl(path);
    return data.publicUrl;
  },
};

// LOCATION INFO API
export const locationInfoApi = {
  async create(locationId: number, info: LocationInfoFormData) {
    const { data, error } = await supabase.from('location_info').insert([{ ...info, location_id: locationId }]).select().single();
    if (error) throw error;
    return data as LocationInfo;
  },
  async update(id: number, info: Partial<LocationInfoFormData>) {
    const { data, error } = await supabase.from('location_info').update(info).eq('id', id).select().single();
    if (error) throw error;
    return data as LocationInfo;
  },
  async delete(id: number) {
    const { error } = await supabase.from('location_info').delete().eq('id', id);
    if (error) throw error;
  },
};
```

> Se ESLint segnala import duplicati da `./types`, unire i nuovi tipi all'import esistente in cima al file.

- [ ] **Step 4: Eseguire i test e verificarne il successo**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-admin-dashboard && npm test`
Expected: PASS — test `locationsApi`/`locationInfoApi` verdi.

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: nessun errore.

- [ ] **Step 6: Commit**

```bash
git add src/lib/api.ts src/lib/api.locations.test.ts
git commit -m "feat(dashboard): locations API layer + regression tests"
```

---

## Phase 4 — Edge Function `locations` (shaping testato)

### Task 7: Funzione pura di shaping + test (TDD)

**Files:**
- Create: `mdv-admin-dashboard/supabase/functions/_shared/locations-shape.ts`
- Create: `mdv-admin-dashboard/supabase/functions/_shared/locations-shape.test.ts`

- [ ] **Step 1: Scrivere il test che fallisce**

```ts
// supabase/functions/_shared/locations-shape.test.ts
import { describe, it, expect } from 'vitest';
import { shapeLocations } from './locations-shape';

describe('shapeLocations', () => {
  it('ordina le info per position e applica la regola immagini (1=stringa, >1=array, 0=null)', () => {
    const rows = [{
      id: 1, slug: 'madonna-dc', name: 'Santuario', address: 'Cassano', latitude: 39.79, longitude: 16.32, intro: 'Intro',
      location_info: [
        { id: 2, title: 'B', body: '<p>b</p>', images: ['u1', 'u2'], position: 1 },
        { id: 1, title: 'A', body: '<p>a</p>', images: ['only'], position: 0 },
        { id: 3, title: 'C', body: '<p>c</p>', images: [], position: 2 },
      ],
    }];
    const out = shapeLocations(rows, 'it');
    expect(out.groups).toHaveLength(1);
    const g = out.groups[0];
    expect(g.key).toBe('madonna-dc');
    expect(g.title).toBe('Santuario');
    expect(g.sections[0].title).toBe('A');           // ordinata per position
    expect(g.sections[0].image.url).toBe('only');     // 1 immagine -> stringa
    expect(g.sections[1].image.url).toEqual(['u1', 'u2']); // >1 -> array
    expect(g.sections[2].image.url).toBeNull();       // 0 -> null
    expect(out.main.caption).toBe('Intro');
  });

  it('ritorna struttura vuota coerente senza righe', () => {
    const out = shapeLocations([], 'it');
    expect(out.groups).toEqual([]);
    expect(out.main.caption).toBe('');
  });
});
```

- [ ] **Step 2: Eseguire i test e verificarne il fallimento**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-admin-dashboard && npm test`
Expected: FAIL — modulo `locations-shape` mancante.

- [ ] **Step 3: Implementare lo shaping puro**

```ts
// supabase/functions/_shared/locations-shape.ts
// Funzione pura: trasforma le righe DB nella forma consumata da webapp + mobile.
// Tipi "loose" perché condivisa tra Deno (runtime) e Vitest (test).

interface InfoRow { id: number; title: string | null; body: string; images: string[] | null; position: number; }
interface LocationRow {
  id: number; slug: string; name: string; address?: string | null;
  latitude?: number | null; longitude?: number | null; intro?: string | null;
  location_info?: InfoRow[];
}

export function imageUrlValue(images: string[] | null | undefined): string | string[] | null {
  if (!images || images.length === 0) return null;
  return images.length === 1 ? images[0] : images;
}

export function shapeLocations(rows: LocationRow[], _lang: string) {
  const groups = (rows || []).map((loc) => ({
    key: loc.slug,
    title: loc.name,
    address: loc.address ?? null,
    latitude: loc.latitude ?? null,
    longitude: loc.longitude ?? null,
    sections: (loc.location_info || [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((info) => ({
        title: info.title,
        body: info.body,
        image: { url: imageUrlValue(info.images) },
      })),
  }));
  return {
    header: { title: groups.length ? 'Attività e missioni' : '' },
    main: { caption: rows && rows[0] ? (rows[0].intro || '') : '' },
    groups,
  };
}
```

- [ ] **Step 4: Eseguire i test e verificarne il successo**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-admin-dashboard && npm test`
Expected: PASS — test shaping verdi.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/_shared/locations-shape.ts supabase/functions/_shared/locations-shape.test.ts
git commit -m "feat(edge): tested pure shaping for locations response"
```

### Task 8: Edge Function che usa lo shaping

**Files:**
- Create: `mdv-admin-dashboard/supabase/functions/locations/index.ts`

- [ ] **Step 1: Creare la function**

```ts
// Locations API - GET /locations?lang=it  (lettura pubblica per webapp + mobile)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { shapeLocations } from "../_shared/locations-shape.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const lang = url.searchParams.get("lang") || "it";
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    const { data, error } = await supabaseClient
      .from("locations")
      .select(`id, slug, name, lang, address, latitude, longitude, cover_image, intro, position,
        location_info ( id, title, body, images, position )`)
      .eq("lang", lang)
      .eq("is_published", true)
      .order("position", { ascending: true });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const response = shapeLocations(data ?? [], lang);
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error", message: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
```

- [ ] **Step 2: Deploy**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-admin-dashboard && supabase functions deploy locations`
Expected: deploy ok. (Se serve: `supabase login` + `supabase link --project-ref <ref>`.)

- [ ] **Step 3: Verifica via curl**

Run: `curl -s "<SUPABASE_URL>/functions/v1/locations?lang=it" -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>"`
Expected: JSON con `groups[]`, ogni gruppo con `key`, `title`, `sections[].image.url` valorizzato.

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/locations/index.ts
git commit -m "feat(edge): locations read function using shared shaping"
```

---

## Phase 5 — Dashboard UI: gestione "Luoghi"

### Task 9: Pagina lista "Luoghi"

**Files:**
- Create: `mdv-admin-dashboard/src/pages/locations/LocationList.tsx`

- [ ] **Step 1: Creare la lista**

```tsx
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { locationsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';

const LANGS = ['it', 'en', 'es'];

export function LocationList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [lang, setLang] = useState('it');

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations', lang],
    queryFn: () => locationsApi.getAll(lang),
  });

  const del = useMutation({
    mutationFn: (id: number) => locationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({ title: 'Eliminato', description: 'Luogo eliminato' });
    },
    onError: (e: Error) => toast({ title: 'Errore', description: e.message, variant: 'destructive' }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brown-900">Luoghi</h1>
          <p className="text-muted-foreground mt-1">Santuari, attività e info ricorrenti</p>
        </div>
        <Button onClick={() => navigate('/locations/new')} className="bg-brown-600 hover:bg-brown-700">
          <Plus className="mr-2 h-4 w-4" /> Nuovo Luogo
        </Button>
      </div>

      <div className="flex gap-2">
        {LANGS.map((l) => (
          <Button key={l} variant={l === lang ? 'default' : 'outline'} size="sm" onClick={() => setLang(l)}>
            {l.toUpperCase()}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Caricamento...</p>
      ) : locations.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">Nessun luogo per "{lang}".</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {locations.map((loc) => (
            <Card key={loc.id} className="shadow-sm">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-brown-600" />
                  <div>
                    <p className="font-semibold text-brown-900">{loc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {loc.slug} · {loc.location_info?.length ?? 0} info{loc.is_published ? '' : ' · bozza'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/locations/${loc.id}`)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (confirm(`Eliminare "${loc.name}"?`)) del.mutate(loc.id); }}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check** — `npx tsc --noEmit` → nessun errore.

- [ ] **Step 3: Commit**

```bash
git add src/pages/locations/LocationList.tsx
git commit -m "feat(dashboard): location list page"
```

### Task 10: Pagina create/edit "Luogo" con info e upload immagini

**Files:**
- Create: `mdv-admin-dashboard/src/pages/locations/LocationEdit.tsx`

- [ ] **Step 1: Creare la pagina**

```tsx
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { locationsApi, locationInfoApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Plus, Trash2, Upload } from 'lucide-react';
import type { LocationInfo } from '@/lib/types';

const schema = z.object({
  name: z.string().min(1, 'Nome richiesto'),
  slug: z.string().min(1, 'Slug richiesto').regex(/^[a-z0-9-]+$/, 'Solo minuscole, numeri e trattini'),
  lang: z.string().min(2),
  address: z.string().optional(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  intro: z.string().optional(),
  is_published: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export function LocationEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [infos, setInfos] = useState<Array<Partial<LocationInfo>>>([]);

  const { data: location } = useQuery({
    queryKey: ['location', id],
    queryFn: () => locationsApi.getById(Number(id)),
    enabled: isEdit,
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { lang: 'it', is_published: true },
  });
  const isPublished = watch('is_published');

  useEffect(() => {
    if (location) {
      setValue('name', location.name);
      setValue('slug', location.slug);
      setValue('lang', location.lang);
      setValue('address', location.address || '');
      setValue('latitude', location.latitude);
      setValue('longitude', location.longitude);
      setValue('intro', location.intro || '');
      setValue('is_published', location.is_published);
      setInfos((location.location_info || []).slice().sort((a, b) => a.position - b.position));
    }
  }, [location, setValue]);

  const save = useMutation({
    mutationFn: async (data: FormData) => {
      const loc = isEdit ? await locationsApi.update(Number(id), data) : await locationsApi.create(data);
      const existing = location?.location_info || [];
      for (const e of existing) await locationInfoApi.delete(e.id);
      for (let i = 0; i < infos.length; i++) {
        await locationInfoApi.create(loc.id, {
          title: infos[i].title ?? null, body: infos[i].body ?? '', images: infos[i].images ?? [], position: i,
        });
      }
      return loc;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({ title: 'Salvato', description: 'Luogo salvato' });
      navigate('/locations');
    },
    onError: (e: Error) => toast({ title: 'Errore', description: e.message, variant: 'destructive' }),
  });

  const addInfo = () => setInfos((p) => [...p, { title: '', body: '', images: [] }]);
  const removeInfo = (i: number) => setInfos((p) => p.filter((_, idx) => idx !== i));
  const setInfoField = (i: number, field: 'title' | 'body', val: string) =>
    setInfos((p) => p.map((info, idx) => (idx === i ? { ...info, [field]: val } : info)));

  const uploadToInfo = async (i: number, file: File) => {
    try {
      const slug = watch('slug') || 'misc';
      const url = await locationsApi.uploadImage(file, slug);
      setInfos((p) => p.map((info, idx) => (idx === i ? { ...info, images: [...(info.images || []), url] } : info)));
      toast({ title: 'Caricata', description: 'Immagine caricata' });
    } catch (e) {
      toast({ title: 'Errore upload', description: (e as Error).message, variant: 'destructive' });
    }
  };
  const removeImage = (i: number, url: string) =>
    setInfos((p) => p.map((info, idx) => (idx === i ? { ...info, images: (info.images || []).filter((u) => u !== url) } : info)));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/locations')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-3xl font-bold text-brown-900">{isEdit ? 'Modifica' : 'Nuovo'} Luogo</h1>
      </div>

      <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Dati del luogo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" {...register('name')} placeholder="Es. Santuario Madonna della Catena" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" {...register('slug')} placeholder="madonna-dc" />
                {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lang">Lingua *</Label>
                <Input id="lang" {...register('lang')} placeholder="it" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Indirizzo</Label>
              <Input id="address" {...register('address')} placeholder="Cassano all'Ionio (CS)" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitudine</Label>
                <Input id="latitude" type="number" step="any" {...register('latitude')} placeholder="39.79" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitudine</Label>
                <Input id="longitude" type="number" step="any" {...register('longitude')} placeholder="16.32" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="intro">Introduzione</Label>
              <Textarea id="intro" {...register('intro')} rows={3} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isPublished} onCheckedChange={(v) => setValue('is_published', v)} />
              <Label className="cursor-pointer">Pubblicato</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Info / Sezioni</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addInfo}><Plus className="mr-1 h-4 w-4" /> Aggiungi</Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {infos.length === 0 && <p className="text-sm text-muted-foreground">Nessuna sezione.</p>}
            {infos.map((info, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sezione {i + 1}</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeInfo(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
                <Input value={info.title || ''} onChange={(e) => setInfoField(i, 'title', e.target.value)} placeholder="Titolo (opzionale)" />
                <Textarea value={info.body || ''} onChange={(e) => setInfoField(i, 'body', e.target.value)} rows={5} placeholder="Contenuto HTML (es. <ul><li>...</li></ul>)" />
                <div className="flex flex-wrap gap-2">
                  {(info.images || []).map((url) => (
                    <div key={url} className="relative">
                      <img src={url} alt="" className="h-16 w-16 object-cover rounded border" />
                      <button type="button" onClick={() => removeImage(i, url)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
                    </div>
                  ))}
                </div>
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer text-brown-700">
                  <Upload className="h-4 w-4" /> Carica immagine
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadToInfo(i, f); e.target.value = ''; }} />
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={save.isPending} className="bg-brown-600 hover:bg-brown-700">
            <Save className="mr-2 h-4 w-4" /> {save.isPending ? 'Salvataggio...' : 'Salva'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/locations')}>Annulla</Button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Type-check** — `npx tsc --noEmit` → nessun errore.

- [ ] **Step 3: Commit**

```bash
git add src/pages/locations/LocationEdit.tsx
git commit -m "feat(dashboard): location create/edit page with info + image upload"
```

### Task 11: Route e voce di menu

**Files:**
- Modify: `mdv-admin-dashboard/src/App.tsx`
- Modify: `mdv-admin-dashboard/src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Import + route in `App.tsx`**

Dopo l'import di `SeedCreate` (riga 13):

```tsx
import { LocationList } from '@/pages/locations/LocationList';
import { LocationEdit } from '@/pages/locations/LocationEdit';
```

Dentro `<Route element={<AdminLayout />}>`, dopo le route `/seeds*` (riga 75):

```tsx
              <Route path="/locations" element={<LocationList />} />
              <Route path="/locations/new" element={<LocationEdit />} />
              <Route path="/locations/:id" element={<LocationEdit />} />
```

- [ ] **Step 2: Voce in `Sidebar.tsx`**

Aggiungere `MapPin` all'import `lucide-react` (riga 2-8) e all'array `navigation` (riga 17-22):

```tsx
  { name: 'Luoghi', href: '/locations', icon: MapPin },
```

- [ ] **Step 3: Build + test**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-admin-dashboard && npm run build && npm test`
Expected: build ok, tutti i test verdi.

- [ ] **Step 4: Run visivo**

Run: `npm run dev` → login → "Luoghi": mostra le location migrate (`it`); apri una location (info + immagini); modifica un titolo e salva; ricarica e verifica persistenza.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/layout/Sidebar.tsx
git commit -m "feat(dashboard): wire locations routes + sidebar entry"
```

---

## Phase 6 — Webapp: consumo da Supabase

### Task 12: Variabili d'ambiente Supabase nella webapp

**Files:**
- Modify: `mdv-webapp/.env`, `mdv-webapp/.env.production`

- [ ] **Step 1: Aggiungere le variabili**

In `.env` e `.env.production`:

```
VUE_APP_SUPABASE_URL=https://<project>.supabase.co
VUE_APP_SUPABASE_ANON_KEY=<anon-key>
```

- [ ] **Step 2: Verifica** — `grep -c "VUE_APP_SUPABASE" .env` → `2`.

- [ ] **Step 3: Commit** (committare solo i file tracciati; `.env` può essere gitignored)

```bash
git add .env.production
git commit -m "chore(webapp): add Supabase env vars"
```

### Task 13: Service di lettura location

**Files:**
- Create: `mdv-webapp/src/services/locationsApi.js`

- [ ] **Step 1: Creare il service**

```js
// src/services/locationsApi.js
const SUPABASE_URL = process.env.VUE_APP_SUPABASE_URL;
const ANON_KEY = process.env.VUE_APP_SUPABASE_ANON_KEY;

export async function fetchLocations(lang = 'it') {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/locations?lang=${encodeURIComponent(lang)}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`Errore caricamento location: HTTP ${res.status}`);
  return res.json();
}
```

- [ ] **Step 2: Lint** — `npx eslint src/services/locationsApi.js` → nessun errore.

- [ ] **Step 3: Commit**

```bash
git add src/services/locationsApi.js
git commit -m "feat(webapp): locations service reading from Supabase edge function"
```

### Task 14: `loadPage` legge attività da Supabase, resto da JSON locale

**Files:**
- Modify: `mdv-webapp/src/store/modules/page/actions.js`

- [ ] **Step 1: Sostituire il contenuto**

```js
import data from '@/assets/data/data.json';
import { fetchLocations } from '@/services/locationsApi';

export default {
    async loadPage(context, page) {
        const lang = localStorage.getItem('lang') || 'it';
        if (page === 'attivita') {
            const responseData = await fetchLocations(lang);
            context.commit('setPage', { data: responseData, page });
            return;
        }
        const localData = data[lang] && data[lang][page];
        if (!localData) {
            throw new Error(`Contenuto non trovato per pagina "${page}" lingua "${lang}"`);
        }
        context.commit('setPage', { data: localData, page });
    },
    async changeLang(context, payload) {
        localStorage.setItem('lang', '' + payload.lang);
        context.commit('setNavbar', payload.lang);
        context.commit('setFooter', payload.lang);
        await context.dispatch('loadPage', payload.route);
    }
};
```

- [ ] **Step 2: Verifica delta contenuti statici in `data.json`**

Per ogni pagina non-attività (`chi-siamo`/`home`, `vocazione`, `contatti`, `approfondimenti`, `prega-con-noi`) e lingua, confrontare ciò che Firebase serviva con `data.json` e riconciliare nel file locale le eventuali modifiche più recenti.

Run (esempio): `curl -s "https://mdv-webapp-default-rtdb.europe-west1.firebasedatabase.app/pages/it/vocazione.json" > /tmp/fb-vocazione-it.json`
Confrontare con `data.it.vocazione` e aggiornare `data.json` se necessario.
Expected: `data.json` contiene la versione corrente di ogni pagina statica per `it`/`en`/`es`.

- [ ] **Step 3: Run visivo**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-webapp && npm run serve`
`/#/attivita` da Supabase (immagini Storage), pagine statiche dai JSON locali, cambio lingua ok.

- [ ] **Step 4: Commit**

```bash
git add src/store/modules/page/actions.js src/assets/data/data.json
git commit -m "feat(webapp): read attivita from Supabase, static pages from local JSON"
```

---

## Phase 7 — Webapp: cleanup (Firebase / Aruba / area riservata)

### Task 15: Rimuovere route e guard area riservata

**Files:**
- Modify: `mdv-webapp/src/router/index.js`

- [ ] **Step 1: Sostituire `router/index.js`**

```js
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/view/Home';
import Vocazione from '@/view/Vocazione';
import Attivita from '@/view/Attivita';
import Contatti from '@/view/Contatti';
import Approfondimenti from '@/view/Approfondimenti';
import PregaPerNoi from '@/view/PregaPerNoi';
import Links from '@/view/Links';

const routes = [
    { path: '/', name: 'chi-siamo', component: Home },
    { path: '/vocazione', name: 'vocazione', component: Vocazione },
    { path: '/attivita', name: 'attivita', component: Attivita },
    { path: '/contatti', name: 'contatti', component: Contatti },
    { path: '/approfondimenti', name: 'approfondimenti', component: Approfondimenti },
    { path: '/prega-con-noi', name: 'prega-con-noi', component: PregaPerNoi },
    { path: '/links', name: 'links', component: Links, meta: { standalone: true } },
    { path: '/:pathMatch(.*)*', component: Home },
];

const router = createRouter({ history: createWebHashHistory(), routes, scrollBehavior() { return { top: 0 }; } });
export default router
```

- [ ] **Step 2: Commit**

```bash
git add src/router/index.js
git commit -m "refactor(webapp): remove reserved-area routes and auth guard"
```

### Task 16: Rimuovere il modulo store `auth`

**Files:**
- Modify: `mdv-webapp/src/store/index.js`
- Delete: `mdv-webapp/src/store/modules/auth/`

- [ ] **Step 1: Ispezionare e ripulire `store/index.js`**

Run: `cd /c/dev/Workspace/local/workspace_web/mdv-webapp && cat src/store/index.js`
Rimuovere import e registrazione del modulo `auth`. Forma attesa (adattare ai nomi reali):

```js
import { createStore } from 'vuex';
import pageModule from './modules/page/index.js';
import blogModule from './modules/blog/index.js';

const store = createStore({ modules: { page: pageModule, blog: blogModule } });
export default store;
```

- [ ] **Step 2: Eliminare la cartella** — `rm -rf src/store/modules/auth`

- [ ] **Step 3: Riferimenti residui**

Run: `grep -rn "isAuthenticated\|modules/auth\|dispatch('login'\|dispatch('logout'" src/`
Expected: nessun risultato (o correggere i punti, es. link login in navbar).

- [ ] **Step 4: Commit**

```bash
git add src/store/index.js
git commit -m "refactor(webapp): remove auth store module"
```

### Task 17: Eliminare Firebase, attivitaApi e viste admin

**Files:**
- Delete: `src/firebase/`, `src/services/attivitaApi.js`, `src/view/admin/`, `src/view/Auth.vue`

- [ ] **Step 1: Cercare import prima di cancellare**

Run: `grep -rn "firebase/config\|services/attivitaApi\|view/admin\|view/Auth\|from 'firebase" src/`
Expected: riferimenti solo nei file da eliminare/già rimossi; correggere altri import (es. navbar) prima.

- [ ] **Step 2: Eliminare**

Run: `rm -rf src/firebase src/services/attivitaApi.js src/view/admin src/view/Auth.vue`

- [ ] **Step 3: Rimuovere la dipendenza firebase** — `npm uninstall firebase`

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build ok, nessun modulo mancante. Correggere link/route obsoleti in navbar se segnalati, poi ricostruire.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(webapp): remove Firebase, attivitaApi (PHP), admin views and dep"
```

---

## Phase 8 — Verifica finale, env e dismissione

### Task 18: Aggiornare `check-build-env.js`

**Files:**
- Modify: `mdv-webapp/check-build-env.js`

- [ ] **Step 1: Sostituire i check** (array `checks` riga 28-33 + check localhost)

```js
const checks = [
  { name: 'VUE_APP_SUPABASE_URL', expected: '.supabase.co' },
  { name: 'VUE_APP_API_BLOG_BASE_URL', expected: 'blogger' },
];
```

Rimuovere i check su `missionaridellavia.net/api/v1` e `VUE_APP_FIREBASE_DATABASE_URL`.

- [ ] **Step 2: Eseguire** — `npm run build && node check-build-env.js` → tutti i check passano.

- [ ] **Step 3: Commit**

```bash
git add check-build-env.js
git commit -m "chore(webapp): update build env checks for Supabase"
```

### Task 19: Verifica di parità end-to-end

**Files:** nessuno (verifica)

- [ ] **Step 1: Run + checklist (Network tab)**

Run: `npm run serve`
- `/#/attivita` carica da `/functions/v1/locations`; immagini dal dominio Storage Supabase.
- Nessuna chiamata a `firebaseio.com` o `missionaridellavia.net/api/v1/images.php`.
- Carousel: >1 immagine = carousel, 1 = singola.
- Pagine statiche ok in `it`/`en`/`es`.
- `/auth`, `/admin`, `/reserved-area/...` non esistono più (redirect Home).

- [ ] **Step 2: Aggiornare `CLAUDE.md` webapp** — sezione Backend/Attività: attività su Supabase (Edge Function `locations`), immagini su Storage, niente Firebase/Aruba/area riservata, gestione da dashboard; rimuovere env var non più usate.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(webapp): update CLAUDE.md for Supabase locations architecture"
```

### Task 20: Dismissione (solo dopo verifica in produzione)

**Files:** nessuno (operazioni esterne)

- [ ] **Step 1:** Disabilitare `images.php` + credenziali MySQL morte su Aruba.
- [ ] **Step 2:** Dopo osservazione, dismettere RTDB `pages/*` (mantenere backup export). Firebase Auth già dismesso.
- [ ] **Step 3:** Rimuovere env obsolete (`VUE_APP_FIREBASE_*`, `VUE_APP_API_BASE_URL`, `VUE_APP_API_KEY`) da `.env`/`.env.production`/hosting.
- [ ] **Step 4:** Rilascio guidato dal tag (vedi policy Phase 0): a versione verificata su `develop`, taggare `vX.Y.Z` in ciascun repo e promuovere `main` al commit taggato. Solo su richiesta esplicita.

---

## Self-Review (eseguito in fase di scrittura)

**Copertura spec:**
- §1-2 problema/obiettivo → Phase 6/7/8. ✓
- §2-bis north star (un pannello, UX semplice) → Phase 5 (dashboard CRUD), area riservata rimossa Phase 7. ✓
- §4 modello dati + associazione immagini per-sezione → Task 1, Task 7 (shaping). ✓
- §4 entità `events` → fuori scope (#2), nessun task: corretto. ✓
- §5 architettura → Phase 1/3/5/6. ✓
- §6 Edge Function → Task 7/8. ✓
- §7 migrazione + rischio immagini → Task 2/3 (fallback API→locale). ✓
- §8 validazione → Task 6/7/11/19. ✓
- §9 rischi (carousel, multilingua, delta data.json, due repo) → Task 7 (carousel testato), Task 3 (loop multilingua), Task 14 step 2 (delta), Phase 0 (branch). ✓
- §10 sequenza → Phase 1→8. ✓
- §11 DoD → Task 19. ✓
- **Richiesta test anti-regressione (dashboard + chi tocca i dati)** → Task 4 (Vitest), Task 6 (test `locationsApi`/`locationInfoApi`), Task 7 (test shaping), Task 2 (transform migrazione). ✓

**Placeholder scan:** nessun TODO/TBD; gli step di codice hanno contenuto reale. I punti "adattare ai nomi reali" (Task 16 store/index, Task 17 navbar) sono accompagnati da uno step `grep` che mostra come scoprirli — istruzioni di ispezione, non placeholder (questi file non sono stati letti in pianificazione).

**Consistenza tipi/nomi:** `Location`/`LocationInfo`/`LocationFormData`/`LocationInfoFormData` coerenti Task 5/6/10; `locationsApi`/`locationInfoApi` coerenti Task 6/9/10; bucket `location-media` coerente Task 1/3/6; campo `images TEXT[]` coerente Task 1/3/7; `shapeLocations`/`imageUrlValue` coerenti Task 7/8; forma `groups[].sections[].image.url` coerente tra Task 7 (shaping testato) e Task 14 (consumo webapp).
