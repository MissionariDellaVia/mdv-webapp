<template>
  <div
    class="carosello"
    @mouseenter="ferma"
    @mouseleave="riparti"
    @focusin="ferma"
    @focusout="riparti"
  >
    <div ref="pista" class="carosello__pista" @scroll.passive="aggiorna">
      <slot />
    </div>

    <div v-if="totale > 1" class="carosello__comandi">
      <button
        type="button"
        class="carosello__freccia"
        :disabled="!ciclico && corrente === 0"
        aria-label="Precedente"
        @click="scorri(-1)"
      >←</button>

      <ol class="carosello__punti">
        <li v-for="i in totale" :key="i">
          <button
            type="button"
            :class="['carosello__punto', { 'carosello__punto--attivo': i - 1 === corrente }]"
            :aria-label="`Vai a ${i} di ${totale}`"
            :aria-current="i - 1 === corrente ? 'true' : null"
            @click="vaiA(i - 1)"
          ></button>
        </li>
      </ol>

      <button
        type="button"
        class="carosello__freccia"
        :disabled="!ciclico && corrente >= totale - 1"
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
  name: 'BaseCarosello',
  props: {
    // Millisecondi fra un avanzamento e l'altro. Zero: nessun movimento
    // automatico, che e' il valore giusto quando le schede si leggono.
    autoplay: { type: Number, default: 0 },
    // Arrivato in fondo torna all'inizio, invece di fermarsi.
    ciclico: { type: Boolean, default: false },
  },
  data() {
    return { corrente: 0, totale: 0 };
  },
  mounted() {
    this.contaSchede();
    window.addEventListener('resize', this.contaSchede);
    // Un carosello che continua a girare in una scheda che nessuno guarda
    // consuma batteria e basta.
    document.addEventListener('visibilitychange', this.suVisibilita);
    this.riparti();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.contaSchede);
    document.removeEventListener('visibilitychange', this.suVisibilita);
    this.ferma();
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
      const prossimo = this.corrente + direzione;
      if (this.ciclico && prossimo >= this.totale) return this.vaiA(0);
      if (this.ciclico && prossimo < 0) return this.vaiA(this.totale - 1);
      return pista.scrollBy({ left: this.passo() * direzione, behavior: 'smooth' });
    },
    vaiA(indice) {
      const pista = this.$refs.pista;
      if (!pista) return;
      pista.scrollTo({ left: this.passo() * indice, behavior: 'smooth' });
    },
    // --- movimento automatico ---
    riparti() {
      this.ferma();
      if (!this.autoplay) return;
      // Chi ha chiesto meno movimento non vuole certo una giostra.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this.battito = setInterval(() => this.scorri(1), this.autoplay);
    },
    ferma() {
      clearInterval(this.battito);
      this.battito = null;
    },
    suVisibilita() {
      if (document.hidden) this.ferma();
      else this.riparti();
    },
  },
};
</script>

<style scoped>
.carosello__pista {
  display: flex;
  /* Le schede stanno al centro quando ci stanno tutte, e scorrono da
     sinistra quando non ci stanno. "safe" e' quello che evita che, con il
     centraggio, la prima finisca oltre il bordo e diventi irraggiungibile. */
  justify-content: center;
  justify-content: safe center;
  gap: var(--mdv-spazio-4);
  scroll-padding-inline: var(--mdv-spazio-4);
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
.carosello__pista::-webkit-scrollbar {
  display: none;
}
.carosello__pista :deep(> *) {
  scroll-snap-align: start;
  flex: 0 0 auto;
}

.carosello__comandi {
  display: flex;
  align-items: center;
  gap: var(--mdv-spazio-3);
  margin-top: var(--mdv-spazio-3);
}
.carosello__freccia {
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
.carosello__freccia:disabled {
  opacity: 0.3;
  cursor: default;
}
.carosello__punti {
  display: flex;
  align-items: center;
  gap: var(--mdv-spazio-2);
  list-style: none;
  padding: 0;
  margin: 0 auto 0 0;
}
.carosello__punto {
  width: 1.6rem;
  height: 2px;
  padding: 0;
  border: none;
  background-color: var(--mdv-sabbia);
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.3s ease, background-color 0.3s ease;
}
.carosello__punto--attivo {
  background-color: var(--mdv-oro);
  opacity: 1;
}
.carosello__freccia:focus-visible,
.carosello__punto:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: 3px;
}

@media (hover: hover) {
  .carosello__freccia:hover:not(:disabled) {
    border-color: var(--mdv-oro);
    color: var(--mdv-oro-chiaro);
  }
}
</style>
