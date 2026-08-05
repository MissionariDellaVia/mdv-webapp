<template>
  <div class="voc-layout">
    <VocSoglia />

    <!-- L'intestazione sta qui e non nelle pagine: cambiando pagina si
         rifa' solo il titolo, mentre menu, foto e atmosfera restano dove
         sono. E' questo a togliere la sensazione di ricarica. -->
    <VocIntestazione v-if="intestazione" v-bind="intestazione" />

    <!-- Ancora fissa: esiste sempre, anche mentre la pagina si sta
         sostituendo, quindi il router puo' puntarci senza aspettarla. -->
    <div id="voc-contenuto">
      <router-view v-slot="{ Component }">
        <transition name="dissolvenza" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
import VocSoglia from '@/components/vocazione/VocSoglia';
import VocIntestazione from '@/components/vocazione/VocIntestazione';
import { intestazionePer } from '@/utility/intestazioneVocazione.mjs';
import contenuto from '@/assets/data/vocazione.json';

export default {
  name: 'VocazioneLayout',
  components: { VocSoglia, VocIntestazione },
  computed: {
    // Nelle altre lingue l'hub mostra la vecchia pagina, che ha gia' la
    // sua intestazione ed e' scritta per il fondo chiaro.
    intestazione() {
      void this.$store.getters['page/navbar'];
      const lingua = localStorage.getItem('lang') || 'it';
      if (lingua !== 'it') return null;
      return intestazionePer(this.$route.name, contenuto);
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
