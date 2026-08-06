<template>
  <section>
    <MdvVideoHeader
      :image="chiSiamoPage.header.backgroundImage"
      brand="true"
      :title="chiSiamoPage.header.title"
      :caption="chiSiamoPage.header.caption"
    />

    <div class="mx-auto w-full max-w-6xl px-4 pb-12">
      <main class="apertura px-4 text-center">
        <!-- Lo stemma della comunita'. Il file si chiamava "hr.png" e la
             classe ".hr-img", nomi da linea orizzontale: l'avevo scambiato
             per un divisore decorativo e tolto. -->
        <img
          src="../assets/img/emblema.png"
          alt="Missionari della Via"
          class="emblema entra entra--2"
        />
        <h1 class="mdv-titolo-pagina my-6 entra entra--3">{{ chiSiamoPage.main.title }}</h1>
        <p v-if="chiSiamoPage.main.caption" class="mdv-sottotitolo entra entra--4">
          {{ chiSiamoPage.main.caption }}
        </p>

        <!-- Questa sta gia' sotto la piega quando la pagina apre: si
             rivela scorrendo, non all'avvio. -->
        <div v-if="chiSiamoPage.main.strings" v-rivela class="prosa mt-12">
          <p v-for="(testo, index) in chiSiamoPage.main.strings" :key="index">{{ testo }}</p>
        </div>
      </main>

      <MdvArticle
        v-for="(sezione, index) in chiSiamoPage.sections"
        :key="index"
        :image-url="sezione.image ? sezione.image.url : null"
        :align="sezione.image ? sezione.image.align : null"
        :title="sezione.title"
        :texts="sezione.strings"
      />
    </div>

    <!-- Dal blog. Il piu' recente sta in rilievo: e' l'unica cosa che i
         tre articoli hanno da dire l'uno rispetto all'altro, e vale piu'
         di tre schede uguali affiancate. -->
    <section v-if="articoli.length" class="sezione-blog py-16">
      <div class="mx-auto w-full max-w-6xl px-4">
        <header v-rivela class="mb-10 text-center">
          <p class="mdv-sopratitolo">Dal blog</p>
          <h2 class="mdv-titolo-sezione">Ultimi articoli</h2>
        </header>

        <!-- Le schede arrivano una dopo l'altra invece che tutte insieme.
             Il ritardo si ferma alla quarta: oltre, chi scorre veloce
             aspetterebbe una scheda che non e' ancora arrivata. -->
        <div class="griglia-blog">
          <MdvBlogCard
            v-for="(post, i) in articoli"
            :key="post.id"
            v-rivela
            :style="{ transitionDelay: `${Math.min(i, 3) * 90}ms` }"
            :class="{ 'in-rilievo': i === 0 }"
            :rilievo="i === 0"
            :title="post.title"
            :image-url="immaginePost(post)"
            :ref-link="post.url"
            :publish-date="parseDate(post.published)"
          />
        </div>

        <p v-rivela class="mt-12 text-center">
          <a href="https://blogdeipiccolidellavia.blogspot.com/" target="_blank"
             rel="noopener noreferrer" class="mdv-invito">
            Tutti gli articoli
            <span class="mdv-invito__freccia" aria-hidden="true">&rarr;</span>
          </a>
        </p>
      </div>
    </section>
  </section>
</template>

<script>
import { usaPagina } from '@/store/pagina.mjs';
import { usaBlog } from '@/store/blog.mjs';
import MdvVideoHeader from "@/components/layout/MdvVideoHeader.vue";
import MdvArticle from "@/components/MdvArticle.vue";
import MdvBlogCard from "@/components/MdvBlogCard.vue";

export default {
  name: "HomePage",
  setup() {
    return { pagina: usaPagina(), blog: usaBlog() };
  },
  components: { MdvArticle, MdvVideoHeader, MdvBlogCard },
  created () {
    this.loadPage("chi-siamo");
    this.loadBlogPosts(6);
  },
  data() {
    return {
      helper: this.$util,
      isLoading: false,
    };
  },
  computed: {
    chiSiamoPage() {
      return this.pagina.chiSiamo;
    },
    articoli() {
      return this.blog.articoli;
    },
  },
  methods: {
    // Un articolo senza immagini faceva esplodere post.images[0].
    immaginePost(post) {
      return post.images && post.images.length ? post.images[0].url : '';
    },
    async loadPage(page) {
      this.isLoading = true;
      try {
        await this.pagina.caricaPagina(page);
      } catch (error) {
        console.error("Errore nel caricamento della pagina:", error);
      }
      this.isLoading = false;
    },
    async loadBlogPosts(postNumber) {
      this.isLoading = true;
      try {
        await this.blog.caricaArticoli(postNumber);
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
.apertura {
  margin-block: var(--mdv-ritmo-sezione);
}

.emblema {
  width: 15rem;
  max-width: 60vw;
  height: auto;
  margin: 0 auto;
}
.prosa p {
  font-family: var(--mdv-font-alternativo);
  font-size: var(--mdv-testo-l);
}

/* ── Dal blog ────────────────────────────────────────────────────────── */
.sezione-blog {
  background-color: var(--mdv-fondo-scheda);
}

/* In colonna sul telefono, due colonne sul tablet, tre da schermo largo.
   Il piu' recente occupa due caselle per due: gli altri gli si dispongono
   intorno da soli, senza che nessuno debba contare quanti sono. */
.griglia-blog {
  display: grid;
  gap: var(--mdv-spazio-6) var(--mdv-spazio-5);
}
@media (min-width: 45rem) {
  .griglia-blog {
    grid-template-columns: repeat(2, 1fr);
    align-items: start;
  }
}
@media (min-width: 62rem) {
  .griglia-blog {
    grid-template-columns: repeat(3, 1fr);
  }
  .griglia-blog .in-rilievo {
    grid-column: span 2;
    grid-row: span 2;
  }
}
</style>