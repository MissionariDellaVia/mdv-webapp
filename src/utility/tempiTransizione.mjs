// Durata dell'uscita di pagina. Deve restare uguale a --mdv-uscita-pagina
// in src/assets/css/tokens.css: un test lo verifica, perche' se i due
// valori divergono il salto in cima torna a vedersi.
export const USCITA_PAGINA_MS = 260;

// Il ritorno in cima si fa poco prima che l'uscita finisca: a quel punto
// la pagina vecchia e' quasi trasparente e la nuova non e' ancora
// montata, quindi il salto avviene su uno schermo che nessuno guarda.
export const RITARDO_SCROLL_MS = USCITA_PAGINA_MS - 60;

// Riporta la pagina in cima, ma solo dopo l'uscita. Restituire una
// promessa e' il modo previsto da vue-router per ritardare lo scroll.
export function scrollDifferitoInCima(attendi = RITARDO_SCROLL_MS) {
  return new Promise((risolvi) => {
    setTimeout(() => risolvi({ top: 0 }), attendi);
  });
}
