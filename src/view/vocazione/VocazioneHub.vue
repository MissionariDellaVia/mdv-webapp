<template>
  <section>
    <!-- Altre lingue: si riusa la pagina preesistente cosi' com'e'. E' gia'
         autosufficiente (intestazione, spinner, caricamento dallo store):
         reimplementarla qui significherebbe solo poterla far divergere.
         Il commento sta dentro la radice, non accanto: un commento alla
         radice conta come nodo, la radice diventa multipla e la pagina
         smette di comparire (vedi scripts/lib/radice-unica.js). -->
    <VocazioneLegacy v-if="!inItaliano" />

    <div v-else class="container voc-hub">
      <blockquote class="voc-hub__citazione">{{ hub.citazione }}</blockquote>

      <Markdown :source="hub.intro" :html="true" class="markdown-mdv voc-hub__testo" />

      <h2 class="voc-hub__invito">{{ hub.invito }}</h2>
      <VocPorte :porte="hub.porte" />

      <Markdown :source="hub.chiusura" :html="true" class="markdown-mdv voc-hub__testo" />

      <VocRimandi
        titolo="Puoi anche"
        :voci="[
          { etichetta: 'Le vostre domande', rotta: 'vocazione-domande' },
          { etichetta: 'La nostra proposta', rotta: 'vocazione-proposta' },
        ]"
      />
    </div>
  </section>
</template>


<script>
import Markdown from 'vue3-markdown-it';
import VocazioneLegacy from '@/view/Vocazione.vue';
import VocPorte from '@/components/vocazione/VocPorte.vue';
import VocRimandi from '@/components/vocazione/VocRimandi.vue';
import contenuto from '@/assets/data/vocazione.json';

export default {
  name: 'VocazioneHub',
  components: {
    Markdown, VocazioneLegacy, VocPorte, VocRimandi,
  },
  data() {
    return {
      hub: contenuto.hub,
      inItaliano: (localStorage.getItem('lang') || 'it') === 'it',
    };
  },
};
</script>

<style scoped>
.voc-hub {
  max-width: 46rem;
  padding-top: var(--mdv-spazio-6);
  padding-bottom: var(--mdv-spazio-6);
}
.voc-hub__citazione {
  font-family: var(--mdv-font-alternativo);
  font-style: italic;
  font-size: 1.15rem;
  line-height: 1.8;
  color: var(--mdv-oro-scuro);
  border-left: 3px solid var(--mdv-sabbia);
  padding-left: var(--mdv-spazio-4);
  margin-bottom: var(--mdv-spazio-6);
}
.voc-hub__invito {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
  font-size: 1.9rem;
  margin-top: var(--mdv-spazio-6);
}
.voc-hub__testo :deep(p) {
  font-family: var(--mdv-font-corpo);
  font-size: 1.1rem;
  line-height: 1.9;
  margin-bottom: var(--mdv-spazio-4);
}
</style>
