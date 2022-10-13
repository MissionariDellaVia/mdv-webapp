<template>
  <div class="row my-5 gy-2 text-center">
    <div class="col-md-6 col-sm-12" :class="{'order-last' : align === 'right'}">
      <div class="card">
        <div class="card-header">
          <div class="fs-3">{{ title }}</div>
        </div>
        <div class="card-body">
          <div class="row my-4">
            <div class="col align-self-start">
              <p class="text-start" v-for="(text, index) in articles" v-bind:key="index">
                <Markdown :source="text" :html="true"></Markdown>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-sm-12">
      <img :src=helper.getImgUrl(image) class="img-fluid" alt="imageUrl">
    </div>
  </div>
</template>

<script>
import Markdown from 'vue3-markdown-it';

export default {
  name: "MdvSection",
  components: {Markdown},
  props: ['title', 'caption', 'articles', 'image', 'align'],
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
  font-family: 'Playfair Display', sans-serif;
  color: #fff;
  border: 0;
  background: rgb(40, 29, 2, 0.9);
}
p {
  font-family: 'Old Standard TT', sans-serif;
  font-size: 1.2rem;
}
h4 {
  font-family: 'Playfair Display', sans-serif;
}
</style>