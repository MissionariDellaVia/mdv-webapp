<template>
  <section>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>

    <div v-else >
      <MDHeader :image="pregaConNoiPage.header.backgroundImage"
                :title="pregaConNoiPage.header.title"
                :caption="pregaConNoiPage.header.caption"/>

      <div class="container">
        <!-- Main Section -->
        <main>
          <div class="row text-center my-5">
            <div class="col-12 px-5">
              <h1 class="main-title my-4"> {{ pregaConNoiPage.main.title }} </h1>
              <h4 v-if="pregaConNoiPage.main.caption" class="caption"> <Markdown :source="pregaConNoiPage.main.caption" :html="true" class="markdown-mdv"></Markdown></h4>
            </div>
          </div>
          <div v-if="pregaConNoiPage.main.strings" class="row text-center my-5">
            <div class="col-md-12 col-sm-12 px-5">
              <p v-for="(text, index) in pregaConNoiPage.main.strings" v-bind:key="index">
                <Markdown :source="text" :html="true" class="markdown-mdv"></Markdown>
              </p>
            </div>
          </div>
        </main>

        <div class="row text-center gy-4 my-5">
          <div v-for="(image, index) in pregaConNoiPage.main.images" v-bind:key="index" class="col-md-6 col-sm-12" >
            <img :src=helper.getImgUrl(image.url) class="img-fluid" :alt="image.alt"/>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import MDHeader from "@/components/layout/MdvHeader";
import Markdown from 'vue3-markdown-it';

export default {
  name: "PregaPerNoiPage",
  components: { MDHeader, Markdown},
  created() {
    this.loadPage("prega-con-noi");
  },
  data() {
    return {
      helper: this.$util,
      isLoading: false,
    };
  },
  computed: {
    pregaConNoiPage() {
      return this.$store.getters['page/pregaConNoi'];
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