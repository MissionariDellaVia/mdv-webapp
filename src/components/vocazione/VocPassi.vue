<template>
  <section class="voc-passi">
    <h2 v-if="titolo" class="voc-passi__titolo">{{ titolo }}</h2>
    <p class="voc-passi__avanzamento">{{ letti.length }} di {{ passi.length }} · tocca una carta per girarla</p>

    <BaseCarosello>
      <button
        v-for="(passo, i) in passi"
        :key="i"
        type="button"
        :class="['voc-passi__carta', { 'voc-passi__carta--girata': girata === i }]"
        :aria-pressed="girata === i ? 'true' : 'false'"
        @click="gira(i)"
      >
        <span class="voc-passi__interno">
          <span class="voc-passi__faccia voc-passi__faccia--fronte">
            <span :class="['voc-passi__numero', { 'voc-passi__numero--letto': letti.includes(i) }]">
              {{ i + 1 }}
            </span>
            <span class="voc-passi__nome">{{ passo.titolo }}</span>
            <span class="voc-passi__invito">gira</span>
          </span>

          <span class="voc-passi__faccia voc-passi__faccia--retro">
            <span class="voc-passi__testo">{{ passo.testo }}</span>
          </span>
        </span>
      </button>
    </BaseCarosello>
  </section>
</template>

<script>
import BaseCarosello from '@/components/ui/BaseCarosello.vue';
import { vocStorage } from '@/utility/vocStorage.mjs';

export default {
  name: 'VocPassi',
  components: { BaseCarosello },
  props: {
    titolo: { type: String, default: '' },
    passi: { type: Array, required: true },
    percorso: { type: String, required: true },
  },
  data() {
    return {
      girata: null,
      letti: vocStorage.leggi(this.percorso, 'passi', []),
    };
  },
  methods: {
    gira(i) {
      this.girata = this.girata === i ? null : i;
      if (this.girata === i && !this.letti.includes(i)) {
        this.letti = [...this.letti, i];
        vocStorage.scrivi(this.percorso, 'passi', this.letti);
      }
    },
  },
};
</script>

<style scoped>
.voc-passi {
  margin-bottom: var(--mdv-spazio-6);
}
.voc-passi__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
  font-size: 1.9rem;
  margin-bottom: var(--mdv-spazio-2);
}
.voc-passi__avanzamento {
  font-family: var(--mdv-font-navigazione);
  font-size: 0.9rem;
  color: var(--mdv-grigio);
  margin-bottom: var(--mdv-spazio-4);
}

/* La carta e' il bottone: un solo elemento attivabile, una sola tappa
   con il tabulatore. La prospettiva sta qui, il giro sull'interno. */
.voc-passi__carta {
  width: 15rem;
  height: 19rem;
  padding: 0;
  border: none;
  background: none;
  /* Prospettiva lunga: piu' e' corta, piu' la carta sporge dal proprio
     riquadro mentre gira, e i bordi finiscono tagliati dallo scorrevole. */
  perspective: 1600px;
  cursor: pointer;
}
.voc-passi__interno {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 700ms var(--mdv-curva-morbida);
}
.voc-passi__carta--girata .voc-passi__interno {
  transform: rotateY(180deg);
}

.voc-passi__faccia {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: var(--mdv-spazio-4);
  border: 1px solid var(--mdv-sabbia);
  border-radius: var(--mdv-raggio-m);
  background-color: var(--voc-fondo-alto);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  /* Il ritaglio sul raggio evita la sbavatura di un pixel che si vede sui
     bordi mentre la faccia ruota. */
  overflow: hidden;
  text-align: left;
}
.voc-passi__faccia--fronte {
  justify-content: space-between;
  align-items: flex-start;
}
.voc-passi__faccia--retro {
  justify-content: center;
  transform: rotateY(180deg);
  border-color: var(--mdv-oro-scuro);
  overflow-x: hidden;
  overflow-y: auto;
}

.voc-passi__numero {
  flex: 0 0 auto;
  width: var(--mdv-spazio-6);
  height: var(--mdv-spazio-6);
  border-radius: 50%;
  border: 1px solid var(--mdv-sabbia);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mdv-font-titolo);
  font-size: 1.2rem;
  color: var(--mdv-oro);
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
.voc-passi__numero--letto {
  background-color: var(--mdv-oro);
  color: var(--voc-fondo);
  border-color: var(--mdv-oro);
}
.voc-passi__nome {
  font-family: var(--mdv-font-titolo);
  font-size: 1.5rem;
  line-height: 1.25;
  color: var(--mdv-oro-chiaro);
}
.voc-passi__invito {
  font-family: var(--mdv-font-navigazione);
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--mdv-grigio);
}
.voc-passi__testo {
  font-family: var(--mdv-font-corpo);
  font-size: 1.02rem;
  line-height: 1.75;
  color: var(--mdv-bruno-900);
}

.voc-passi__carta:hover .voc-passi__faccia--fronte {
  border-color: var(--mdv-oro-scuro);
}
.voc-passi__carta:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: 4px;
  border-radius: var(--mdv-raggio-m);
}

/* Senza il 3D il giro non si puo' rendere: si scambiano le due facce. */
@media (prefers-reduced-motion: reduce) {
  .voc-passi__interno {
    transform-style: flat;
  }
  .voc-passi__carta--girata .voc-passi__interno {
    transform: none;
  }
  .voc-passi__faccia--retro {
    transform: none;
    opacity: 0;
    pointer-events: none;
  }
  .voc-passi__carta--girata .voc-passi__faccia--retro {
    opacity: 1;
  }
}
</style>
