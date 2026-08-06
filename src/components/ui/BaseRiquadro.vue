<template>
  <article :class="['riquadro', { 'riquadro--reattivo': reattivo }]">
    <slot name="immagine" />

    <header v-if="$slots.testata" class="riquadro__testata">
      <slot name="testata" />
    </header>

    <div class="riquadro__corpo">
      <slot />
    </div>
  </article>
</template>

<script>
// Il riquadro condiviso del sito.
//
// Quattro componenti disegnavano la stessa cosa per conto proprio, ognuno
// azzerando il bordo di Bootstrap e ridisegnando la stessa fascia scura in
// testa: cambiare l'aspetto di una scheda voleva dire aprirne quattro e
// ricordarsi di tutti. Qui la forma sta in un posto solo; i componenti
// mettono dentro il contenuto e scelgono se reagire al passaggio.
//
// Non usa le classi .card di Bootstrap: la forma e' nostra e sta nei
// token, e questo e' anche il primo pezzo che si stacca dal framework.
export default {
  name: 'BaseRiquadro',
  props: {
    // Si solleva al passaggio del mouse. Va acceso dove il riquadro
    // e' cliccabile, non ovunque: se si muove tutto, non si muove niente.
    reattivo: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.riquadro {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--mdv-raggio-s);
  background-color: var(--mdv-bianco);
  color: var(--mdv-bruno-900);
  font-family: var(--mdv-font-corpo);
}

.riquadro--reattivo {
  transition:
    transform 320ms var(--mdv-curva-morbida),
    box-shadow 320ms ease;
}

/* La fascia porta un titolo, e la misura era quella di "fs-3" — una
   classe di Bootstrap. Sparito il framework i titoli erano scesi alla
   grandezza del testo normale: adesso la misura sta qui. */
.riquadro__testata {
  padding: var(--mdv-spazio-3) var(--mdv-spazio-4);
  background-color: var(--mdv-bruno-900-velato);
  color: var(--mdv-bianco);
  font-family: var(--mdv-font-corpo);
  font-size: var(--mdv-testo-xl);
  line-height: 1.3;
  text-align: center;
}

.riquadro__corpo {
  flex: 1 1 auto;
  padding: var(--mdv-spazio-4);
}

.riquadro :deep(img) {
  display: block;
  max-width: 100%;
}

@media (hover: hover) {
  .riquadro--reattivo:hover {
    transform: translateY(-4px);
    box-shadow: 0 0.75rem 2rem var(--mdv-ombra-lieve);
  }
}
</style>
