<template>
<div class="card shadow">
  <img :src=helper.getImgUrl(imageUrl)  class="card-img-top" alt="cardImage" referrerpolicy="no-referrer">
  <div class="card-body text-center">
    <h4 class="card-title text-center fs-5">{{ title }}</h4>
    <p class="text-center my-4">pubblicato il {{ parsedDate }}</p>
    <div class="pb-2">
      <hr/>
      <a :href="refLink">Leggi di più</a>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "MdvBlogCard",
  props: ['title', 'cardText', 'publishDate', 'imageUrl', 'refLink'],
  computed: {
    parsedDate() {
      return this.publishDate.getDate() + " " + this.publishDate.toLocaleDateString('default', { month: 'long' });
    }
  },
  data(){
    return {
      helper: this.$util
    }
  }
}
</script>

<style scoped>
hr {
  border-top: 0.2rem solid rgb(40, 29, 2);
  margin: 1.2rem auto 0.5rem;
  width: 70%;
}
a {
  font-size: larger;
  text-decoration: none;
  color: #8c681c;
  margin-bottom: 1.2rem;
}
a:hover, a:focus {
  color: #59411a;
}
.card {
  border: 0;
  border-radius: 0;
  background: #f5f1ed;
  color: rgb(40, 29, 2);
  transform: scale(0.9);
  font-family: 'Playfair Display', sans-serif;
  transition: all 0.2s ease;
}
.card:hover {
  transform: scale(0.95);
}
.card-img-top {
  height: 15rem;
  object-fit: cover;
}
</style>