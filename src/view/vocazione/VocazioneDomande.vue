<template>
  <section>
    <div class="container voc-domande">
      <p class="voc-domande__invito">
        Hai una domanda da fare o un pensiero da condividere?
        <router-link :to="{ name: 'contatti' }" class="mdv-link">Scrivici</router-link>: la tua domanda e la
        nostra risposta potranno essere pubblicate qui, nel rispetto della tua privacy.
      </p>

      <VocFaq :domande="domande" />
    </div>
  </section>
</template>

<script>
import VocFaq from '@/components/vocazione/VocFaq.vue';
import contenuto from '@/assets/data/vocazione.json';

export default {
  name: 'VocazioneDomande',
  components: { VocFaq },
  data() {
    return { domande: contenuto.domande };
  },
};
</script>

<style scoped>
.voc-domande {
  max-width: 46rem;
  padding-top: var(--mdv-spazio-6);
  padding-bottom: var(--mdv-spazio-6);
}
.voc-domande__invito {
  font-family: var(--mdv-font-corpo);
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--mdv-grigio-scuro);
  margin-bottom: var(--mdv-spazio-6);
}
</style>
