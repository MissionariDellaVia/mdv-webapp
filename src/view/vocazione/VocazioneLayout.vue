<template>
  <div class="voc-layout">
    <VocSoglia />
    <router-view />
    <VocIndiceSezione v-if="!inHub" :pagine="pagine" :rotta-corrente="$route.name" />
  </div>
</template>

<script>
import VocSoglia from '@/components/vocazione/VocSoglia';
import VocIndiceSezione from '@/components/vocazione/VocIndiceSezione';
import indice from '@/assets/data/indice-vocazione.json';

export default {
  name: 'VocazioneLayout',
  components: { VocSoglia, VocIndiceSezione },
  data() {
    return { pagine: indice };
  },
  computed: {
    // Sull'hub l'indice non serve: le quattro porte sono gia' in pagina.
    // L'hub e' l'indice.
    inHub() {
      return this.$route.name === 'vocazione';
    },
  },
  watch: {
    // Cambiando lingua dentro la sezione, le sotto-pagine non esistono in
    // quella lingua: si torna all'hub invece di restare su una pagina orfana.
    $route(rotta) {
      const lingua = localStorage.getItem('lang') || 'it';
      if (rotta.name !== 'vocazione' && lingua !== 'it') {
        this.$router.replace({ name: 'vocazione' });
      }
    },
  },
};
</script>
