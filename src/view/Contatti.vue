<template>
  <section>
    <!-- Intestazione e modulo arrivano dal JSON locale: sono qui dal primo
         fotogramma. Solo le sedi aspettano la rete, e lo dicono al loro
         posto invece di far sparire la pagina intera. -->
    <MDHeader :image="contattiPage.header.backgroundImage"
              :title="contattiPage.header.title"/>

    <div class="container">

      <div v-if="isLoading" class="py-5">
        <base-spinner></base-spinner>
      </div>

        <div v-for="(place, index) in contattiPage.places" v-bind:key="index" class="row my-4" >
          <div class="col-sm-12">
            <div class="card">
              <div class="card-header">
                <div class="text-center fs-2">{{ place.title }}</div>
              </div>
              <div class="card-body">
                <div class="row my-4">
                  <div class="col col-lg-12 align-self-start">
                    <BaseMap :lat="place.lat" :lng="place.lng"></BaseMap>
                  </div>
                </div>
                <div class="row my-4">
                  <div class="col col-lg-4">
                    <MdvContactoButton>
                      <template v-slot:card-header>
                        <i class="fa-solid fa-location-dot"></i>
                      </template>
                      <template v-slot:body>
                        <p v-for="(addr, index) in place.address" v-bind:key="index">
                          <Markdown :source="addr"></Markdown>
                        </p>
                      </template>
                    </MdvContactoButton>
                  </div>
                  <div class="col col-lg-4">
                    <MdvContactoButton>
                      <template v-slot:card-header>
                        <i class="fa-solid fa-phone"></i>
                      </template>
                      <template v-slot:body>
                        <p class="fw-bold"></p>
                        <p><Markdown :source="place.phone.title"></Markdown><a :href="`tel:0039${place.phone.number}`" >{{ place.phone.number }}</a></p>
                      </template>
                    </MdvContactoButton>
                  </div>
                  <div class="col col-lg-4">
                    <MdvContactoButton>
                      <template v-slot:card-header>
                        <i class="fa-regular fa-envelope"></i>
                      </template>
                      <template v-slot:body>
                        <p v-for="(email, index) in place.emails" v-bind:key="index">
                          <Markdown :source="email.title"></Markdown>
                          <a :href="`mailto:${email.email}`">{{ email.email }}</a>
                        </p>
                      </template>
                    </MdvContactoButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row my-4">
          <MdvForm :title="contattiPage.form.title"
                   :button-name="contattiPage.form.buttonName"
                   :name-field="contattiPage.form.nameField"
                   :last-name-field="contattiPage.form.lastNameField"
                   :text-field="contattiPage.form.messageField"
          />
        </div>


    </div>
  </section>
</template>

<script>
import { usaPagina } from '@/store/pagina.mjs';
import MDHeader from "@/components/layout/MdvHeader.vue";
import MdvContactoButton from "@/components/MdvContactButton.vue";
import MdvForm from "@/components/MdvForm.vue";
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
  components: {MdvForm, BaseMap, MDHeader, MdvContactoButton, Markdown},
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
.card {
  border: 0;
}
.card-header{
  font-family: var(--mdv-font-corpo);
  color: var(--mdv-bianco);
  border: 0;
  background: var(--mdv-bruno-900-velato);
}
a {
  text-decoration: none;
  color: var(--mdv-oro);
  margin-bottom: 1.2rem;
}
a:hover, a:focus {
  color: var(--mdv-oro-scuro);
}
</style>