<template>
  <section class="voc-elenco">
    <h2 v-if="titolo" class="voc-elenco__titolo">{{ titolo }}</h2>
    <ul :class="['voc-elenco__lista', `voc-elenco__lista--${variante}`]">
      <li v-for="(voce, i) in voci" :key="i" class="voc-elenco__voce">{{ voce }}</li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'VocElenco',
  props: {
    titolo: { type: String, default: '' },
    voci: { type: Array, required: true },
    variante: {
      type: String,
      default: 'puntato',
      validator: (v) => ['puntato', 'segni'].includes(v),
    },
  },
};
</script>

<style scoped>
.voc-elenco {
  margin-bottom: var(--mdv-spazio-6);
}
.voc-elenco__titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
  font-size: 1.9rem;
  margin-bottom: var(--mdv-spazio-4);
}
.voc-elenco__lista {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}
.voc-elenco__voce {
  font-family: var(--mdv-font-corpo);
  font-size: 1.1rem;
  line-height: var(--mdv-interlinea-corpo);
  padding-left: var(--mdv-spazio-5);
  margin-bottom: var(--mdv-spazio-3);
  position: relative;
}
.voc-elenco__lista--puntato .voc-elenco__voce::before {
  content: '·';
  position: absolute;
  left: var(--mdv-spazio-2);
  top: -0.35rem;
  color: var(--mdv-sabbia);
  font-size: var(--mdv-testo-xl);
}
.voc-elenco__lista--segni .voc-elenco__voce::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--mdv-oro);
}
</style>
