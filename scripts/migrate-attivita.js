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
  } catch (e) { void e; /* fallback */ }
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
