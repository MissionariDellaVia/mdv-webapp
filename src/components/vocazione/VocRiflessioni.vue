<template>
  <section class="voc-riflessioni">
    <h2 v-if="titolo" class="voc-riflessioni__titolo">{{ titolo }}</h2>

    <p class="voc-riflessioni__avviso">
      Le tue risposte restano su questo dispositivo: non le riceve nessuno.
    </p>

    <div v-for="(domanda, i) in domande" :key="i" v-auto-animate class="voc-riflessioni__voce">
      <button
        type="button"
        :class="['voc-riflessioni__domanda', { 'voc-riflessioni__domanda--aperta': aperta === i }]"
        :aria-expanded="aperta === i ? 'true' : 'false'"
        @click="aperta = aperta === i ? null : i"
      >
        {{ domanda }}
      </button>
      <textarea
        v-if="aperta === i"
        v-model="risposte[i]"
        class="voc-riflessioni__risposta"
        rows="4"
        placeholder="Puoi scrivere qui, con calma."
        @blur="salva"
      ></textarea>
    </div>

    <button
      v-if="haRisposte"
      type="button"
      class="voc-riflessioni__cancella"
      @click="cancella"
    >
      Cancella le mie risposte
    </button>
  </section>
</template>

<script>
import { vocStorage } from '@/utility/vocStorage.mjs';

export default {
  name: 'VocRiflessioni',
  props: {
    titolo: { type: String, default: '' },
    domande: { type: Array, required: true },
    percorso: { type: String, required: true },
  },
  data() {
    return {
      aperta: null,
      risposte: vocStorage.leggi(this.percorso, 'riflessioni', {}),
    };
  },
  computed: {
    haRisposte() {
      return Object.values(this.risposte).some((r) => r && r.trim().length > 0);
    },
  },
  beforeUnmount() {
    // Il campo ora e' sotto v-if: se l'utente lascia la pagina senza che
    // blur sia scattato, il testo si salva comunque.
    this.salva();
  },
  methods: {
    salva() {
      vocStorage.scrivi(this.percorso, 'riflessioni', this.risposte);
    },
    cancella() {
      this.risposte = {};
      vocStorage.cancella(this.percorso);
    },
  },
};
</script>

<style scoped>
.voc-riflessioni {
  margin-bottom: var(--mdv-spazio-6);
  padding: var(--mdv-spazio-5);
  background-color: var(--mdv-crema);
  border-radius: var(--mdv-raggio-m);
}
.voc-riflessioni__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro-scuro);
  font-size: 1.9rem;
  margin-bottom: var(--mdv-spazio-2);
}
.voc-riflessioni__avviso {
  font-family: var(--mdv-font-navigazione);
  font-size: 0.85rem;
  color: var(--mdv-grigio-scuro);
  margin-bottom: var(--mdv-spazio-4);
}
.voc-riflessioni__voce {
  margin-bottom: var(--mdv-spazio-2);
}
.voc-riflessioni__domanda {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid var(--mdv-sabbia);
  padding: var(--mdv-spazio-3) 0;
  font-family: var(--mdv-font-corpo);
  font-size: 1.05rem;
  cursor: pointer;
}
.voc-riflessioni__domanda--aperta {
  color: var(--mdv-oro-scuro);
}
.voc-riflessioni__risposta {
  width: 100%;
  margin-top: var(--mdv-spazio-2);
  padding: var(--mdv-spazio-3);
  border: 1px solid var(--mdv-sabbia);
  border-radius: var(--mdv-raggio-s);
  font-family: var(--mdv-font-corpo);
  color: var(--mdv-bruno-900);
  background-color: var(--voc-campo);
}
.voc-riflessioni__cancella {
  margin-top: var(--mdv-spazio-4);
  background: none;
  border: 1px solid var(--mdv-grigio);
  border-radius: var(--mdv-raggio-s);
  padding: var(--mdv-spazio-2) var(--mdv-spazio-4);
  font-family: var(--mdv-font-navigazione);
  font-size: 0.9rem;
  color: var(--mdv-grigio-scuro);
  cursor: pointer;
}
</style>
