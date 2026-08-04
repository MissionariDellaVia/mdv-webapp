<template>
  <div class="voc-layout">
    <router-view />

    <nav v-if="!inHub" class="voc-layout__ritorno">
      <router-link :to="{ name: 'vocazione' }" class="voc-layout__link">
        Torna all'inizio del cammino
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'VocazioneLayout',
  computed: {
    inHub() {
      return this.$route.name === 'vocazione';
    },
  },
  watch: {
    // Se l'utente cambia lingua mentre e' dentro la sezione, le sotto-pagine
    // non esistono in quella lingua: si torna all'hub invece di restare su
    // una pagina orfana.
    $route(rotta) {
      const lingua = localStorage.getItem('lang') || 'it';
      if (rotta.name !== 'vocazione' && lingua !== 'it') {
        this.$router.replace({ name: 'vocazione' });
      }
    },
  },
};
</script>

<style scoped>
.voc-layout__ritorno {
  margin: 0 0 var(--mdv-spazio-6) 0;
  text-align: center;
}
.voc-layout__link {
  font-family: var(--mdv-font-navigazione);
  color: var(--mdv-oro-scuro);
  text-decoration: none;
  border-bottom: 1px solid var(--mdv-sabbia);
}
</style>
