<template>
  <section>
    <div class="voc-proposta">
      <VocProsa
        v-for="(blocco, i) in proposta.blocchi"
        :key="i"
        :titolo="blocco.titolo || ''"
        :testo="blocco.testo"
      />

      <p class="voc-proposta__contatto">
        <router-link :to="{ name: 'contatti' }" class="mdv-invito">
          Scrivici per un primo contatto
          <span class="mdv-invito__freccia" aria-hidden="true">&rarr;</span>
        </router-link>
      </p>
    </div>
  </section>
</template>

<script>
import VocProsa from '@/components/vocazione/VocProsa.vue';
import contenuto from '@/assets/data/vocazione.json';

export default {
  name: 'VocazioneProposta',
  components: { VocProsa },
  data() {
    return { proposta: contenuto.proposta };
  },
};
</script>

<style scoped>
.voc-proposta {
  margin-inline: auto;
  padding-inline: var(--mdv-spazio-4);
  max-width: 46rem;
  padding-top: var(--mdv-spazio-6);
  padding-bottom: var(--mdv-spazio-6);
}
.voc-proposta__contatto {
  text-align: center;
  margin-top: var(--mdv-spazio-6);
}
</style>
