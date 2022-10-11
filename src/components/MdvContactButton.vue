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
  font-family: 'Playfair Display', sans-serif;
  border: 0;
  width: 21rem;
  transition: all 0.2s ease;
  transform: scale(0.9);
}
.card-header{
  border: 0;
  background: rgb(40, 29, 2, 0.9);
  color: #fff;
  font-size: 3rem;
  text-align: center;
}
.card-body {
  font-size: medium;
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