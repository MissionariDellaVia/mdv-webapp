<template>
<div class="card">
  <div v-if="title" class="card-header">
    <div class="text-center fs-3">{{ title }}</div>
  </div>
  <div class="card-body">
    <div v-if="imageUrl" class="row my-4">
      <div class="col col-sm-12 clearfix">
        <Carousel v-if="Array.isArray(imageUrl)" :pauseAutoplayOnHover="true" :transition="500" :autoplay="3000" :wrap-around="true" :breakpoints="breakpoints" class="mb-3">
          <Slide v-for="(img, index) in imageUrl" :key="index">
            <div class="carousel__item">
              <img :src=helper.getImgUrl(img) class="img-fluid" alt="imageUrl">
            </div>
          </Slide>
          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </Carousel>
        <img v-else :src=helper.getImgUrl(imageUrl) class="float-sm-none  img-fluid" :class="'right' === align ? 'float-md-start pe-3' : 'float-md-end ps-3'" alt="imageUrl">
        <p class="text-start" v-for="(text, index) in texts" v-bind:key="index" >
          <Markdown :source="text"></Markdown>
        </p>
      </div>
    </div>
    <div v-else class="row my-4">
      <div class="col col-sm-12 align-self-start">
        <p v-for="(text, index) in texts" v-bind:key="index" >
          <Markdown :source="text"></Markdown>
        </p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Markdown from 'vue3-markdown-it';
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'

export default {
  name: "MdvLongArticle",
  components: {Markdown, Carousel, Slide, Navigation, Pagination},
  props: ['title', 'texts', 'align', 'imageUrl'],
  data(){
    return {
      helper: this.$util,
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
          itemsToShow: 2.40,
        }
      }
    }
  },
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
img {
  max-width: 30rem;
  margin: auto;
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
    max-width: 20rem;
    padding: 0 !important;
    margin-bottom: 1rem;
  }
  .card-header {
    text-align: center;
  }
}
</style>