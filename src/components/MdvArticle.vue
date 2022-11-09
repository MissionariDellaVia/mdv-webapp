<template>
<div class="card">
  <div v-if="title" class="card-header">
    <div v-show="'right' === align" class="text-md-start fs-3">{{ title }}</div>
    <div v-show="'left' === align" class="text-md-end fs-3">{{ title }}</div>
  </div>
  <div class="card-body">
    <div v-if="imageUrl" class="row my-4">
      <div class="col col-sm-12 text-center" :class="imgArticleClass.imgCssClass">
        <img :src=helper.getImgUrl(imageUrl) class="img-fluid" :class="{'small-img' : small}" alt="imageUrl">
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
          <Markdown :source="text" :breaks="true"></Markdown>
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
  props: ['title', 'texts', 'align', 'imageUrl', 'small'],
  data(){
    return {
      helper: this.$util
    }
  },
  computed: {
    imgArticleClass() {
      let imgCssClass = this.small ? "col-md-4 " : "col-md-6 ";
      let textCssClass = this.small ? "col-md-8 " : "col-md-6 ";

      imgCssClass += 'right' === this.align ? "order-md-last text-end" : "";

      return {
        "imgCssClass" : imgCssClass,
        "textCssClass": textCssClass
      }
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