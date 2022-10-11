<template>
<!--  <header :class="'md-bg bg' + {rootImage}">-->
  <header class="md-bg" :style="inlineStyle">
    <div class="container h-100">
      <div class="row h-100 align-items-center">
        <div class="col-12 text-center">
          <img v-if="brand"  src="../../assets/logo.png" class="mt-5" alt="logoHome"/>
          <h1 class="main-title text-uppercase">{{ title }}</h1>
          <p v-if="caption" class="lead headerSection">{{ caption }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "MdvHeader",
  props: ['image', 'brand', 'title', 'caption'],
  data(){
    return {
      helper: this.$util
    }
  },
  computed: {
    inlineStyle () {
      return {
        backgroundImage: `url(${this.$util.getImgUrl(this.image ? this.image : 'default.jpg')})`
      }
    }
  },
}
</script>

<style scoped>

@media only screen and (max-width: 480px) {
  .main-title {
    font-size: 3rem !important;
  }
  img {
    width: 3rem !important;
  }
}

.md-bg {
  font-family: 'Bubbler One', sans-serif;
  height: 55vh;
  min-height: 40vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow:inset 0 0 0 2000px rgba(0, 0, 0, 0.35);
  margin-bottom: 3%;
  color: whitesmoke;
}

.lead.headerSection {
  font-size: 2rem;
  width: 80%;
  margin: auto;
  color: #a8a8a8;
}

img {
  width: 4.5rem;
}

.main-title {
  font-size: 4rem;
}

</style>