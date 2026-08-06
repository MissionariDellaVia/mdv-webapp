<template>
  <section>
    <MDHeader
      :image="vocazionePage.header.backgroundImage"
      :title="vocazionePage.header.title"
      :caption="vocazionePage.header.caption"
    />

    <div class="mx-auto w-full max-w-6xl px-4 py-12">
      <div class="mb-12 px-4 text-center">
        <h1 class="titolo my-2">{{ vocazionePage.main.title }}</h1>
        <p class="occhiello">{{ vocazionePage.main.caption }}</p>
      </div>

      <div class="corpo">
        <div
          v-rivela
          :class="['corpo__figura', vocazionePage.main.image.align === 'right'
            ? 'corpo__figura--destra da-rivelare--da-destra'
            : 'da-rivelare--da-sinistra']"
        >
          <img
            :src="helper.getImgUrl(vocazionePage.main.image.url)"
            alt=""
            class="corpo__foto"
          />
        </div>

        <div v-rivela class="corpo__testo" style="transition-delay: 160ms">
          <p v-for="(testo, index) in vocazionePage.main.strings" :key="index">
            <Markdown :source="testo" :html="true" class="markdown-mdv"></Markdown>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { usaPagina } from '@/store/pagina.mjs';
import MDHeader from "@/components/layout/MdvHeader.vue";
import Markdown from 'vue3-markdown-it';

export default {
  name: "VocazioniPage",
  setup() {
    return { pagina: usaPagina() };
  },
  components: { MDHeader, Markdown},
  created() {
    this.loadPage("vocazione");
  },
  data() {
    return { helper: this.$util };
  },
  computed: {
    vocazionePage() {
      return this.pagina.vocazione;
    },
  },
  methods: {
    async loadPage(page) {
      try {
        await this.pagina.caricaPagina(page);
      } catch (error) {
        console.error("Errore nel caricamento della pagina:", error);
      }
    },
  },

}
</script>

<style scoped>
.titolo {
  font-family: var(--mdv-font-corpo);
  font-weight: 400;
  font-size: var(--mdv-testo-2xl);
  line-height: 1.2;
}
.occhiello {
  font-family: var(--mdv-font-corpo);
  font-size: var(--mdv-testo-l);
  line-height: var(--mdv-interlinea-corpo);
  font-style: italic;
}

.corpo {
  display: grid;
  gap: var(--mdv-spazio-5);
  align-items: center;
}
.corpo__figura {
  text-align: center;
}
.corpo__foto {
  max-width: 100%;
  height: auto;
  margin: auto;
  border-radius: var(--mdv-raggio-m);
}
.corpo__testo :deep(p),
.corpo__testo p {
  font-family: var(--mdv-font-alternativo);
  font-size: var(--mdv-testo-l);
}

@media (min-width: 48rem) {
  .corpo {
    grid-template-columns: 1fr 1fr;
  }
  .corpo__figura--destra {
    order: 2;
  }
}
</style>