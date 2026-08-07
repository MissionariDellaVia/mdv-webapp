<template>
  <nav class="voc-rimandi">
    <h2 v-if="titolo" class="voc-rimandi__titolo">{{ titolo }}</h2>
    <ul class="voc-rimandi__lista">
      <li v-for="(voce, i) in voci" :key="i">
        <router-link :to="{ name: voce.rotta }" class="mdv-invito">
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
/* I rimandi non sono la coda del discorso, sono un'altra cosa che viene
   dopo: nell'hub arrivano subito sotto il "Buon cammino." che chiude, e
   attaccati sembravano parte della chiusura. Lo stacco e' quello fra due
   sezioni, non fra due paragrafi. */
.voc-rimandi {
  margin-top: var(--mdv-ritmo-sezione);
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
</style>
