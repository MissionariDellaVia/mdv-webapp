<template>
  <BaseRiquadro>
    <template v-if="title" #testata>
      <div :class="allineamentoTitolo">{{ title }}</div>
    </template>

    <image-dialog :show="!!image.show" :imageLink="image.link" @close="cleanImageDialog"></image-dialog>

    <div v-if="imageUrl" class="row my-4">
      <div class="col col-sm-12 text-center" :class="imgArticleClass.imgCssClass">
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
        <img v-else :src="helper.getImgUrl(imageUrl)" class="img-fluid" :class="{'small-img' : small}" alt="">
      </div>
      <div class="col col-sm-12 text-start" :class="imgArticleClass.textCssClass">
        <p v-for="(text, index) in texts" v-bind:key="index">
          <Markdown :source="text" :html="true" class="markdown-mdv"></Markdown>
        </p>
      </div>
    </div>

    <div v-else class="row my-4">
      <div class="col col-sm-12 align-self-start">
        <p v-for="(text, index) in texts" v-bind:key="index">
          <Markdown :source="text" :breaks="true" class="markdown-mdv"></Markdown>
        </p>
      </div>
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
    allineamentoTitolo() {
      return 'right' === this.align ? 'text-md-start fs-3' : 'text-md-end fs-3';
    },
    imgArticleClass() {
      if (Array.isArray(this.imageUrl))
        return {"imgCssClass" : "order-last"};
      let imgCssClass = this.small ? "col-md-4 " : "col-md-6 ";
      let textCssClass = this.small ? "col-md-8 " : "col-md-6 ";

      imgCssClass += 'right' === this.align ? "order-md-last text-end" : "";

      return {
        "imgCssClass" : imgCssClass,
        "textCssClass": textCssClass
      }
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
p {
  font-family: var(--mdv-font-alternativo);
  font-size: 1.3rem;
}
.small-img {
  max-width: 22rem;
  margin: auto;
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

@media only screen and (max-width: 480px) {
  img {
    max-width: 19rem !important;
    padding: 0 !important;
    margin-bottom: 1rem !important;
  }
}
</style>
