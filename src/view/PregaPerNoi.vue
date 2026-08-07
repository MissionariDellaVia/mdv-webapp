<template>
  <section>
    <MDHeader
      :image="pregaConNoiPage.header.backgroundImage"
      :title="pregaConNoiPage.header.title"
      :caption="pregaConNoiPage.header.caption"
    />

    <div class="mx-auto w-full max-w-6xl px-4">
      <main class="my-12 px-4 text-center">
        <h1 class="mdv-titolo-pagina my-6">{{ pregaConNoiPage.main.title }}</h1>
        <div v-if="pregaConNoiPage.main.caption" class="mdv-sottotitolo">
          <Markdown :source="pregaConNoiPage.main.caption" :html="true" class="markdown-mdv" />
        </div>

        <div v-if="pregaConNoiPage.main.strings" v-rivela class="prosa mt-12">
          <p v-for="(testo, index) in pregaConNoiPage.main.strings" :key="index">
            <Markdown :source="testo" :html="true" class="markdown-mdv" />
          </p>
        </div>
      </main>

      <div class="griglia-immagini grid gap-6 sm:grid-cols-2">
        <img
          v-for="(image, index) in pregaConNoiPage.main.images"
          :key="index"
          v-rivela
          :style="{ transitionDelay: `${index * 120}ms` }"
          :src="helper.getImgUrl(image.url)"
          :alt="image.alt"
          loading="lazy"
          decoding="async"
          class="copertina h-auto w-full"
        />
      </div>
    </div>
  </section>
</template>

<script>
import MDHeader from "@/components/layout/MdvHeader.vue";
import Markdown from 'vue3-markdown-it';
import { usaPagina } from '@/store/pagina.mjs';

export default {
  name: "PregaPerNoiPage",
  setup() {
    return { pagina: usaPagina() };
  },
  components: { MDHeader, Markdown },
  // Questa pagina legge solo il JSON locale: il contenuto c'e' gia' al
  // primo disegno. Lo spinner che la avvolgeva aspettava una promessa che
  // si risolveva nello stesso istante, e faceva solo sparire la pagina.
  created() {
    this.pagina.caricaPagina("prega-con-noi");
  },
  data() {
    return { helper: this.$util };
  },
  computed: {
    pregaConNoiPage() {
      return this.pagina.pregaConNoi;
    },
  },
}
</script>

<style scoped>
.griglia-immagini {
  margin-block: var(--mdv-ritmo-sezione);
}

/* Sono copertine, e le copertine sono in formato A: dichiararne la
   proporzione fa riservare lo spazio prima che l'immagine arrivi, cosi'
   la pagina non salta al caricamento e la rivelazione allo scorrimento
   non parte su un riquadro ancora alto zero.
   "contain" e' la rete: se un giorno arriva un'immagine di un'altra
   forma, resta bordata invece di essere stirata. */
.copertina {
  aspect-ratio: 1 / 1.414;
  object-fit: contain;
}

.prosa :deep(p),
.prosa p {
  font-family: var(--mdv-font-alternativo);
  font-size: var(--mdv-testo-l);
}
</style>
