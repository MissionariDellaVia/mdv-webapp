<template>
  <section>

    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <div v-else >
      <MDHeader :image="approfondimentiPage.header.backgroundImage"
                :title="approfondimentiPage.header.title"
                :caption="approfondimentiPage.header.caption"/>

      <div class="container">
        <!-- Article Section -->
        <MdvLongArticle v-for="(section, index) in approfondimentiPage.sections" v-bind:key="index"
                        :title="section.title"
                        :align="section.image.align"
                        :imageUrl="section.image.url"
                        :texts="section.articles"
        />
      </div>
    </div>

  </section>
</template>

<script>
import MDHeader from "@/components/layout/MdvHeader";
import MdvLongArticle from "@/components/MdvLongArticle";

export default {
  name: "ApprofondimentiPage",
  components: {MdvLongArticle, MDHeader},
  created() {
    this.loadPage("approfondimenti");
  },
  data() {
    return {
      helper: this.$util,
      isLoading: false,
    };
  },
  computed: {
    approfondimentiPage() {
      return this.$store.getters['page/approfondimenti'];
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
.hr-img {
  width: 30%;
  margin: auto;
}
</style>