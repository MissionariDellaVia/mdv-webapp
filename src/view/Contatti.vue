<template>
  <section>
    <!-- Intestazione e modulo arrivano dal JSON locale: sono qui dal primo
         fotogramma. Solo le sedi aspettano la rete, e lo dicono al loro
         posto invece di far sparire la pagina intera. -->
    <MDHeader
      :image="contattiPage.header.backgroundImage"
      :title="contattiPage.header.title"
    />

    <div class="mx-auto w-full max-w-6xl px-4 py-12">
      <div v-if="isLoading" class="py-12">
        <base-spinner></base-spinner>
      </div>

      <BaseRiquadro v-for="(sede, index) in contattiPage.places" :key="index" class="mb-12">
        <template #testata>
          <span class="nome-sede">{{ sede.title }}</span>
        </template>

        <BaseMap :lat="sede.lat" :lng="sede.lng" />

        <!-- Indirizzo, telefono e posta: tre riquadri affiancati dove ci
             stanno, in colonna dove no. -->
        <div class="mt-8 grid gap-6 md:grid-cols-3">
          <MdvContactoButton>
            <template #icona>
              <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
            </template>
            <p v-for="(riga, i) in sede.address" :key="i">
              <Markdown :source="riga" />
            </p>
          </MdvContactoButton>

          <MdvContactoButton>
            <template #icona>
              <i class="fa-solid fa-phone" aria-hidden="true"></i>
            </template>
            <p>
              <Markdown :source="sede.phone.title" />
              <a :href="`tel:0039${sede.phone.number}`">{{ sede.phone.number }}</a>
            </p>
          </MdvContactoButton>

          <MdvContactoButton>
            <template #icona>
              <i class="fa-regular fa-envelope" aria-hidden="true"></i>
            </template>
            <p v-for="(posta, i) in sede.emails" :key="i">
              <Markdown :source="posta.title" />
              <a :href="`mailto:${posta.email}`">{{ posta.email }}</a>
            </p>
          </MdvContactoButton>
        </div>
      </BaseRiquadro>

      <MdvForm
        :title="contattiPage.form.title"
        :button-name="contattiPage.form.buttonName"
        :name-field="contattiPage.form.nameField"
        :last-name-field="contattiPage.form.lastNameField"
        :text-field="contattiPage.form.messageField"
      />
    </div>
  </section>
</template>

<script>
import { usaPagina } from '@/store/pagina.mjs';
import MDHeader from "@/components/layout/MdvHeader.vue";
import MdvContactoButton from "@/components/MdvContactButton.vue";
import MdvForm from "@/components/MdvForm.vue";
import BaseRiquadro from "@/components/ui/BaseRiquadro.vue";
import Markdown from 'vue3-markdown-it';
import { defineAsyncComponent } from 'vue';

// La mappa si porta dietro maplibre-gl, il pezzo piu' pesante di tutto il
// sito. Caricata cosi', arriva solo quando qualcuno apre i contatti: chi
// legge "chi siamo" non scarica piu' un motore cartografico.
const BaseMap = defineAsyncComponent(() => import("@/components/ui/BaseMap.vue"));

export default {
  name: "ContattiPage",
  setup() {
    return { pagina: usaPagina() };
  },
  components: {MdvForm, BaseMap, BaseRiquadro, MDHeader, MdvContactoButton, Markdown},
  created() {
    this.loadPage("contatti");
  },
  data() {
    return {
      helper: this.$util,
      isLoading: false,
    };
  },
  computed: {
    contattiPage() {
      return this.pagina.contatti;
    },
  },
  methods: {
    async loadPage(page) {
      this.isLoading = true;
      try {
        await this.pagina.caricaPagina(page);
      } catch (error) {
        console.error("Errore nel caricamento della pagina:", error);
      }
      this.isLoading = false;
    },
  }

}
</script>

<style scoped>
/* La scatola la disegna BaseRiquadro e i link li veste il sistema: qui
   resta solo il nome della sede, che nella fascia sta piu' grande. */
.nome-sede {
  font-size: 1.8rem;
  line-height: 1.3;
}
</style>