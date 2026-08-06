<template>
  <section>
    <!-- Intestazione e testi arrivano dal JSON locale: sono qui dal primo
         fotogramma. Solo gli elenchi aspettano la rete, e lo dicono al loro
         posto invece di far sparire la pagina intera. -->
    <MDHeader :image="attivitaPage.header.backgroundImage"
              :title="attivitaPage.header.title"
              :caption="attivitaPage.header.caption"/>

    <div class="mx-auto w-full max-w-6xl px-4">
      <div v-rivela class="apertura px-4 text-center">
        <h1 class="mdv-titolo-pagina my-2">{{ attivitaPage.main.title }}</h1>
        <Markdown :source="attivitaPage.main.caption" class="mdv-sottotitolo markdown-mdv" :html="true" />
      </div>

      <!-- Mentre le attivita' arrivano si vede la loro forma: la fascia
           del luogo e due articoli. Al posto di una rotella in mezzo allo
           schermo, che dice solo "aspetta". -->
      <div v-if="isLoading" class="attesa" role="status" aria-busy="true">
        <span class="sr-only">Caricamento delle attività in corso</span>
        <BaseScheletro altezza="4rem" />
        <div v-for="i in 2" :key="i" class="attesa__articolo">
          <BaseScheletro altezza="14rem" />
          <div class="attesa__righe">
            <BaseScheletro altezza="1.6rem" larghezza="70%" />
            <BaseScheletro />
            <BaseScheletro />
            <BaseScheletro larghezza="85%" />
          </div>
        </div>
      </div>
      <MdvGroups v-else v-rivela :groups="attivitaPage.groups"/>
    </div>
  </section>
</template>

<script>
import { usaPagina } from '@/store/pagina.mjs';
import MDHeader from "@/components/layout/MdvHeader.vue";
import MdvGroups from "@/components/MdvGroups.vue";
import Markdown from 'vue3-markdown-it';
import BaseScheletro from "@/components/ui/BaseScheletro.vue";

export default {
  name: "AttivitaPage",
  setup() {
    return { pagina: usaPagina() };
  },
  components: {MdvGroups, MDHeader, Markdown, BaseScheletro},
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
.apertura {
  margin-block: var(--mdv-ritmo-sezione);
}

.attesa {
  display: flex;
  flex-direction: column;
  gap: var(--mdv-spazio-6);
  padding-bottom: var(--mdv-ritmo-sezione);
}
.attesa__articolo {
  display: grid;
  gap: var(--mdv-spazio-5);
}
.attesa__righe {
  display: flex;
  flex-direction: column;
  gap: var(--mdv-spazio-3);
}
@media (min-width: 48rem) {
  .attesa__articolo {
    grid-template-columns: 1fr 2fr;
    align-items: center;
  }
}

</style>