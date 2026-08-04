<template>
  <div class="voc-porte">
    <router-link
      v-for="(porta, i) in porte"
      :key="i"
      :to="{ name: porta.rotta }"
      class="voc-porte__porta"
    >
      <h3 class="voc-porte__titolo">{{ porta.titolo }}</h3>
      <p class="voc-porte__testo">{{ porta.testo }}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'VocPorte',
  props: {
    porte: { type: Array, required: true },
  },
};
</script>

<style scoped>
.voc-porte {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
  gap: var(--mdv-spazio-4);
  margin: var(--mdv-spazio-5) 0 var(--mdv-spazio-6) 0;
}
.voc-porte__porta {
  display: block;
  padding: var(--mdv-spazio-5);
  border: 1px solid var(--mdv-sabbia);
  border-radius: var(--mdv-raggio-m);
  text-decoration: none;
  color: inherit;
  transition: background-color .15s, transform .15s;
}
.voc-porte__porta:hover,
.voc-porte__porta:focus {
  background-color: var(--mdv-crema);
  transform: translateY(-2px);
  color: inherit;
}
.voc-porte__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro-scuro);
  font-size: 1.4rem;
  margin-bottom: var(--mdv-spazio-3);
}
.voc-porte__testo {
  font-family: var(--mdv-font-corpo);
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
}
</style>
