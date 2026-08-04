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
