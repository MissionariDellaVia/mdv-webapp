<template>
  <BaseRiquadro>
    <template v-if="title" #testata>
      <div class="text-center">{{ title }}</div>
    </template>

    <div class="approfondimento">
      <BaseCarosello v-if="Array.isArray(imageUrl)" :autoplay="3000" ciclico>
        <img
          v-for="(img, index) in imageUrl"
          :key="index"
          :src="helper.getImgUrl(img)"
          class="lastra"
          alt=""
        />
      </BaseCarosello>
      <img
        v-else-if="imageUrl"
        :src="helper.getImgUrl(imageUrl)"
        :class="['approfondimento__foto', 'right' === align ? 'approfondimento__foto--sinistra' : 'approfondimento__foto--destra']"
        alt=""
      />

      <p v-for="(text, index) in texts" :key="index">
        <Markdown :source="text"></Markdown>
      </p>
    </div>
  </BaseRiquadro>
</template>

<script>
import Markdown from 'vue3-markdown-it';
import BaseRiquadro from '@/components/ui/BaseRiquadro.vue';
import BaseCarosello from '@/components/ui/BaseCarosello.vue';

export default {
  name: "MdvLongArticle",
  components: {Markdown, BaseRiquadro, BaseCarosello},
  props: ['title', 'texts', 'align', 'imageUrl'],
  data(){
    return {
      helper: this.$util
    }
  }
}
</script>

<style scoped>
/* Qui il testo scorre intorno alla foto, non le sta accanto in colonna:
   sono articoli lunghi, e una colonna stretta li spezzetterebbe. */
.approfondimento::after {
  content: '';
  display: block;
  clear: both;
}
.approfondimento p {
  font-family: var(--mdv-font-alternativo);
  font-size: 1.3rem;
  text-align: left;
}

.approfondimento__foto {
  max-width: 100%;
  height: auto;
  margin-bottom: var(--mdv-spazio-3);
}
/* Le vecchie regole .carousel__slide con le rotazioni in 3D erano classi
   della libreria: sparita quella, non avevano piu' niente da colpire. */
.lastra {
  width: 30rem;
  max-width: 80vw;
  height: 20rem;
  object-fit: cover;
  border-radius: var(--mdv-raggio-s);
}

/* Il testo gira intorno alla foto solo dove c'e' spazio: su un telefono
   la foto sta sopra e il testo sotto. */
@media (min-width: 48rem) {
  .approfondimento__foto {
    max-width: 30rem;
  }
  .approfondimento__foto--sinistra {
    float: left;
    padding-right: var(--mdv-spazio-4);
  }
  .approfondimento__foto--destra {
    float: right;
    padding-left: var(--mdv-spazio-4);
  }
}
</style>
