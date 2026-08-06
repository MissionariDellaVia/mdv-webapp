// src/utility/vocStorage.mjs
// Unico punto d'accesso a localStorage per la sezione vocazionale.
// Se il deposito non e' utilizzabile (navigazione privata, quota esaurita,
// permessi negati) degrada in memoria volatile: l'interazione continua a
// funzionare per la sessione e non vengono mai propagate eccezioni.
const PREFISSO = 'mdv.voc';

const chiave = (percorso, ambito) => `${PREFISSO}.${percorso}.${ambito}`;

export function creaVocStorage(deposito) {
  const memoria = new Map();

  const leggi = (percorso, ambito, predefinito) => {
    const k = chiave(percorso, ambito);
    try {
      const grezzo = deposito ? deposito.getItem(k) : null;
      if (grezzo !== null && grezzo !== undefined) return JSON.parse(grezzo);
    } catch (e) {
      void e; // deposito non disponibile o valore corrotto: si ripiega sulla memoria
    }
    return memoria.has(k) ? memoria.get(k) : predefinito;
  };

  const scrivi = (percorso, ambito, valore) => {
    const k = chiave(percorso, ambito);
    memoria.set(k, valore);
    try {
      if (deposito) deposito.setItem(k, JSON.stringify(valore));
    } catch (e) {
      void e; // scrittura impossibile: il valore resta almeno in memoria
    }
  };

  const cancella = (percorso) => {
    const prefisso = `${PREFISSO}.${percorso}.`;
    for (const k of [...memoria.keys()]) {
      if (k.startsWith(prefisso)) memoria.delete(k);
    }
    try {
      if (!deposito) return;
      const daTogliere = [];
      for (let i = 0; i < deposito.length; i += 1) {
        const k = deposito.key(i);
        if (k && k.startsWith(prefisso)) daTogliere.push(k);
      }
      daTogliere.forEach((k) => deposito.removeItem(k));
    } catch (e) {
      void e;
    }
  };

  return { leggi, scrivi, cancella };
}

const depositoBrowser = (() => {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch (e) {
    void e;
    return null;
  }
})();

export const vocStorage = creaVocStorage(depositoBrowser);
