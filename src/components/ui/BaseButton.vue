<template>
  <router-link class="btn action-button rounded-4 text-uppercase" :to="link"> {{ title }}</router-link>
</template>

<script>
export default {
  props: ['title', "link"]
}
</script>


<style scoped>
.action-button {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-bianco);
  padding: 1.7em 1.7em;
  border-color: transparent;
  font-size: 1.8rem;
  height: 10rem;
  width: 20rem;
  background-color: var(--mdv-bruno-700);
  transition: all .1s;
  -webkit-box-shadow: 3px 4px 15px -5px var(--mdv-grigio);
  box-shadow: 3px 4px 15px -5px var(--mdv-grigio);
}

.action-button:hover {
  color: var(--mdv-bianco);
  background-color: var(--mdv-oro-chiaro);
  transform: scale(0.97);
  border-color: var(--mdv-oro-chiaro);
}

.action-button:focus {
  color: var(--mdv-bianco);
  background-color: var(--mdv-oro-brillante);
  border-color: var(--mdv-oro-brillante);
  transform: scale(0.93);
}
</style>