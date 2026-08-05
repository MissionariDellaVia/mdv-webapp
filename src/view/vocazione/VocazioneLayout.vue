<template>
  <div class="voc-layout">
    <!-- L'intestazione sta qui e non nelle pagine: cambiando pagina si
         rifa' solo il titolo, mentre menu, foto e atmosfera restano dove
         sono. E' questo a togliere la sensazione di ricarica. -->
    <VocIntestazione
      v-if="intestazione"
      v-bind="intestazione"
      :voci="menu"
      etichetta-menu="Sezione vocazione"
    />

    <!-- La chiave sul nome della rotta e' quello che rende uguale
         l'entrata di tutte le pagine. Senza, quattro percorsi che
         condividono lo stesso componente venivano aggiornati sul posto
         invece che rimontati: la transizione non partiva e matrimonio,
         sacerdozio e vita consacrata comparivano di colpo, mentre le
         pagine con un componente proprio entravano in dissolvenza. -->
    <router-view v-slot="{ Component }">
      <transition name="dissolvenza" mode="out-in">
        <component :is="Component" :key="$route.name" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import VocIntestazione from '@/components/vocazione/VocIntestazione';
import { intestazionePer } from '@/utility/intestazioneVocazione.mjs';
import { componiMenu } from '@/utility/menuVocazione.mjs';
import contenuto from '@/assets/data/vocazione.json';
import indice from '@/assets/data/indice-vocazione.json';

export default {
  name: 'VocazioneLayout',
  components: { VocIntestazione },
  data() {
    return { menu: componiMenu(indice) };
  },
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
