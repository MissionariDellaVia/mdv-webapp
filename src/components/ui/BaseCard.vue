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
  font-family: var(--mdv-font-titolo);
  font-size: 2.5rem;
  color: var(--mdv-bianco);
}
.card {
  background-color: var(--mdv-bruno-800);
  width: 30rem;
  -webkit-border-radius: var(--mdv-raggio-l);
  -moz-border-radius: var(--mdv-raggio-l);
  border-radius: var(--mdv-raggio-l);
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