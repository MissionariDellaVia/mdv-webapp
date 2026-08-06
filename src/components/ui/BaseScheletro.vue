<template>
  <span
    class="scheletro"
    :class="{ 'scheletro--tondo': tondo }"
    :style="{ width: larghezza, height: altezza }"
    aria-hidden="true"
  ></span>
</template>

<script>
// La sagoma di quello che sta arrivando.
//
// Al posto della rotella che gira in mezzo allo schermo: una rotella dice
// solo "aspetta", una sagoma dice anche "aspetta questo, e sara' grande
// cosi'". Quando il contenuto arriva prende esattamente il posto che la
// sagoma teneva, quindi la pagina non salta.
export default {
  name: 'BaseScheletro',
  props: {
    larghezza: { type: String, default: '100%' },
    altezza: { type: String, default: '1rem' },
    tondo: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.scheletro {
  display: block;
  border-radius: var(--mdv-raggio-s);
  background-color: var(--mdv-fondo-campo);
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--mdv-bianco) 65%, transparent) 50%,
    transparent 100%
  );
  background-size: 40% 100%;
  background-repeat: no-repeat;
  animation: scheletro-luce 1.4s ease-in-out infinite;
}
.scheletro--tondo {
  border-radius: 50%;
}

/* Una luce che attraversa da sinistra a destra: dice che qualcosa si sta
   muovendo, senza far girare niente. */
@keyframes scheletro-luce {
  from { background-position: -60% 0; }
  to   { background-position: 160% 0; }
}

/* Ferma, la sagoma comunica lo stesso: e' li' e ha la forma giusta. */
@media (prefers-reduced-motion: reduce) {
  .scheletro {
    background-image: none;
  }
}
</style>
