<template>
  <div v-if="visibile" class="voc-soglia" aria-hidden="true"></div>
</template>

<script>
// Durata complessiva del passaggio: il velo si dissolve da solo, il timer
// serve solo a smontarlo perche' non resti un elemento a tutto schermo.
const DURATA = 1400;

export default {
  name: 'VocSoglia',
  data() {
    return { visibile: true };
  },
  mounted() {
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.timer = setTimeout(() => { this.visibile = false; }, ridotto ? 0 : DURATA);
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
};
</script>

<style scoped>
/* Il velo ha lo stesso colore del fondo che trovera' sotto di se': quando
   si dissolve non "scopre" un'altra pagina, sembra che il colore si sia
   posato sullo sfondo. E' questo a far sentire il passaggio di atmosfera,
   non il lampo. */
.voc-soglia {
  position: fixed;
  inset: 0;
  /* Sotto la navbar fixed-top di Bootstrap, che sta a 1030: coprirla la
     faceva sparire e riapparire, ed e' uno degli scatti che si vedono. */
  z-index: 1020;
  pointer-events: none;
  background:
    radial-gradient(70% 55% at 50% 45%, var(--voc-alone) 0%, transparent 70%),
    var(--voc-fondo);
  animation: voc-velo 1400ms ease forwards;
}

@keyframes voc-velo {
  0%   { opacity: 0; }
  26%  { opacity: 1; }
  50%  { opacity: 1; }
  100% { opacity: 0; }
}
</style>
