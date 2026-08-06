// Durata dell'uscita di pagina. Deve restare uguale a --mdv-uscita-pagina
// in src/assets/css/tokens.css: un test lo verifica, perche' se i due
// valori divergono il salto in cima torna a vedersi.
export const USCITA_PAGINA_MS = 260;

// Durata complessiva del velo di soglia, dal clic al velo alzato. Deve
// restare uguale a --mdv-soglia in tokens.css: e' il CSS ad animarlo, il
// JavaScript deve solo sapere quando smontarlo.
export const SOGLIA_MS = 1200;

// Il ritorno in cima si fa poco prima che l'uscita finisca: a quel punto
// la pagina vecchia e' quasi trasparente e la nuova non e' ancora
// montata, quindi il salto avviene su uno schermo che nessuno guarda.
export const RITARDO_SCROLL_MS = USCITA_PAGINA_MS - 60;

// Sposta la pagina, ma solo dopo l'uscita. Restituire una promessa e' il
// modo previsto da vue-router per ritardare lo scroll.
export function scrollDifferito(destinazione, attendi = RITARDO_SCROLL_MS) {
  return new Promise((risolvi) => {
    setTimeout(() => risolvi(destinazione), attendi);
  });
}
