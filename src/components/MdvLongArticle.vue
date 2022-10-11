<template>
<div class="card">
  <div v-if="title" class="card-header">
    <div v-show="'right' === align" class="text-start fs-3">{{ title }}</div>
    <div v-show="'left' === align" class="text-end fs-3">{{ title }}</div>
  </div>
  <div class="card-body">
    <div v-if="imageUrl" class="row my-4">
      <div class="col col-sm-12">
        <img v-show="'right' === align" :src=helper.getImgUrl(imageUrl) class="float-end ps-3 img-fluid" alt="imageUrl">
        <img v-show="'left' === align" :src=helper.getImgUrl(imageUrl) class="float-start pe-3 img-fluid" alt="imageUrl">
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

export default {
  name: "MdvLongArticle",
  components: {Markdown},
  props: ['title', 'texts', 'align', 'imageUrl'],
  data(){
    return {
      helper: this.$util
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
</style>