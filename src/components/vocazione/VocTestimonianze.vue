<template>
  <section class="voc-testimonianze">
    <h2 v-if="titolo" class="voc-testimonianze__titolo">{{ titolo }}</h2>
    <article v-for="(voce, i) in voci" :key="i" class="voc-testimonianze__voce">
      <img
        v-if="voce.foto"
        :src="immagine(voce.foto)"
        :alt="voce.nome"
        class="voc-testimonianze__foto"
      />
      <h3 class="voc-testimonianze__nome">{{ voce.nome }}</h3>
      <Markdown :source="voce.testo" :html="true" class="markdown-mdv" />
    </article>
  </section>
</template>

<script>
import Markdown from 'vue3-markdown-it';

export default {
  name: 'VocTestimonianze',
  components: { Markdown },
  props: {
    titolo: { type: String, default: '' },
    voci: { type: Array, required: true },
  },
  methods: {
    immagine(nome) {
      return require(`@/assets/img/vocazione/${nome}`);
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
.voc-testimonianze__voce {
  margin-bottom: var(--mdv-spazio-6);
  padding-left: var(--mdv-spazio-4);
  border-left: 2px solid var(--mdv-sabbia);
  overflow: hidden;
}
.voc-testimonianze__foto {
  float: right;
  width: 12rem;
  max-width: 40%;
  margin: 0 0 var(--mdv-spazio-3) var(--mdv-spazio-4);
  border-radius: var(--mdv-raggio-m);
}
.voc-testimonianze__nome {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro-scuro);
  font-size: 1.4rem;
  margin-bottom: var(--mdv-spazio-3);
}
.voc-testimonianze :deep(p) {
  font-family: var(--mdv-font-corpo);
  font-size: 1.05rem;
  line-height: 1.9;
  margin-bottom: var(--mdv-spazio-3);
}
.voc-testimonianze :deep(blockquote) {
  border-left: 2px solid var(--mdv-sabbia-chiara);
  padding-left: var(--mdv-spazio-3);
  font-style: italic;
  color: var(--mdv-oro-scuro);
}
@media (max-width: 576px) {
  .voc-testimonianze__foto {
    float: none;
    width: 100%;
    max-width: 100%;
    margin: 0 0 var(--mdv-spazio-3) 0;
  }
}
</style>
