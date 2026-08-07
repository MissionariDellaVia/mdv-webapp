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

      <div class="griglia-immagini">
        <!-- Il contenitore porta la comparsa allo scorrimento, l'immagine
             porta il suo aspetto. Tenerli separati non e' pignoleria:
             .da-rivelare dichiara transform e transition, e uno stile con
             ambito — che sta fuori dai layer — li batterebbe entrambi,
             spegnendo la comparsa senza nessun errore. -->
        <div
          v-for="(image, index) in pregaConNoiPage.main.images"
          :key="index"
          v-rivela
          :style="{ transitionDelay: `${index * 120}ms` }"
          class="copertina"
        >
          <img
            :src="helper.getImgUrl(image.url)"
            :alt="image.alt"
            loading="lazy"
            decoding="async"
            class="copertina__foglio"
          />
        </div>
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
/* Erano due rettangoli a mezza pagina l'uno, e a quella misura una
   copertina smette di essere un oggetto e diventa uno sfondo. Piccole e
   affiancate al centro si leggono per quello che sono: due libretti
   posati sulla pagina. */
.griglia-immagini {
  margin-block: var(--mdv-ritmo-sezione);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: clamp(var(--mdv-spazio-5), 7vw, var(--mdv-spazio-6));
}

.copertina {
  width: clamp(9.5rem, 22vw, 13rem);
  max-width: 100%;
}

/* Sono copertine, e le copertine sono in formato A: dichiararne la
   proporzione fa riservare lo spazio prima che l'immagine arrivi, cosi'
   la pagina non salta al caricamento e la comparsa allo scorrimento non
   parte su un riquadro ancora alto zero.
   "contain" e' la rete: se un giorno arriva un'immagine di un'altra
   forma, resta bordata invece di essere stirata. */
.copertina__foglio {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1.414;
  object-fit: contain;
  border-radius: var(--mdv-raggio-s);
  /* Due ombre, non una: quella corta e stretta e' il contatto con la
     pagina, quella lunga e diffusa e' la luce dell'ambiente. E' la
     differenza fra un'immagine incollata e un oggetto appoggiato. */
  box-shadow:
    0 0.15rem 0.4rem var(--mdv-ombra-lieve),
    0 1rem 2.25rem var(--mdv-ombra-lieve);
  transition:
    transform 420ms var(--mdv-curva-morbida),
    box-shadow 420ms var(--mdv-curva-morbida);
}

/* Solo dove c'e' davvero un puntatore: su un telefono lo stato di
   passaggio resta appiccicato dopo il tocco. */
@media (hover: hover) {
  .copertina__foglio:hover {
    transform: translateY(-0.5rem);
    box-shadow:
      0 0.25rem 0.6rem var(--mdv-ombra-lieve),
      0 1.75rem 3.25rem var(--mdv-ombra-media);
  }
}

@media (prefers-reduced-motion: reduce) {
  .copertina__foglio {
    transition: none;
  }
}

.prosa :deep(p),
.prosa p {
  font-family: var(--mdv-font-alternativo);
  font-size: var(--mdv-testo-l);
}
</style>
