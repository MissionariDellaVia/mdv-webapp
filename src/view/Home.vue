<template>
  <section>
    <MDHeader :image="chiSiamoPage.header.backgroundImage" brand="true"
              :title="chiSiamoPage.header.title"
              :caption="chiSiamoPage.header.caption"/>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <div v-else class="container mb-5">
      <main>
        <div class="row text-center my-5">
          <img src="../assets/img/hr.png" alt="hr" class="hr-img">
          <div class="col-12 px-5">
            <h1 class="main-title my-4"> {{ chiSiamoPage.main.title }} </h1>
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
      </main>

      <MdvSection v-for="(section, index) in chiSiamoPage.sections" v-bind:key="index"
          :title="section.title"
          :align="section.image.align"
          :image="section.image.url"
          :articles="section.strings"
      />
    </div>

    <section class="blog-shadow py-5">
      <div class="container">
        <div class="row my-4">
          <div class="col-sm-12 text-center blog-title">
            <h1>Blog</h1>
          </div>
        </div>

        <div class="row my-4">
          <div class="col-md-4 col-sm-12" v-for="post in lastBlogPosts" v-bind:key="post.id">
            <MdvBlogCard :title="post.title"
                         :image-url="post.images[0].url"
                         :ref-link="post.url"
                         :publish-date="parseDate(post.published)"
            />

          </div>
        </div>
      </div>
    </section>

    <section class="bg-prega-con-noi">
      <div class="container py-5">
        <div class="row my-5">
          <div class="col-sm-12 text-center">
            <h1 class="main-title mb-4">Prega con noi</h1>
            <p class="caption fs-4">Per pregare con noi, puoi scaricare l’app gratuita <strong>“Missionari della Via”</strong> con il commento al Vangelo del giorno, disponibile sia su Play Store che su App Store.<br><br>
              Oppure puoi richiedere la versione cartacea <strong>“La Via del Vangelo”</strong> (se fossi interessato, SCRIVICI).<br><br>
              Se volessi pregare il Rosario meditato, puoi richiedere il libro <strong>“La Via di Maria”</strong> oppure le due versioni tascabili (se
              fossi interessato, SCRIVICI).<br><br>
            </p>
          </div>
        </div>
      </div>
    </section>

  </section>
</template>

<script>
import MDHeader from "@/components/layout/MdvHeader";
import configurationPage from '@/assets/data/chiSiamo.json';
import MdvSection from "@/components/MdvSection";
import MdvBlogCard from "@/components/MdvBlogCard";

export default {
  name: "HomePage",
  components: { MdvSection, MDHeader, MdvBlogCard},
  created () {
    this.loadPage("chi-siamo");
    this.loadBlogPosts(3);
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
    lastBlogPosts() {
      return this.$store.getters['blog/posts'];
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
    async loadBlogPosts(postNumber) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('blog/loadBlogPost', postNumber);
      } catch (error) {
        // this.showToast(error.message || 'Errore caricamento pagina!');
      }
      this.isLoading = false;
    },
    parseDate(date) {
      return new Date(date);
    }

  }
}
</script>

<style scoped>
.hr-img {
  width: 30%;
  margin: auto;
}
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
.blog-shadow {
  -webkit-box-shadow: inset 0 2px 12.5px 6px #dddddd;
  -moz-box-shadow: inset 0 2px 12.5px 6px #dddddd;
  box-shadow: inset 0 2px 12.5px 6px #dddddd;
}
.blog-title {
  font-family: 'Playfair Display', sans-serif;
  color: rgb(40, 29, 2);
}
.bg-prega-con-noi{
  background: url("../assets/img/default.jpg")  no-repeat center;
  min-height: 40rem;
  background-size: cover;
  box-shadow:inset 0 0 0 2000px rgba(0, 0, 0, 0.60);
  color: whitesmoke;
}
</style>