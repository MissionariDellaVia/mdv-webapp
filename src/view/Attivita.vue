<template>
  <section>
    <!-- Intestazione e testi arrivano dal JSON locale: sono qui dal primo
         fotogramma. Solo gli elenchi aspettano la rete, e lo dicono al loro
         posto invece di far sparire la pagina intera. -->
    <MDHeader :image="attivitaPage.header.backgroundImage"
              :title="attivitaPage.header.title"
              :caption="attivitaPage.header.caption"/>

    <div class="mx-auto w-full max-w-6xl px-4">
      <div class="my-12 px-4 text-center">
        <h1 class="titolo my-2">{{ attivitaPage.main.title }}</h1>
        <Markdown :source="attivitaPage.main.caption" class="occhiello markdown-mdv" :html="true" />
      </div>

      <div v-if="isLoading" class="py-12">
        <base-spinner></base-spinner>
      </div>
      <MdvGroups v-else :groups="attivitaPage.groups"/>
    </div>
  </section>
</template>

<script>
import { usaPagina } from '@/store/pagina.mjs';
import MDHeader from "@/components/layout/MdvHeader.vue";
import MdvGroups from "@/components/MdvGroups.vue";
import Markdown from 'vue3-markdown-it';

export default {
  name: "AttivitaPage",
  setup() {
    return { pagina: usaPagina() };
  },
  components: {MdvGroups, MDHeader, Markdown},
  created() {
    this.loadPage("attivita");
  },
  data() {
    return {
      helper: this.$util,
      isLoading: false,
    };
  },
  computed: {
    attivitaPage() {
      return this.pagina.attivita;
    },

  },
  methods: {
    async loadPage(page) {
      this.isLoading = true;
      try {
        await this.pagina.caricaPagina(page);
      } catch (error) {
        console.error('Errore caricamento attività:', error);
      }
      this.isLoading = false;
    },
  }
}
</script>

<style scoped>
.titolo {
  font-family: var(--mdv-font-titolo);
  font-size: var(--mdv-testo-3xl);
  line-height: 1.15;
}
.occhiello {
  font-family: var(--mdv-font-corpo);
  font-size: var(--mdv-testo-l);
  font-style: italic;
}
</style>