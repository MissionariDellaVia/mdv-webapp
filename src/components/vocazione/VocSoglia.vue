<template>
  <div class="voc-soglia" aria-hidden="true"></div>
</template>

<script>
import { SOGLIA_MS } from '@/utility/tempiTransizione.mjs';

// Velo che copre il momento in cui il sito cambia atmosfera.
//
// La sequenza, dal clic:
//   0 →  180ms  il velo sale sulla pagina che sta uscendo
// 180 →  520ms  velo fermo: sotto, la pagina vecchia finisce di uscire,
//               il fondo diventa scuro e la sezione si monta
// 520 → 1200ms  il velo si alza e sotto c'e' gia' tutto, con la sua
//               animazione di entrata in corso
//
// L'ordine conta: se il velo salisse dopo che la sezione e' comparsa, si
// vedrebbe il titolo apparire, sparire e riapparire. E' il motivo per cui
// questo componente vive in App e non dentro il layout della sezione:
// dentro, sarebbe entrato in scena insieme alla pagina che deve coprire.
export default {
  name: 'VocSoglia',
  emits: ['finita'],
  mounted() {
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.timer = setTimeout(() => this.$emit('finita'), ridotto ? 0 : SOGLIA_MS);
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
};
</script>

<style scoped>
.voc-soglia {
  position: fixed;
  inset: 0;
  /* Sotto la navbar fixed-top di Bootstrap, che sta a 1030: coprirla la
     farebbe sparire e riapparire, ed e' un altro scatto. */
  z-index: 1020;
  pointer-events: none;
  background:
    radial-gradient(70% 55% at 50% 45%, var(--voc-alone) 0%, transparent 70%),
    var(--voc-notte);
  animation: voc-velo var(--mdv-soglia) var(--mdv-curva-morbida) forwards;
}

@keyframes voc-velo {
  0%   { opacity: 0; }
  15%  { opacity: 1; }
  43%  { opacity: 1; }
  100% { opacity: 0; }
}
</style>
