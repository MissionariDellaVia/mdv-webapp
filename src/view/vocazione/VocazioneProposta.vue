<template>
  <section>
    <VocIntestazione
      ritorno
      occhiello="Vocazione"
      :immagine="proposta.header.immagine"
      :titolo="proposta.header.titolo"
      :sottotitolo="proposta.header.sottotitolo"
    />

    <div class="container voc-proposta">
      <VocProsa
        v-for="(blocco, i) in proposta.blocchi"
        :key="i"
        :titolo="blocco.titolo || ''"
        :testo="blocco.testo"
      />

      <p class="voc-proposta__contatto">
        <router-link :to="{ name: 'contatti' }" class="voc-proposta__link">
          Scrivici per un primo contatto
        </router-link>
      </p>
    </div>
  </section>
</template>

<script>
import VocIntestazione from '@/components/vocazione/VocIntestazione';
import VocProsa from '@/components/vocazione/VocProsa';
import contenuto from '@/assets/data/vocazione.json';

export default {
  name: 'VocazioneProposta',
  components: { VocIntestazione, VocProsa },
  data() {
    return { proposta: contenuto.proposta };
  },
};
</script>

<style scoped>
.voc-proposta {
  max-width: 46rem;
  padding-top: var(--mdv-spazio-6);
  padding-bottom: var(--mdv-spazio-6);
}
.voc-proposta__contatto {
  text-align: center;
  margin-top: var(--mdv-spazio-6);
}
.voc-proposta__link {
  font-family: var(--mdv-font-navigazione);
  font-size: 1.1rem;
  color: var(--mdv-oro-scuro);
  border-bottom: 1px solid var(--mdv-sabbia);
  text-decoration: none;
}
</style>
