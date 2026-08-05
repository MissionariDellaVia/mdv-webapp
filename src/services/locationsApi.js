// src/services/locationsApi.js
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Senza configurazione l'indirizzo diventava "undefined/functions/v1/..."
// e in console compariva un errore di rete: sembrava un server irraggiungibile,
// invece era il .env che non c'era. Meglio dirlo.
function verificaConfigurazione() {
  const mancanti = [];
  if (!SUPABASE_URL) mancanti.push('VITE_SUPABASE_URL');
  if (!ANON_KEY) mancanti.push('VITE_SUPABASE_ANON_KEY');
  if (!mancanti.length) return;
  throw new Error(
    `Configurazione Supabase assente: ${mancanti.join(', ')}. `
    + 'Copiare .env.example in .env e riempirlo con i valori veri: '
    + 'senza, "attivita" e "contatti" restano vuote.',
  );
}

export async function fetchLocations(lang = 'it') {
  verificaConfigurazione();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/locations?lang=${encodeURIComponent(lang)}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`Errore caricamento location: HTTP ${res.status}`);
  return res.json();
}
