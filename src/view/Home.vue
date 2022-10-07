<template>
  <section>
    <MDHeader :image="chiSiamoPage.header.backgroundImage" brand="true"
              :title="chiSiamoPage.header.title"
              :caption="chiSiamoPage.header.caption"/>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <div v-else class="container">
      <div class="row text-center my-5">
        <img src="../assets/img/hr.png" alt="hr" class="hr-img">
        <div class="col-12 px-5">
          <h1 class="main-title my-2"> {{ chiSiamoPage.main.title }} </h1>
          <h4 class="caption"> {{ chiSiamoPage.main.caption }} </h4>
        </div>
      </div>
      <div class="row text-center my-5">
        <div class="col-md-12 col-sm-12 px-5">
          <p v-for="(text, index) in chiSiamoPage.main.strings" v-bind:key="index">{{ text }}</p>
        </div>
<!--        <div class="col-md-6 col-sm-12">-->
<!--          <img :src=helper.getImgUrl(chiSiamoPage.main.image.url) class="img-fluid" alt="fotoHome2"/>-->
<!--        </div>-->
      </div>

      <MdvSection v-for="(section, index) in chiSiamoPage.sections" v-bind:key="index"
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
import configurationPage from '@/assets/data/chiSiamo.json';
import MdvSection from "@/components/MdvSection";

export default {
  name: "HomePage",
  components: {MdvSection, MDHeader},
  created () {
    this.loadPage("chi-siamo");
  },
  data() {
    return {
      helper: this.$util,
      isLoading: false,
    };
  },
  computed: {
    chiSiamoPage() {
      return this.$store.getters['page/chiSiamo'];
    },
    title() {
      return configurationPage.header.title;
    }
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
.hr-img {
  width: 30%;
  margin: auto;
}
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