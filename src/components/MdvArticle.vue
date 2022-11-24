<template>
<div class="card">
  <image-dialog :show="!!image.show" :imageLink="image.link" @close="cleanImageDialog"></image-dialog>
  <div v-if="title" class="card-header">
    <div v-show="'right' === align" class="text-md-start fs-3">{{ title }}</div>
    <div v-show="'left' === align" class="text-md-end fs-3">{{ title }}</div>
  </div>
  <div class="card-body">
    <div v-if="imageUrl" class="row my-4">
      <div class="col col-sm-12 text-center" :class="imgArticleClass.imgCssClass">
        <Carousel v-if="Array.isArray(imageUrl)" :pauseAutoplayOnHover="true" :transition="800" :autoplay="3000" :wrap-around="true" :breakpoints="breakpoints" class="mb-3" >
          <Slide v-for="(img, index) in imageUrl" :key="index">
            <div class="carousel__item ">
              <img :src=helper.getImgUrl(img) @click="showImage(img)" class="carousel-preview-img" alt="imageUrl">
            </div>
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel>
        <img v-else :src=helper.getImgUrl(imageUrl) class="img-fluid" :class="{'small-img' : small}" alt="imageUrl">
      </div>
      <div class="col col-sm-12 text-start" :class="imgArticleClass.textCssClass" >
        <p v-for="(text, index) in texts" v-bind:key="index" >
          <Markdown :source="text" :html="true" class="markdown-mdv"></Markdown>
        </p>
      </div>
    </div>
    <div v-else class="row my-4">
      <div class="col col-sm-12 align-self-start">
        <p v-for="(text, index) in texts" v-bind:key="index" >
          <Markdown :source="text" :breaks="true" class="markdown-mdv"></Markdown>
        </p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Markdown from 'vue3-markdown-it';
import { Carousel, Navigation, Slide } from 'vue3-carousel'

export default {
  name: "MdvArticle",
  components: {Markdown, Carousel, Navigation, Slide},
  props: ['title', 'texts', 'align', 'imageUrl', 'small'],
  data(){
    return {
      helper: this.$util,
      image: {
        show: null,
        link: ''
      },
      breakpoints: {
        // 700px and up
        400: {
          itemsToShow: 1,
        },
        // 1024 and up
        1280: {
          itemsToShow: 2.10,
        },
        // 1024 and up
        1440: {
          itemsToShow: 3.59,
        }
      }

    }
  },
  computed: {
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
.card {
  border: 0;
}
.card-header{
  font-family: 'Playfair Display', sans-serif;
  color: #fff;
  border: 0;
  background: rgb(40, 29, 2, 0.9);
}
p {
  font-family: 'Old Standard TT', sans-serif;
  font-size: 1.3rem;
}
.small-img {
  max-width: 22rem;
  margin: auto;
}
.carousel__item {
  object-fit: cover !important;
}
.carousel-preview-img{
  max-width: 15rem;
  cursor: pointer;
}

.carousel__slide {
  padding: 1.4rem;
}
.carousel__track {
  transform-style: preserve-3d;
}
.carousel__slide--sliding {
  transition: 0.5s;
}
.carousel__slide {
  opacity: 0.9;
  transform: rotateY(-20deg) scale(0.8);
}
.carousel__slide--active ~ .carousel__slide {
  transform: rotateY(20deg) scale(0.8);
}
.carousel__slide--prev {
  opacity: 1;
  transform: rotateY(-10deg) scale(0.85);
}
.carousel__slide--next {
  opacity: 1;
  transform: rotateY(10deg) scale(0.85);
}
.carousel__slide--active {
  opacity: 1;
  transform: rotateY(0) scale(1);
}


@media only screen and (max-width: 480px) {
  img {
    max-width: 19rem !important;
    padding: 0 !important;
    margin-bottom: 1rem !important;
  }
  .card-header {
    text-align: center;
  }
}
</style>