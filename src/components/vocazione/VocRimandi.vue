<template>
  <nav class="voc-rimandi">
    <h2 v-if="titolo" class="voc-rimandi__titolo">{{ titolo }}</h2>
    <ul class="voc-rimandi__lista">
      <li v-for="(voce, i) in voci" :key="i">
        <router-link :to="{ name: voce.rotta }" class="voc-rimandi__link">
          {{ voce.etichetta }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'VocRimandi',
  props: {
    titolo: { type: String, default: '' },
    voci: { type: Array, required: true },
  },
};
</script>

<style scoped>
.voc-rimandi {
  margin-bottom: var(--mdv-spazio-6);
}
.voc-rimandi__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
  font-size: 1.5rem;
  margin-bottom: var(--mdv-spazio-3);
}
.voc-rimandi__lista {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--mdv-spazio-3);
}
.voc-rimandi__link {
  display: inline-block;
  padding: var(--mdv-spazio-2) var(--mdv-spazio-4);
  border: 1px solid var(--mdv-sabbia);
  border-radius: var(--mdv-raggio-s);
  font-family: var(--mdv-font-navigazione);
  color: var(--mdv-oro-scuro);
  text-decoration: none;
  transition: background-color .15s;
}
.voc-rimandi__link:hover,
.voc-rimandi__link:focus {
  background-color: var(--mdv-crema);
  color: var(--mdv-oro-scuro);
}
</style>
