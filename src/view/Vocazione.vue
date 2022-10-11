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
      <div class="row text-center gy-4 my-5">
        <div class="col-md-6 col-sm-12" :class="{'order-last' : vocazionePage.main.image.align === 'right'}">
          <img :src=helper.getImgUrl(vocazionePage.main.image.url) class="img-fluid" :alt="vocazionePage.main.image.url"/>
        </div>
        <div class="col-md-6 col-sm-12 px-5 text-start">
          <p v-for="(text, index) in vocazionePage.main.strings" v-bind:key="index">
            <Markdown :source="text" class="md"></Markdown>
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import MDHeader from "@/components/layout/MdvHeader";
import Markdown from 'vue3-markdown-it';

export default {
  name: "VocazioniPage",
  components: { MDHeader, Markdown},
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
  font-family: 'Playfair Display', sans-serif;
  font-weight: 400 !important;
  font-size: 2.8rem;
}
.caption {
  font-family: 'Playfair Display', serif;
  line-height: 1.75;
  font-style: italic;
}
p {
  font-family: 'Old Standard TT', sans-serif;
  font-size: 1.2rem;
}
a {
  text-decoration: none;
  color: #8c681c !important;
  margin-bottom: 1.2rem;
}
.md a:hover, .md a:focus {
  color: #59411a;
}

</style>