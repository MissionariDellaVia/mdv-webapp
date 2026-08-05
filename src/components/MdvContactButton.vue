<template>
<div class="card shadow">
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
  font-family: var(--mdv-font-corpo);
  border: 0;
  width: 20rem;
  margin: auto;
  transition: all 0.2s ease;
  transform: scale(0.9);
}
.card-header{
  border: 0;
  background: var(--mdv-bruno-900-velato);
  color: var(--mdv-bianco);
  font-size: 3rem;
  text-align: center;
}
.card-body {
  font-size: medium;
  height: 12rem;
  text-align: center;
}
p {
  font-family: var(--mdv-font-navigazione);
  font-size: larger;
}
.card:hover {
  transform: scale(1);
}
</style>