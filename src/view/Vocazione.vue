<template>
  <section>
    <MDHeader :image="vocazionePage.header.backgroundImage"
              :title="vocazionePage.header.title"
              :caption="vocazionePage.header.caption"/>

    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>

    <div v-else class="container">

      <!-- Main Section -->
      <div class="row text-center my-5">
        <div class="col-12 px-5">
          <h1 class="main-title my-2"> {{ vocazionePage.main.title }} </h1>
          <h4 class="caption"> {{ vocazionePage.main.caption }} </h4>
        </div>
      </div>
      <div class="row text-center my-5">
        <div class="col-md-6 col-sm-12" :class="{'order-last' : vocazionePage.main.image.align === 'right'}">
          <img :src=helper.getImgUrl(vocazionePage.main.image.url) class="img-fluid" :alt="vocazionePage.main.image.url"/>
        </div>
        <div class="col-md-6 col-sm-12 px-5 text-start">
          <p v-for="(text, index) in vocazionePage.main.strings" v-bind:key="index">{{ text }}</p>
        </div>
      </div>

      <!-- Article Section -->
      <MdvSection v-for="(section, index) in vocazionePage.sections" v-bind:key="index"
                  :title="section.title"
                  :align="section.image.align"
                  :image="section.image.url"
                  :articles="section.strings"
      />

    </div>
  </section>
</template>

<script>
import MDHeader from "@/components/layout/MdvHeader";
import MdvSection from "@/components/MdvSection";

export default {
  name: "VocazioniPage",
  components: {MdvSection, MDHeader},
  created() {
    this.loadPage("vocazione");
  },
  data() {
    return {
      helper: this.$util,
      isLoading: false,
    };
  },
  computed: {
    vocazionePage() {
      return this.$store.getters['page/vocazione'];
    },
  },
  methods: {
    async loadPage(page) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('page/loadPage', page);
      } catch (error) {
        // this.showToast(error.message || 'Errore caricamento pagina!');
      }
      this.isLoading = false;
    },
  }
}
</script>

<style scoped>
.main-title {
  font-family: 'Bubbler One', sans-serif;
  font-size: 3.5rem;
}
.caption {
  font-family: 'Playfair Display', serif;
  font-style: italic;
}
p {
  font-family: 'Playfair Display', sans-serif;
  font-size: larger;
}
</style>