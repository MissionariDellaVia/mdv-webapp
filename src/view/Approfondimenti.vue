<template>
  <section>
    <MDHeader
      :image="approfondimentiPage.header.backgroundImage"
      :title="approfondimentiPage.header.title"
      :caption="approfondimentiPage.header.caption"
    />

    <div class="corpo mx-auto flex w-full max-w-6xl flex-col px-4">
      <MdvLongArticle
        v-for="(sezione, index) in approfondimentiPage.sections"
        :key="index"
        v-rivela
        :title="sezione.title"
        :align="sezione.image.align"
        :imageUrl="sezione.image.url"
        :texts="sezione.articles"
      />
    </div>
  </section>
</template>

<script>
import MDHeader from "@/components/layout/MdvHeader.vue";
import MdvLongArticle from "@/components/MdvLongArticle.vue";
import { usaPagina } from '@/store/pagina.mjs';

export default {
  name: "ApprofondimentiPage",
  setup() {
    return { pagina: usaPagina() };
  },
  components: { MDHeader, MdvLongArticle },
  // Solo JSON locale: il contenuto c'e' gia' al primo disegno, quindi
  // niente spinner ad aspettare una promessa gia' risolta.
  created() {
    this.pagina.caricaPagina("approfondimenti");
  },
  computed: {
    approfondimentiPage() {
      return this.pagina.approfondimenti;
    },
  },
}
</script>

<style scoped>
.corpo {
  gap: var(--mdv-ritmo-sezione);
  padding-block: var(--mdv-ritmo-sezione);
}
</style>
