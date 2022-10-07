<template>
  <div class="row my-5 gy-2 text-center">
    <div class="col-md-6 col-sm-12" :class="{'order-last' : align === 'right'}">
      <div class="card">
        <div class="card-header">
          <div class="fs-2">{{ title }}</div>
        </div>
        <div class="card-body">
          <div class="row my-4">
            <div class="col align-self-start">
              <p class="text-start" v-for="(text, index) in articles" v-bind:key="index"> {{ text }}</p>
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
export default {
  name: "MdvSection",
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
  font-family: 'Bubbler One', sans-serif;
  border: 0;
  background: #e6deca;
}
p {
  font-family: 'Playfair Display', sans-serif;
  font-size: larger;
}
h4 {
  font-family: 'Playfair Display', sans-serif;
}
</style>