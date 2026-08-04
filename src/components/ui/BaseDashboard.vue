<template>
  <div class="card position-absolute top-50 start-50 translate-middle shadow-lg">
    <div class="card-header">
      <h1 class="card-title text-center mt-2 text-uppercase">{{ title }}</h1>
    </div>
    <div class="card-body mx-auto">
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
.card-title {
  font-family: var(--mdv-font-titolo);
  color: rgba(248, 248, 248, 0.9);
  font-size: 3rem;
}
.card {
  color: var(--mdv-bruno-850);
  background-color: var(--mdv-crema) !important;
  width: 80%;
  /*min-height: 50vh;*/
  -webkit-border-radius: 1.563rem;
  -moz-border-radius: 1.563rem;
  border-radius: 1.563rem;
}

.card-header {
  border-color: transparent;
  background-color: var(--mdv-bruno-700) !important;
  border-top-left-radius: 1.563rem !important;
  border-top-right-radius: 1.563rem !important;
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