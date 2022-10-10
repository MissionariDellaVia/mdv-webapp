<template>
<div class="card">
  <div v-if="title" class="card-header">
    <div class="text-end fs-2">{{ title }}</div>
  </div>
  <div class="card-body">
    <div v-if="imageUrl" class="row my-4">
      <div class="col col-md-4 col-sm-12 " :class="{'order-last text-end' : 'right' === align}">
        <img :src=helper.getImgUrl(imageUrl) class="img-fluid" alt="imageUrl">
      </div>
      <div class="col col-md-8 col-sm-12 align-self-start" :class="'right' === align ? 'text-start' : 'text-end'">
        <p v-for="(text, index) in texts" v-bind:key="index" >
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
  name: "MdvArticle",
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
  max-width: 22rem;
  margin: auto;
}
</style>