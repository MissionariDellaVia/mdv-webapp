<template>
  <div class="voc-carosello">
    <div ref="pista" class="voc-carosello__pista" @scroll.passive="aggiorna">
      <slot />
    </div>

    <div v-if="totale > 1" class="voc-carosello__comandi">
      <button
        type="button"
        class="voc-carosello__freccia"
        :disabled="corrente === 0"
        aria-label="Precedente"
        @click="scorri(-1)"
      >←</button>

      <ol class="voc-carosello__punti">
        <li v-for="i in totale" :key="i">
          <button
            type="button"
            :class="['voc-carosello__punto', { 'voc-carosello__punto--attivo': i - 1 === corrente }]"
            :aria-label="`Vai a ${i} di ${totale}`"
            :aria-current="i - 1 === corrente ? 'true' : null"
            @click="vaiA(i - 1)"
          ></button>
        </li>
      </ol>

      <button
        type="button"
        class="voc-carosello__freccia"
        :disabled="corrente >= totale - 1"
        aria-label="Successivo"
        @click="scorri(1)"
      >→</button>
    </div>
  </div>
</template>

<script>
// Slider costruito su scroll-snap invece che su una libreria: il
// trascinamento col dito e' quello nativo del browser, la tastiera
// funziona senza aggiunte e non c'e' una dipendenza in piu' da
// aggiornare. Le frecce sono comodita', non il meccanismo.
export default {
  name: 'VocCarosello',
  data() {
    return { corrente: 0, totale: 0 };
  },
  mounted() {
    this.contaSchede();
    window.addEventListener('resize', this.contaSchede);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.contaSchede);
  },
  methods: {
    contaSchede() {
      const pista = this.$refs.pista;
      this.totale = pista ? pista.children.length : 0;
      this.aggiorna();
    },
    passo() {
      const pista = this.$refs.pista;
      const prima = pista && pista.children[0];
      if (!prima) return 0;
      // La distanza fra due schede: larghezza piu' spazio fra le due.
      const seconda = pista.children[1];
      return seconda
        ? seconda.getBoundingClientRect().left - prima.getBoundingClientRect().left
        : prima.getBoundingClientRect().width;
    },
    aggiorna() {
      const pista = this.$refs.pista;
      const passo = this.passo();
      if (!pista || !passo) return;
      this.corrente = Math.round(pista.scrollLeft / passo);
    },
    scorri(direzione) {
      const pista = this.$refs.pista;
      if (!pista) return;
      pista.scrollBy({ left: this.passo() * direzione, behavior: 'smooth' });
    },
    vaiA(indice) {
      const pista = this.$refs.pista;
      if (!pista) return;
      pista.scrollTo({ left: this.passo() * indice, behavior: 'smooth' });
    },
  },
};
</script>

<style scoped>
.voc-carosello__pista {
  display: flex;
  gap: var(--mdv-spazio-4);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* Chi scorre in orizzontale ritaglia anche in verticale: senza questo
     spazio, il rilievo delle schede e la sporgenza di quelle che girano
     vengono tagliati sopra e sotto. */
  padding-block: var(--mdv-spazio-4);
}
.voc-carosello__pista::-webkit-scrollbar {
  display: none;
}
.voc-carosello__pista :deep(> *) {
  scroll-snap-align: start;
  flex: 0 0 auto;
}

.voc-carosello__comandi {
  display: flex;
  align-items: center;
  gap: var(--mdv-spazio-3);
  margin-top: var(--mdv-spazio-3);
}
.voc-carosello__freccia {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--mdv-sabbia);
  border-radius: 50%;
  background: none;
  color: var(--mdv-oro);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.3s ease, color 0.3s ease, opacity 0.3s ease;
}
.voc-carosello__freccia:hover:not(:disabled) {
  border-color: var(--mdv-oro);
  color: var(--mdv-oro-chiaro);
}
.voc-carosello__freccia:disabled {
  opacity: 0.3;
  cursor: default;
}
.voc-carosello__punti {
  display: flex;
  align-items: center;
  gap: var(--mdv-spazio-2);
  list-style: none;
  padding: 0;
  margin: 0 auto 0 0;
}
.voc-carosello__punto {
  width: 1.6rem;
  height: 2px;
  padding: 0;
  border: none;
  background-color: var(--mdv-sabbia);
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.3s ease, background-color 0.3s ease;
}
.voc-carosello__punto--attivo {
  background-color: var(--mdv-oro);
  opacity: 1;
}
.voc-carosello__freccia:focus-visible,
.voc-carosello__punto:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: 3px;
}
</style>
