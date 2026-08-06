<template>
  <section>
    <MdvVideoHeader
      :image="chiSiamoPage.header.backgroundImage"
      brand="true"
      :title="chiSiamoPage.header.title"
      :caption="chiSiamoPage.header.caption"
    />

    <div class="mx-auto w-full max-w-6xl px-4 pb-12">
      <main class="my-12 px-4 text-center">
        <span class="filo" aria-hidden="true"></span>
        <h1 class="titolo my-6">{{ chiSiamoPage.main.title }}</h1>
        <p v-if="chiSiamoPage.main.caption" class="occhiello">
          {{ chiSiamoPage.main.caption }}
        </p>

        <div v-if="chiSiamoPage.main.strings" class="prosa mt-12">
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
        <header class="mb-10 text-center">
          <p class="sopratitolo">Dal blog</p>
          <h2 class="titolo-blog">Ultimi articoli</h2>
        </header>

        <div class="griglia-blog" v-rivela>
          <MdvBlogCard
            v-for="(post, i) in articoli"
            :key="post.id"
            :class="{ 'in-rilievo': i === 0 }"
            :rilievo="i === 0"
            :title="post.title"
            :image-url="immaginePost(post)"
            :ref-link="post.url"
            :publish-date="parseDate(post.published)"
          />
        </div>

        <p class="mt-12 text-center">
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
.filo {
  display: block;
  width: 9rem;
  height: 1px;
  margin: 0 auto;
  background: linear-gradient(90deg, transparent, var(--mdv-sabbia), transparent);
}
.titolo {
  font-family: var(--mdv-font-corpo);
  font-weight: 400;
  font-size: 2.8rem;
  line-height: 1.2;
}
.occhiello {
  font-family: var(--mdv-font-corpo);
  font-size: 1.4rem;
  line-height: 1.75;
  font-style: italic;
}
.prosa p {
  font-family: var(--mdv-font-alternativo);
  font-size: 1.2rem;
}

/* ── Dal blog ────────────────────────────────────────────────────────── */
.sezione-blog {
  background-color: var(--mdv-fondo-scheda);
}
.sopratitolo {
  margin-bottom: var(--mdv-spazio-2);
  font-family: var(--mdv-font-navigazione);
  font-size: 0.75rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--mdv-oro);
}
.titolo-blog {
  font-family: var(--mdv-font-corpo);
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  color: var(--mdv-bruno-900);
  margin: 0;
}

/* In colonna sul telefono; su schermo largo il primo occupa la colonna
   grande e gli altri due si impilano accanto. */
.griglia-blog {
  display: grid;
  gap: var(--mdv-spazio-6) var(--mdv-spazio-5);
}
@media (min-width: 62rem) {
  .griglia-blog {
    grid-template-columns: 3fr 2fr;
    align-items: start;
  }
  .griglia-blog .in-rilievo {
    grid-row: span 2;
  }
}
</style>