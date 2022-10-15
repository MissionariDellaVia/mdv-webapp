<template>
  <div class="card position-absolute top-50 start-50 translate-middle shadow-lg">
    <div class="card-body mx-auto">
      <h1 class="title text-center fs-1 my-4 text-uppercase">{{ title }}</h1>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style scoped>
.title {
  font-family: 'Bubbler One', sans-serif;
  color: #655640;
}
.card {
  color: #29140b;
  background-color: #e1d9cb !important;
  width: 80%;
  /*min-height: 50vh;*/
  -webkit-border-radius: 1.563rem;
  -moz-border-radius: 1.563rem;
  border-radius: 1.563rem;
}

/* Small devices (landscape phones, 576px and up)*/
@media (max-width: 576px) {
  .card {
    width: 20rem;
  }
}

/* Medium devices (tablets, 768px and up) 
@media (min-width: 768px) { ... }

/* Large devices (desktops, 992px and up) 
@media (min-width: 992px) { ... }

/* Extra large devices (large desktops, 1200px and up) 
@media (min-width: 1200px) { ... }*/
</style>