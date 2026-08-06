<template>
  <BaseRiquadro>
    <template v-if="title" #testata>
      <div :class="allineamentoTitolo">{{ title }}</div>
    </template>

    <image-dialog :show="!!image.show" :imageLink="image.link" @close="cleanImageDialog"></image-dialog>

    <div v-if="imageUrl" :class="['articolo', ...classiDisposizione]">
      <div v-rivela :class="['articolo__figura', classeEntrata]">
        <BaseCarosello v-if="Array.isArray(imageUrl)" :autoplay="3000" ciclico>
          <img
            v-for="(img, index) in imageUrl"
            :key="index"
            :src="helper.getImgUrl(img)"
            class="anteprima"
            alt=""
            @click="showImage(img)"
          />
        </BaseCarosello>
        <span v-else class="articolo__cornice">
          <img :src="helper.getImgUrl(imageUrl)" class="articolo__foto" alt="">
        </span>
      </div>

      <div v-rivela class="articolo__testo" style="transition-delay: 160ms">
        <p v-for="(text, index) in texts" :key="index">
          <Markdown :source="text" :html="true" class="markdown-mdv"></Markdown>
        </p>
      </div>
    </div>

    <div v-else class="articolo__testo">
      <p v-for="(text, index) in texts" :key="index">
        <Markdown :source="text" :breaks="true" class="markdown-mdv"></Markdown>
      </p>
    </div>
  </BaseRiquadro>
</template>

<script>
import Markdown from 'vue3-markdown-it';
import BaseRiquadro from '@/components/ui/BaseRiquadro.vue';
import BaseCarosello from '@/components/ui/BaseCarosello.vue';

export default {
  name: "MdvArticle",
  components: {Markdown, BaseRiquadro, BaseCarosello},
  props: ['title', 'texts', 'align', 'imageUrl', 'small'],
  data(){
    return {
      helper: this.$util,
      image: {
        show: null,
        link: ''
      }
    }
  },
  computed: {
    // Il titolo si accosta al lato opposto all'immagine.
    // Erano "text-md-start fs-3": due classi di Bootstrap. La misura sta
    // ora nella fascia di BaseRiquadro, l'allineamento qui.
    allineamentoTitolo() {
      return 'right' === this.align ? 'md:text-left' : 'md:text-right';
    },
    // Erano quattro classi di griglia composte a mano in una stringa.
    // Sono due sole decisioni: quanto e' larga la figura, e da che parte
    // sta. Un carosello di foto va sempre in fondo, sotto al testo.
    // La figura arriva dalla parte dove si fermera': il movimento
    // racconta la disposizione invece di essere uguale per tutto.
    classeEntrata() {
      if (Array.isArray(this.imageUrl)) return '';
      return 'right' === this.align ? 'da-rivelare--da-destra' : 'da-rivelare--da-sinistra';
    },
    classiDisposizione() {
      if (Array.isArray(this.imageUrl)) return ['articolo--galleria'];
      return [
        this.small ? 'articolo--figura-stretta' : 'articolo--meta',
        'right' === this.align ? 'articolo--figura-a-destra' : '',
      ].filter(Boolean);
    }
  },
  methods: {
    showImage(link) {
      this.image.show = true;
      this.image.link = link;
    },
    cleanImageDialog() {
      this.image.show = null;
      this.image.link = '';
    }
  }
}
</script>

<style scoped>
.articolo {
  display: grid;
  gap: var(--mdv-spazio-5);
  margin: var(--mdv-spazio-5) 0;
  align-items: center;
}
.articolo__figura {
  text-align: center;
}
/* La cornice non impone una forma: ritaglia soltanto, perche' la foto
   possa respirare all'over senza uscire dagli angoli. Le proporzioni
   restano quelle dell'immagine — forzarle a 4:3 tagliava fotografie che
   erano state inquadrate come sono. */
.articolo__cornice {
  display: inline-block;
  overflow: hidden;
  border-radius: var(--mdv-raggio-m);
  max-width: 100%;
  line-height: 0;
}
.articolo__foto {
  display: block;
  max-width: 100%;
  height: auto;
  transition: transform 900ms var(--mdv-curva-morbida);
}
@media (hover: hover) {
  .articolo:hover .articolo__foto {
    transform: scale(1.04);
  }
}
.articolo__testo :deep(p),
.articolo__testo p {
  font-family: var(--mdv-font-alternativo);
  font-size: 1.3rem;
}

/* Le vecchie regole .carousel__slide con le rotazioni in 3D erano classi
   della libreria: sparita quella, non avevano piu' niente da colpire. */
.anteprima {
  width: 15rem;
  height: 11rem;
  object-fit: cover;
  border-radius: var(--mdv-raggio-s);
  cursor: pointer;
}

/* Sotto questa larghezza figura e testo stanno uno sopra l'altro: due
   colonne su un telefono non sono due colonne, sono due strisce. */
@media (min-width: 48rem) {
  .articolo--meta {
    grid-template-columns: 1fr 1fr;
  }
  .articolo--figura-stretta {
    grid-template-columns: 1fr 2fr;
  }
  .articolo--figura-a-destra .articolo__figura {
    order: 2;
  }
}
/* La galleria occupa tutta la riga e sta sotto al testo. */
.articolo--galleria .articolo__figura {
  order: 2;
}

@media only screen and (max-width: 480px) {
  .articolo__foto {
    max-width: 19rem;
    margin-bottom: var(--mdv-spazio-3);
  }
}
</style>
