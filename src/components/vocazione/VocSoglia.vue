<template>
  <div v-if="visibile" class="voc-soglia" aria-hidden="true"></div>
</template>

<script>
export default {
  name: 'VocSoglia',
  data() {
    return { visibile: true };
  },
  mounted() {
    // Il velo esiste solo per la durata del passaggio: dopo si smonta, cosi'
    // non resta un elemento a tutto schermo sopra la pagina. Si innesca sul
    // montaggio del layout, che avviene una volta sola entrando nella sezione.
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => { this.visibile = false; }, ridotto ? 0 : 900);
  },
};
</script>

<style scoped>
.voc-soglia {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background-color: var(--mdv-bruno-900);
  pointer-events: none;
  animation: voc-velo 900ms ease forwards;
}

@keyframes voc-velo {
  0%   { opacity: 0; }
  35%  { opacity: 1; }
  100% { opacity: 0; }
}
</style>
