<template>
  <section>
    <!-- Intestazione e testi arrivano dal JSON locale: sono qui dal primo
         fotogramma. Solo gli elenchi aspettano la rete, e lo dicono al loro
         posto invece di far sparire la pagina intera. -->
    <MDHeader :image="attivitaPage.header.backgroundImage"
              :title="attivitaPage.header.title"
              :caption="attivitaPage.header.caption"/>

    <div class="container">
      <div class="row text-center my-5">
        <div class="col-12 px-5">
          <h1 class="main-title my-2"> {{ attivitaPage.main.title }} </h1>
          <Markdown :source="attivitaPage.main.caption" class="caption h4" :html="true"></Markdown>
        </div>
      </div>

      <div v-if="isLoading" class="py-5">
        <base-spinner></base-spinner>
      </div>
      <MdvGroups v-else :groups="attivitaPage.groups"/>
    </div>
  </section>
</template>

<script>
import MDHeader from "@/components/layout/MdvHeader.vue";
import MdvGroups from "@/components/MdvGroups.vue";
import Markdown from 'vue3-markdown-it';

export default {
  name: "AttivitaPage",
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
      return this.$store.getters['page/attivita'];
    },

  },
  methods: {
    async loadPage(page) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('page/loadPage', page);
      } catch (error) {
        console.error('Errore caricamento attività:', error);
      }
      this.isLoading = false;
    },
  }
}
</script>

<style scoped>
.main-title {
  font-family: var(--mdv-font-titolo);
  font-size: 3.5rem;
}
.caption {
  font-family: var(--mdv-font-corpo);
  font-style: italic;
}
p {
  font-family: var(--mdv-font-corpo);
  font-size: larger;
}
</style>