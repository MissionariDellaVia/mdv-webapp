<template>
  <section>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <div v-else >
      <MdvVideoHeader :image="chiSiamoPage.header.backgroundImage" brand="true"
                :title="chiSiamoPage.header.title"
                :caption="chiSiamoPage.header.caption"/>

      <div class="container mb-5">
        <main>
          <div class="row text-center my-5">
            <img src="../assets/img/hr.png" alt="hr" class="hr-img">
            <div class="col-12 px-5">
              <h1 class="main-title my-4"> {{ chiSiamoPage.main.title }} </h1>
              <h4 v-if="chiSiamoPage.main.caption" class="caption"> {{ chiSiamoPage.main.caption }} </h4>
            </div>
          </div>
          <div v-if="chiSiamoPage.main.strings" class="row text-center my-5">
            <div class="col-md-12 col-sm-12 px-5">
              <p v-for="(text, index) in chiSiamoPage.main.strings" v-bind:key="index">{{ text }}</p>
            </div>
          </div>
        </main>
        <MdvArticle v-for="(section, index) in chiSiamoPage.sections" v-bind:key="index"
                    :image-url="section.image ? section.image.url : null"
                    :align="section.image ? section.image.align : null"
                    :title="section.title"
                    :texts="section.strings"/>

      </div>
    </div>

    <section class="blog-shadow py-5">
      <div class="container">
        <div class="row my-4">
          <div class="col-sm-12 text-center blog-title">
            <h1>Blog</h1>
          </div>
        </div>

        <!-- Gli ultimi articoli stanno in griglia, non in un carosello:
             qui si vedono tutti insieme e nessuno deve aspettare che
             ruotino per sapere cosa c'e'. -->
        <div class="griglia-blog">
          <MdvBlogCard v-for="post in lastBlogPosts" :key="post.id"
                       :title="post.title"
                       :image-url="post.images[0].url"
                       :ref-link="post.url"
                       :publish-date="parseDate(post.published)"
          />
        </div>

      </div>
    </section>

  </section>
</template>

<script>
import MdvVideoHeader from "@/components/layout/MdvVideoHeader.vue";
import MdvArticle from "@/components/MdvArticle.vue";
import MdvBlogCard from "@/components/MdvBlogCard.vue";

export default {
  name: "HomePage",
  components: { MdvArticle, MdvVideoHeader, MdvBlogCard },
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
  },
  methods: {
    async loadPage(page) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('page/loadPage', page);
      } catch (error) {
        console.error("Errore nel caricamento della pagina:", error);
      }
      this.isLoading = false;
    },
    async loadBlogPosts(postNumber) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('blog/loadBlogPost', postNumber);
      } catch (error) {
        console.error("Errore nel caricamento della pagina:", error);
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
/* Tre schede affiancate dove ci stanno, in colonna dove no. Non c'e' una
   tabella di soglie: le colonne le decide lo spazio disponibile. */
.griglia-blog {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
  gap: var(--mdv-spazio-5);
  align-items: start;
  justify-items: center;
}

.hr-img {
  width: 15rem;
  margin: auto;
}
.main-title {
  font-family: var(--mdv-font-corpo);
  font-weight: 400 !important;
  font-size: 2.8rem;
}
.caption {
  font-family: var(--mdv-font-corpo);
  line-height: 1.75;
  font-style: italic;
}
p {
  font-family: var(--mdv-font-alternativo);
  font-size: 1.2rem;
}
.blog-shadow {
  -webkit-box-shadow: inset 0 2px 12.5px 6px var(--mdv-nebbia);
  -moz-box-shadow: inset 0 2px 12.5px 6px var(--mdv-nebbia);
  box-shadow: inset 0 2px 12.5px 6px var(--mdv-nebbia);
}
.blog-title {
  font-family: var(--mdv-font-corpo);
  color: var(--mdv-bruno-900);
}
.carousel__slide {
  padding: 1.4rem;
}
.carousel__track {
  transform-style: preserve-3d;
}
.carousel__slide--sliding {
  transition: 0.5s;
}
.carousel__slide {
  opacity: 0.9;
  transform: rotateY(-20deg) scale(0.8);
}
.carousel__slide--active ~ .carousel__slide {
  transform: rotateY(20deg) scale(0.8);
}
.carousel__slide--prev {
  opacity: 1;
  transform: rotateY(-10deg) scale(0.85);
}
.carousel__slide--next {
  opacity: 1;
  transform: rotateY(10deg) scale(0.85);
}
.carousel__slide--active {
  opacity: 1;
  transform: rotateY(0) scale(1);
}

</style>