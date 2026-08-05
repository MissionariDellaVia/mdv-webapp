import { inVocazione } from './inVocazione.mjs';

// Il velo di soglia serve a coprire il momento in cui il sito cambia
// atmosfera. Ha senso una volta sola: entrando nella sezione da fuori.
//
// Non si alza muovendosi dentro la sezione (l'atmosfera e' gia' quella) e
// non si alza al primo caricamento (non c'e' nessuna pagina precedente da
// coprire: la pagina nasce gia' scura).
export function attraversaSoglia(percorsoDa, percorsoA) {
  if (typeof percorsoDa !== 'string' || typeof percorsoA !== 'string') return false;
  if (percorsoDa === percorsoA) return false;
  return !inVocazione(percorsoDa) && inVocazione(percorsoA);
}
