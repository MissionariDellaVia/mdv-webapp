<template>
  <section class="voc-testimonianze">
    <h2 v-if="titolo" class="voc-testimonianze__titolo">{{ titolo }}</h2>

    <BaseCarosello>
      <button
        v-for="(voce, i) in voci"
        :key="i"
        type="button"
        class="voc-testimonianze__carta"
        @click="apertaIndice = i"
      >
        <span class="voc-testimonianze__lucido" aria-hidden="true"></span>

        <span class="voc-testimonianze__ritratto">
          <img
            v-if="voce.foto"
            :src="immagine(voce.foto)"
            :alt="voce.nome"
            class="voc-testimonianze__foto"
          />
          <span v-else class="voc-testimonianze__iniziale" aria-hidden="true">
            {{ voce.nome.charAt(0) }}
          </span>
        </span>

        <span class="voc-testimonianze__nome">{{ voce.nome }}</span>
        <span class="voc-testimonianze__virgolette" aria-hidden="true">”</span>
        <span class="voc-testimonianze__estratto">{{ anteprima(voce.testo) }}</span>

        <span class="voc-testimonianze__leggi">
          Leggi <span class="voc-testimonianze__freccia" aria-hidden="true">→</span>
        </span>
      </button>
    </BaseCarosello>

    <VocModale
      :aperta="apertaIndice !== null"
      :titolo="voceAperta ? voceAperta.nome : ''"
      occhiello="Testimonianza"
      @chiudi="apertaIndice = null"
    >
      <template #ritratto>
        <span v-if="voceAperta" class="voc-testimonianze__ritratto voc-testimonianze__ritratto--piccolo">
          <img
            v-if="voceAperta.foto"
            :src="immagine(voceAperta.foto)"
            :alt="voceAperta.nome"
            class="voc-testimonianze__foto"
          />
          <span v-else class="voc-testimonianze__iniziale" aria-hidden="true">
            {{ voceAperta.nome.charAt(0) }}
          </span>
        </span>
      </template>

      <Markdown v-if="voceAperta" :source="voceAperta.testo" :html="true" class="markdown-mdv" />

      <!-- Con piu' di una testimonianza si passa all'altra senza dover
           chiudere, tornare allo slider e ritrovare la scheda giusta. -->
      <template v-if="voci.length > 1" #piede>
        <div class="voc-testimonianze__navigazione">
          <button
            type="button"
            class="voc-testimonianze__passa"
            :disabled="apertaIndice === 0"
            @click="apertaIndice = apertaIndice - 1"
          >← Precedente</button>
          <span class="voc-testimonianze__conta">{{ apertaIndice + 1 }} di {{ voci.length }}</span>
          <button
            type="button"
            class="voc-testimonianze__passa"
            :disabled="apertaIndice === voci.length - 1"
            @click="apertaIndice = apertaIndice + 1"
          >Successiva →</button>
        </div>
      </template>
    </VocModale>
  </section>
</template>

<script>
import Markdown from 'vue3-markdown-it';
import BaseCarosello from '@/components/ui/BaseCarosello.vue';
import VocModale from '@/components/vocazione/VocModale.vue';
import { estratto } from '@/utility/estratto.mjs';

export default {
  name: 'VocTestimonianze',
  components: { Markdown, BaseCarosello, VocModale },
  props: {
    titolo: { type: String, default: '' },
    voci: { type: Array, required: true },
  },
  data() {
    return { apertaIndice: null };
  },
  computed: {
    voceAperta() {
      return this.apertaIndice === null ? null : this.voci[this.apertaIndice];
    },
  },
  methods: {
    immagine(nome) {
      return this.$util.getImgUrl(`vocazione/${nome}`);
    },
    anteprima(testo) {
      return estratto(testo, 175);
    },
  },
};
</script>

<style scoped>
.voc-testimonianze {
  margin-bottom: var(--mdv-spazio-6);
}
.voc-testimonianze__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
  font-size: 1.9rem;
  margin-bottom: var(--mdv-spazio-4);
}

/* Il testo intero e' migliaia di caratteri: nella scheda ci sta solo
   l'inizio, il resto si apre in modale. */
