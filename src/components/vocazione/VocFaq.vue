<template>
  <div class="voc-faq">
    <article v-for="(voce, i) in domande" :key="voce.id" class="voc-faq__voce">
      <button
        type="button"
        :class="['voc-faq__domanda', { 'voc-faq__domanda--aperta': aperta === i }]"
        :aria-expanded="aperta === i ? 'true' : 'false'"
        @click="aperta = aperta === i ? null : i"
      >
        <span class="voc-faq__testo-domanda">{{ voce.domanda }}</span>
        <span class="voc-faq__segno" aria-hidden="true">{{ aperta === i ? '−' : '+' }}</span>
      </button>
      <div v-show="aperta === i" class="voc-faq__risposta">
        <Markdown :source="voce.risposta" :html="true" class="markdown-mdv" />
      </div>
    </article>
  </div>
</template>

<script>
import Markdown from 'vue3-markdown-it';

export default {
  name: 'VocFaq',
  components: { Markdown },
  props: {
    domande: { type: Array, required: true },
  },
  data() {
    return { aperta: null };
  },
};
</script>

<style scoped>
.voc-faq__voce {
  border-bottom: 1px solid var(--mdv-sabbia);
}
.voc-faq__domanda {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--mdv-spazio-3);
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: var(--mdv-spazio-4) 0;
  font-family: var(--mdv-font-corpo);
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--mdv-bruno-900);
  cursor: pointer;
}
.voc-faq__domanda--aperta {
  color: var(--mdv-oro);
}
.voc-faq__segno {
  flex: 0 0 auto;
  font-family: var(--mdv-font-titolo);
  font-size: 1.4rem;
  color: var(--mdv-oro);
  line-height: 1;
}
.voc-faq__risposta {
  padding: 0 0 var(--mdv-spazio-5) 0;
}
.voc-faq__risposta :deep(p) {
  font-family: var(--mdv-font-corpo);
  font-size: 1.05rem;
  line-height: 1.9;
  margin-bottom: var(--mdv-spazio-4);
}
.voc-faq__risposta :deep(em) {
  color: var(--mdv-oro-scuro);
}
</style>
