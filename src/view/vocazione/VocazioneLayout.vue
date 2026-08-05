<template>
  <div class="voc-layout">
    <VocSoglia />
    <router-view />
  </div>
</template>

<script>
import VocSoglia from '@/components/vocazione/VocSoglia';

export default {
  name: 'VocazioneLayout',
  components: { VocSoglia },
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
