<template>
<div class="card shadow mx-auto">
  <div class="card-header">
    <slot name="card-header"></slot>
  </div>
  <div class="card-body">
    <slot name="body"></slot>
  </div>
</div>
</template>

<script>
export default {
  name: "ContactoButtonPage"
}
</script>

<style scoped>
.card {
  font-family: 'Bubbler One', sans-serif;
  border: 0;
  width: 21rem;
  transition: all 0.2s ease;
  transform: scale(0.9);
}
.card-header{
  border: 0;
  background: #e6deca;
  color: #fff;
  font-size: 3rem;
  text-align: center;
}
.card-body {
  font-size: large;
  height: 12rem;
  text-align: center;
}
p {
  font-family: 'Montserrat', sans-serif;
  font-size: larger;
}
.card:hover {
  transform: scale(1);
}
</style>