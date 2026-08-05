<template>
  <BaseRiquadro>
    <template v-if="title" #testata>
      <div class="text-center fs-3">{{ title }}</div>
    </template>

    <div v-if="imageUrl" class="row my-4">
      <div class="col col-sm-12 clearfix">
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
          v-else
          :src="helper.getImgUrl(imageUrl)"
          class="float-sm-none img-fluid"
          :class="'right' === align ? 'float-md-start pe-3' : 'float-md-end ps-3'"
          alt=""
        />
        <p class="text-start" v-for="(text, index) in texts" v-bind:key="index">
          <Markdown :source="text"></Markdown>
        </p>
      </div>
    </div>

    <div v-else class="row my-4">
      <div class="col col-sm-12 align-self-start">
        <p v-for="(text, index) in texts" v-bind:key="index">
          <Markdown :source="text"></Markdown>
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
p {
  font-family: var(--mdv-font-alternativo);
  font-size: 1.3rem;
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
</style>
