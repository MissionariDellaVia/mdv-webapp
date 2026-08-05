<template>
  <div class="voc-layout">
    <VocSoglia />
    <VocBarraSezione v-if="!inHub" :pagine="pagine" :rotta-corrente="$route.name" />
    <router-view />
  </div>
</template>

<script>
import VocSoglia from '@/components/vocazione/VocSoglia';
import VocBarraSezione from '@/components/vocazione/VocBarraSezione';
import indice from '@/assets/data/indice-vocazione.json';

export default {
  name: 'VocazioneLayout',
  components: { VocSoglia, VocBarraSezione },
  data() {
    return { pagine: indice };
  },
  computed: {
    // Sull'hub la barra non serve: il ritorno non ha destinazione e le
    // quattro porte sono gia' in pagina. L'hub e' l'indice.
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