.voc-testimonianze__carta {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--mdv-spazio-3);
  width: 21rem;
  min-height: 21rem;
  padding: var(--mdv-spazio-5);
  text-align: left;
  border: 1px solid var(--mdv-sabbia);
  border-radius: var(--mdv-raggio-m);
  background:
    radial-gradient(120% 80% at 50% 0%, var(--voc-alone) 0%, transparent 60%),
    var(--voc-fondo-alto);
  cursor: pointer;
  transition:
    border-color 0.4s ease,
    box-shadow 0.4s ease,
    transform 0.4s var(--mdv-curva-morbida);
}
.voc-testimonianze__carta:hover,
.voc-testimonianze__carta:focus-visible {
  border-color: var(--mdv-oro);
  transform: translateY(-6px);
  box-shadow: 0 1rem 2.5rem var(--mdv-ombra-media);
}
.voc-testimonianze__carta:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: 3px;
}

/* Passata di luce all'over: parte da sinistra e attraversa la scheda. */
.voc-testimonianze__lucido {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(105deg, transparent 35%, var(--voc-alone) 50%, transparent 65%);
  background-size: 260% 100%;
  background-position: 130% 0;
  opacity: 0;
  transition: background-position 900ms var(--mdv-curva-morbida), opacity 300ms ease;
}
.voc-testimonianze__carta:hover .voc-testimonianze__lucido,
.voc-testimonianze__carta:focus-visible .voc-testimonianze__lucido {
  background-position: -30% 0;
  opacity: 1;
}

.voc-testimonianze__ritratto {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--mdv-sabbia);
  transition: transform 0.5s var(--mdv-curva-morbida), border-color 0.4s ease;
}
.voc-testimonianze__ritratto--piccolo {
  width: 3.4rem;
  height: 3.4rem;
}
.voc-testimonianze__carta:hover .voc-testimonianze__ritratto,
.voc-testimonianze__carta:focus-visible .voc-testimonianze__ritratto {
  transform: scale(1.07);
  border-color: var(--mdv-oro);
}
.voc-testimonianze__foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.45);
  transition: filter 0.5s ease;
}
.voc-testimonianze__carta:hover .voc-testimonianze__foto,
.voc-testimonianze__carta:focus-visible .voc-testimonianze__foto {
  filter: grayscale(0);
}
.voc-testimonianze__iniziale {
  font-family: var(--mdv-font-titolo);
  font-size: 1.8rem;
  color: var(--mdv-oro);
}

.voc-testimonianze__nome {
  font-family: var(--mdv-font-titolo);
  font-size: 1.45rem;
  line-height: 1.2;
  color: var(--mdv-oro-chiaro);
}
.voc-testimonianze__virgolette {
  font-family: var(--mdv-font-titolo);
  font-size: 2.6rem;
  line-height: 0.4;
  color: var(--mdv-oro);
  opacity: 0.5;
}
.voc-testimonianze__estratto {
  font-family: var(--mdv-font-corpo);
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--mdv-bruno-900);
  opacity: 0.8;
}
.voc-testimonianze__leggi {
  display: inline-flex;
  align-items: center;
  gap: var(--mdv-spazio-2);
  margin-top: auto;
  padding-top: var(--mdv-spazio-3);
  font-family: var(--mdv-font-navigazione);
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--mdv-oro);
}
.voc-testimonianze__freccia {
  display: inline-block;
  transition: transform 0.4s var(--mdv-curva-morbida);
}
.voc-testimonianze__carta:hover .voc-testimonianze__freccia,
.voc-testimonianze__carta:focus-visible .voc-testimonianze__freccia {
  transform: translateX(0.4rem);
}

.voc-testimonianze__navigazione {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--mdv-spazio-3);
}
.voc-testimonianze__passa {
  background: none;
  border: none;
  padding: var(--mdv-spazio-2);
  font-family: var(--mdv-font-navigazione);
  font-size: 0.9rem;
  color: var(--mdv-oro);
  cursor: pointer;
  transition: color 0.3s ease, opacity 0.3s ease;
}
.voc-testimonianze__passa:hover:not(:disabled) {
  color: var(--mdv-oro-chiaro);
}
.voc-testimonianze__passa:disabled {
  opacity: 0.3;
  cursor: default;
}
.voc-testimonianze__conta {
  font-family: var(--mdv-font-navigazione);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: var(--mdv-grigio);
}

@media (max-width: 576px) {
  .voc-testimonianze__carta {
    width: 17.5rem;
  }
}
</style>
