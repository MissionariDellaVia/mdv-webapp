<template>
  <section>
    <MDHeader :image="attivitaPage.header.backgroundImage"
              :title="attivitaPage.header.title"
              :caption="attivitaPage.header.caption"/>

    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>

    <div v-else class="container">

      <!-- Main Section -->
      <div class="row text-center my-5">
        <div class="col-12 px-5">
          <h1 class="main-title my-2"> {{ attivitaPage.main.title }} </h1>
          <h4 class="caption"> {{ attivitaPage.main.caption }} </h4>
        </div>
      </div>

      <!-- Article Section -->
      <MdvGroups :groups="attivitaPage.groups"/>


    </div>
  </section>
</template>

<script>
import MDHeader from "@/components/layout/MdvHeader";
import MdvGroups from "@/components/MdvGroups";

export default {
  name: "AttivitaPage",
  components: {MdvGroups, MDHeader},
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