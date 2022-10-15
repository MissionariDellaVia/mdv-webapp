<template>
  <div class="card position-absolute top-50 start-50 translate-middle shadow-lg my-5">
    <div class="card-body mx-auto">
      <h2 class="title text-center my-4">{{ title }}</h2>
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
  font-family: 'Playfair Display', sans-serif;
  color: #29140b;
}
.card {
  color: #29140b;
  width: 30rem;
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