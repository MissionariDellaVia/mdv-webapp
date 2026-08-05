<template>
  <section class="voc-passi">
    <h2 v-if="titolo" class="voc-passi__titolo">{{ titolo }}</h2>
    <p class="voc-passi__avanzamento">{{ letti.length }} di {{ passi.length }}</p>

    <ol class="voc-passi__lista">
      <li v-for="(passo, i) in passi" :key="i" v-auto-animate class="voc-passi__passo">
        <button
          type="button"
          :class="['voc-passi__intestazione', { 'voc-passi__intestazione--letto': letti.includes(i) }]"
          :aria-expanded="aperto === i ? 'true' : 'false'"
          @click="apri(i)"
        >
          <span class="voc-passi__numero">{{ i + 1 }}</span>
          <span class="voc-passi__nome">{{ passo.titolo }}</span>
        </button>
        <p v-if="aperto === i" class="voc-passi__testo">{{ passo.testo }}</p>
      </li>
    </ol>
  </section>
</template>

<script>
import { vocStorage } from '@/utility/vocStorage.mjs';

export default {
  name: 'VocPassi',
  props: {
    titolo: { type: String, default: '' },
    passi: { type: Array, required: true },
    percorso: { type: String, required: true },
  },
  data() {
    return {
      aperto: null,
      letti: vocStorage.leggi(this.percorso, 'passi', []),
    };
  },
  methods: {
    apri(i) {
      this.aperto = this.aperto === i ? null : i;
      if (this.aperto === i && !this.letti.includes(i)) {
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
.voc-passi__lista {
  list-style: none;
  padding-left: 0;
}
.voc-passi__passo {
  margin-bottom: var(--mdv-spazio-2);
}
.voc-passi__intestazione {
  display: flex;
  align-items: center;
  gap: var(--mdv-spazio-3);
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid var(--mdv-sabbia);
  padding: var(--mdv-spazio-3) 0;
  text-align: left;
  font-family: var(--mdv-font-corpo);
  font-size: 1.1rem;
  cursor: pointer;
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
  color: var(--mdv-oro);
  transition: background-color .15s, color .15s;
}
.voc-passi__intestazione--letto .voc-passi__numero {
  background-color: var(--mdv-oro);
  color: var(--mdv-bianco);
  border-color: var(--mdv-oro);
}
.voc-passi__testo {
  font-family: var(--mdv-font-corpo);
  font-size: 1.1rem;
  line-height: 1.8;
  padding: var(--mdv-spazio-3) 0 var(--mdv-spazio-3) var(--mdv-spazio-6);
  margin: 0;
}
</style>
