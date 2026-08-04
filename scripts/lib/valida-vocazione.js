// scripts/lib/valida-vocazione.js
// Verifica la struttura di vocazione.json: i refusi nel contenuto sono
// l'errore realistico su un sito editoriale, non i bug di logica.
const TIPI_BLOCCO = ['prosa', 'elenco', 'segni', 'passi', 'riflessioni', 'testimonianze', 'rimandi'];
const SEZIONI = ['hub', 'percorsi', 'domande', 'proposta'];

function validaBlocchi(blocchi, percorsoTesto, opzioni, errori) {
  (blocchi || []).forEach((blocco, i) => {
    const dove = `${percorsoTesto}[${i}]`;
    if (!TIPI_BLOCCO.includes(blocco.tipo)) {
      errori.push(`${dove}: tipo sconosciuto "${blocco.tipo}"`);
      return;
    }
    if (blocco.tipo === 'rimandi') {
      (blocco.voci || []).forEach((voce, j) => {
        if (!opzioni.rotteNote.includes(voce.rotta)) {
          errori.push(`${dove}.voci[${j}]: rotta inesistente "${voce.rotta}"`);
        }
      });
    }
    if (blocco.tipo === 'testimonianze') {
      (blocco.voci || []).forEach((voce, j) => {
        if (voce.foto && !opzioni.immagineEsiste(voce.foto)) {
          errori.push(`${dove}.voci[${j}]: immagine assente "${voce.foto}"`);
        }
      });
    }
  });
}

function validaIntestazione(header, dove, opzioni, errori) {
  if (header && header.immagine && !opzioni.immagineSitoEsiste(header.immagine)) {
    errori.push(`${dove}.immagine: immagine assente "${header.immagine}"`);
  }
}

function validaContenuto(contenuto, opzioni) {
  const errori = [];
  for (const sezione of SEZIONI) {
    if (!contenuto[sezione]) errori.push(`manca la sezione "${sezione}"`);
  }
  if (errori.length) return errori;

  validaIntestazione(contenuto.hub.header, 'hub.header', opzioni, errori);
  validaIntestazione(contenuto.proposta.header, 'proposta.header', opzioni, errori);

  for (const [nome, percorso] of Object.entries(contenuto.percorsi)) {
    validaIntestazione(percorso.header, `percorsi.${nome}.header`, opzioni, errori);
    validaBlocchi(percorso.blocchi, `percorsi.${nome}.blocchi`, opzioni, errori);
  }
  validaBlocchi(contenuto.proposta.blocchi, 'proposta.blocchi', opzioni, errori);

  (contenuto.hub.porte || []).forEach((porta, i) => {
    if (!opzioni.rotteNote.includes(porta.rotta)) {
      errori.push(`hub.porte[${i}]: rotta inesistente "${porta.rotta}"`);
    }
  });

  contenuto.domande.forEach((d, i) => {
    if (!d.domanda || !d.risposta) errori.push(`domande[${i}]: domanda o risposta mancante`);
  });

  return errori;
}

module.exports = { validaContenuto, TIPI_BLOCCO };
