<template>
  <section class="voc-prosa">
    <h2 v-if="titolo" class="voc-prosa__titolo">{{ titolo }}</h2>
    <Markdown :source="testo" :html="true" class="markdown-mdv" />
  </section>
</template>

<script>
import Markdown from 'vue3-markdown-it';

export default {
  name: 'VocProsa',
  components: { Markdown },
  props: {
    titolo: { type: String, default: '' },
    testo: { type: String, required: true },
  },
};
</script>

<style scoped>
.voc-prosa {
  margin-bottom: var(--mdv-spazio-6);
}
.voc-prosa__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
  font-size: 1.9rem;
  margin-bottom: var(--mdv-spazio-4);
}
.voc-prosa :deep(p) {
  font-family: var(--mdv-font-corpo);
  font-size: 1.1rem;
  line-height: var(--mdv-interlinea-prosa);
  margin-bottom: var(--mdv-spazio-4);
}
.voc-prosa :deep(blockquote) {
  border-left: 2px solid var(--mdv-sabbia);
  padding-left: var(--mdv-spazio-4);
  font-style: italic;
}
</style>
