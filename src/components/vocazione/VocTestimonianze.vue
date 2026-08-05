<template>
  <section class="voc-testimonianze">
    <h2 v-if="titolo" class="voc-testimonianze__titolo">{{ titolo }}</h2>

    <VocCarosello>
      <button
        v-for="(voce, i) in voci"
        :key="i"
        type="button"
        class="voc-testimonianze__carta"
        @click="apri(i)"
      >
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
        <span class="voc-testimonianze__estratto">{{ anteprima(voce.testo) }}</span>
        <span class="voc-testimonianze__leggi">Leggi la testimonianza</span>
      </button>
    </VocCarosello>

    <VocModale
      :aperta="apertaIndice !== null"
      :titolo="voceAperta ? voceAperta.nome : ''"
      @chiudi="apertaIndice = null"
    >
      <img
        v-if="voceAperta && voceAperta.foto"
        :src="immagine(voceAperta.foto)"
        :alt="voceAperta.nome"
        class="voc-testimonianze__foto-modale"
      />
      <Markdown
        v-if="voceAperta"
        :source="voceAperta.testo"
        :html="true"
        class="markdown-mdv"
      />
    </VocModale>
  </section>
</template>

<script>
import Markdown from 'vue3-markdown-it';
import VocCarosello from '@/components/vocazione/VocCarosello';
import VocModale from '@/components/vocazione/VocModale';
import { estratto } from '@/utility/estratto.mjs';

export default {
  name: 'VocTestimonianze',
  components: { Markdown, VocCarosello, VocModale },
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
      return require(`@/assets/img/vocazione/${nome}`);
    },
    anteprima(testo) {
      return estratto(testo, 170);
    },
    apri(i) {
      this.apertaIndice = i;
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--mdv-spazio-3);
  width: 20rem;
  padding: var(--mdv-spazio-5);
  text-align: left;
  border: 1px solid var(--mdv-sabbia);
  border-radius: var(--mdv-raggio-m);
  background-color: var(--voc-fondo-alto);
  cursor: pointer;
  transition: border-color 0.3s ease, transform 0.3s var(--mdv-curva-morbida);
}
.voc-testimonianze__carta:hover,
.voc-testimonianze__carta:focus-visible {
  border-color: var(--mdv-oro-scuro);
  transform: translateY(-3px);
}
.voc-testimonianze__carta:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: 3px;
}

.voc-testimonianze__ritratto {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--mdv-sabbia);
}
.voc-testimonianze__foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.voc-testimonianze__iniziale {
  font-family: var(--mdv-font-titolo);
  font-size: 1.8rem;
  color: var(--mdv-oro);
}

.voc-testimonianze__nome {
  font-family: var(--mdv-font-titolo);
  font-size: 1.4rem;
  color: var(--mdv-oro-chiaro);
}
.voc-testimonianze__estratto {
  font-family: var(--mdv-font-corpo);
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--mdv-bruno-900);
  opacity: 0.8;
}
.voc-testimonianze__leggi {
  margin-top: auto;
  font-family: var(--mdv-font-navigazione);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mdv-oro);
}

.voc-testimonianze__foto-modale {
  float: right;
  width: 11rem;
  max-width: 40%;
  margin: 0 0 var(--mdv-spazio-4) var(--mdv-spazio-4);
  border-radius: var(--mdv-raggio-m);
}

@media (max-width: 576px) {
  .voc-testimonianze__carta {
    width: 17rem;
  }
  .voc-testimonianze__foto-modale {
    float: none;
    width: 100%;
    max-width: 100%;
    margin: 0 0 var(--mdv-spazio-4) 0;
  }
}
</style>
