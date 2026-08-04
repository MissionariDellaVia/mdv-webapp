// scripts/lib/style-guard.js
// Estrae i valori visivi scritti a mano in un Single File Component.
// Guarda solo <style> e <script>: nel <template> "#pills-home" e simili
// sono selettori o ancore, non colori.
const RE_BLOCCHI = /<(style|script)\b[\s\S]*?<\/\1>/g;
const RE_COLORE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g;
const RE_FONT = /font-family:\s*'[^']+'/g;

function estraiValoriVisivi(contenuto) {
  const blocchi = (contenuto.match(RE_BLOCCHI) || []).join('\n');
  return [...(blocchi.match(RE_COLORE) || []), ...(blocchi.match(RE_FONT) || [])];
}

module.exports = { estraiValoriVisivi };
