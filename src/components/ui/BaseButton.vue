<template>
  <button class="btn action-button rounded-4 text-uppercase"> {{ title }}</button>
</template>

<script>
export default {
  props: ['title']
}
</script>


<style scoped>
.action-button {
  font-family: 'Bubbler One', sans-serif;
  color: #fff;
  padding: 0.7em 1.7em;
  border-color: transparent;
  font-size: 1.8rem;
  height: 10rem;
  width: 20rem;
  background-color: #655640;
  transition: all .1s;
  -webkit-box-shadow: 3px 4px 15px -5px #7E7E7E;
  box-shadow: 3px 4px 15px -5px #7E7E7E;
}

.action-button:hover {
  color: #fff;
  background-color: #b6974e;
  transform: scale(0.97);
  border-color: #b6974e;
}

.action-button:focus {
  color: #fff;
  background-color: #deb865;
  border-color: #deb865;
  transform: scale(0.93);
}
</style>