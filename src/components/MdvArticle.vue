<template>
<div class="card">
  <div v-if="title" class="card-header">
    <div class="text-end fs-2">{{ title }}</div>
  </div>
  <div class="card-body">
    <div v-if="imageUrl" class="row my-4">
      <div class="col col-md-5 col-sm-12 " :class="{'order-last' : 'right' === align}">
        <img :src=helper.getImgUrl(imageUrl) class="img-fluid" alt="imageUrl">
      </div>
      <div class="col col-md-7 col-sm-12 align-self-start" :class="'right' === align ? 'text-start' : 'text-end'">
        <p v-for="(text, index) in texts" v-bind:key="index"> {{ text }}</p>
      </div>
    </div>
    <div v-else class="row my-4">
      <div class="col col-sm-12 align-self-start">
        <p v-for="(text, index) in texts" v-bind:key="index"> {{ text }}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "MdvArticle",
  props: ['title', 'texts', 'align', 'imageUrl'],
  data(){
    return {
      helper: this.$util
    }
  }
}
</script>

<style scoped>
.card {
  border: 0;
}
.card-header{
  font-family: 'Bubbler One', sans-serif;
  border: 0;
  background: #e6deca;
}
p {
  font-family: 'Playfair Display', sans-serif;
  font-size: larger;
}
</style>