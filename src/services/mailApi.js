// src/services/mailApi.js
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Stesso avviso di locationsApi.js: senza configurazione l'errore di rete
// nascondeva un .env mancante.
function verificaConfigurazione() {
  const mancanti = [];
  if (!SUPABASE_URL) mancanti.push('VITE_SUPABASE_URL');
  if (!ANON_KEY) mancanti.push('VITE_SUPABASE_ANON_KEY');
  if (!mancanti.length) return;
  throw new Error(
    `Configurazione Supabase assente: ${mancanti.join(', ')}. `
    + 'Copiare .env.example in .env e riempirlo con i valori veri.',
  );
}

export async function inviaMessaggioContatti({ nome, cognome, mail, message }) {
  verificaConfigurazione();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-mail`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome, cognome, mail, message }),
  });
  const dati = await res.json();
  if (!res.ok || !dati.sent) {
    throw new Error(dati.message || `Errore invio messaggio: HTTP ${res.status}`);
  }
  return dati;
}
