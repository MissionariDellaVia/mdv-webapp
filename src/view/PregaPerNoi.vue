<template>
  <section>
    <MDHeader
      :image="pregaConNoiPage.header.backgroundImage"
      :title="pregaConNoiPage.header.title"
      :caption="pregaConNoiPage.header.caption"
    />

    <div class="mx-auto w-full max-w-6xl px-4">
      <main class="my-12 px-4 text-center">
        <h1 class="titolo my-6">{{ pregaConNoiPage.main.title }}</h1>
        <div v-if="pregaConNoiPage.main.caption" class="occhiello">
          <Markdown :source="pregaConNoiPage.main.caption" :html="true" class="markdown-mdv" />
        </div>

        <div v-if="pregaConNoiPage.main.strings" class="prosa mt-12">
          <p v-for="(testo, index) in pregaConNoiPage.main.strings" :key="index">
            <Markdown :source="testo" :html="true" class="markdown-mdv" />
          </p>
        </div>
      </main>

      <div class="my-12 grid gap-6 sm:grid-cols-2">
        <img
          v-for="(image, index) in pregaConNoiPage.main.images"
          :key="index"
          :src="helper.getImgUrl(image.url)"
          :alt="image.alt"
          class="h-auto w-full"
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
.titolo {
  font-family: var(--mdv-font-corpo);
  font-weight: 400;
  font-size: 2.8rem;
}
.occhiello {
  font-family: var(--mdv-font-corpo);
  font-size: 1.4rem;
  line-height: 1.75;
  font-style: italic;
}
.prosa :deep(p),
.prosa p {
  font-family: var(--mdv-font-alternativo);
  font-size: 1.2rem;
}
</style>
