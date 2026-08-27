<template>
  <div
    class="carosello"
    @mouseenter="ferma"
    @mouseleave="riparti"
    @focusin="ferma"
    @focusout="riparti"
  >
    <div class="carosello__palco">
      <div ref="pista" class="carosello__pista" @scroll.passive="aggiorna">
        <slot />
      </div>

      <!-- Vetro smerigliato, come il velo sopra le fotografie di
           intestazione: la stessa idea, "un controllo che deve restare
           leggibile sopra qualcosa di imprevedibile", risolta con lo
           stesso linguaggio. Sui lati della pista invece che in coda
           sotto i punti — e' li' che li mette qualunque slider che si
           guarda oggi, ed e' anche il motivo per cui prima sembravano
           un'aggiunta invece che un comando. -->
      <button
        v-if="totale > 1"
        type="button"
        class="carosello__freccia carosello__freccia--sinistra"
        :disabled="!ciclico && corrente === 0"
        aria-label="Precedente"
        @click="scorri(-1)"
      ><i class="fas fa-chevron-left" aria-hidden="true"></i></button>

      <button
        v-if="totale > 1"
        type="button"
        class="carosello__freccia carosello__freccia--destra"
        :disabled="!ciclico && corrente >= totale - 1"
        aria-label="Successivo"
        @click="scorri(1)"
      ><i class="fas fa-chevron-right" aria-hidden="true"></i></button>
    </div>

    <ol v-if="totale > 1" class="carosello__punti">
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
/* Il palco e' solo la pista: le frecce si centrano sulla sua altezza, non
   su quella del carosello intero, che includerebbe anche la riga dei
   punti sotto e le sbilancerebbe verso l'alto. */
.carosello__palco {
  position: relative;
}

.carosello__pista {
  display: flex;
  /* Le schede stanno al centro quando ci stanno tutte, e scorrono da
     sinistra quando non ci stanno. "safe" e' quello che evita che, con il
     centraggio, la prima finisca oltre il bordo e diventi irraggiungibile. */
  justify-content: center;
  justify-content: safe center;
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
  /* Ai lati, uno spazio vuoto grande quanto le frecce: senza, le frecce
     galleggerebbero sopra l'ultima scheda invece che accanto, e su un
     carosello con poche schede coprirebbero proprio quella che manca di
     meno per essere vista tutta. */
  padding-inline: clamp(2.75rem, 7vw, 3.5rem);
  scroll-padding-inline: clamp(2.75rem, 7vw, 3.5rem);
}
.carosello__pista::-webkit-scrollbar {
  display: none;
}
.carosello__pista :deep(> *) {
  scroll-snap-align: start;
  flex: 0 0 auto;
}

/* Le frecce: vetro smerigliato che sposta sui lati un comando che prima
   stava in coda sotto i punti. Tinta chiara e non scura -- a differenza
   del velo della barra, qui sotto puo' esserci una scheda chiara quanto
   una fotografia scura, e un vetro chiaro funziona ragionevolmente bene
   in entrambi i casi: aggiunge luce e leggibilita' invece di scommettere
   su quale sia il colore sotto. */
.carosello__freccia {
  position: absolute;
  top: 50%;
  z-index: 2;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid color-mix(in srgb, var(--mdv-sabbia) 45%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--mdv-bianco) 62%, transparent);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  box-shadow: 0 0.35rem 1rem var(--mdv-ombra-lieve);
  color: var(--mdv-oro-scuro);
  font-size: 0.95rem;
  cursor: pointer;
  transition:
    border-color 260ms ease,
    color 260ms ease,
    opacity 260ms ease,
    box-shadow 260ms ease,
    transform 260ms var(--mdv-curva-morbida);
}
.carosello__freccia--sinistra {
  left: 0.4rem;
}
.carosello__freccia--destra {
  right: 0.4rem;
}
.carosello__freccia:disabled {
  opacity: 0;
  pointer-events: none;
}

@media (hover: hover) {
  .carosello__freccia:hover:not(:disabled) {
    border-color: var(--mdv-oro);
    color: var(--mdv-oro);
    box-shadow: 0 0.5rem 1.25rem var(--mdv-ombra-media);
  }
  .carosello__freccia--sinistra:hover:not(:disabled) {
    transform: translateY(-50%) translateX(-2px);
  }
  .carosello__freccia--destra:hover:not(:disabled) {
    transform: translateY(-50%) translateX(2px);
  }
}

/* I punti, ora soli: prima condividevano la riga con due cerchi di
   2,75rem, e quella riga pesava quanto le frecce anche quando l'unica
   informazione utile erano i punti. Restando solo loro lo spazio prima
   del testo che segue si e' accorciato da se', senza bisogno di
   staccarlo a mano dalla misura giusta. */
.carosello__punti {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--mdv-spazio-2);
  list-style: none;
  padding: 0;
  margin: var(--mdv-spazio-2) 0 0 0;
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
</style>
