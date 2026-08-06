<template>
  <div :class="{
    'standalone-page': $route.meta.standalone,
    'app-sfondo': !$route.meta.standalone,
    'voc-atmosfera': inSezione,
  }">
    <MdvNavbar v-show="!$route.meta.reservedArea && !$route.meta.standalone"/>
    <router-view v-slot="{ Component }">
      <transition name="dissolvenza" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view >
    <MdvFooter v-show="!$route.meta.reservedArea && !$route.meta.standalone" />

    <!-- Il velo sta qui, fuori dalla transizione di pagina: dentro
         sarebbe entrato in scena insieme alla pagina che deve coprire, e
         sarebbe salito dopo di lei invece che prima. -->
    <VocSoglia v-if="soglia" @finita="soglia = false" />
  </div>
</template>

<script>
import { usaPagina } from '@/store/pagina.mjs';
import MdvNavbar from "@/components/layout/MdvNavbar.vue";
import MdvFooter from "@/components/layout/MdvFooter.vue";
import VocSoglia from "@/components/vocazione/VocSoglia.vue";
import { inVocazione } from "@/utility/inVocazione.mjs";
import { attraversaSoglia } from "@/utility/soglia.mjs";
import { USCITA_PAGINA_MS } from "@/utility/tempiTransizione.mjs";
import { linguaDaUsare } from "@/utility/lingue.mjs";


export default {
  name: 'App',
  setup() {
    return { pagina: usaPagina() };
  },
  components: {
    MdvNavbar,MdvFooter,VocSoglia
  },
  data() {
    return { inSezione: false, soglia: false };
  },
  watch: {
    // Un solo posto decide la sequenza del passaggio, in quest'ordine:
    //   subito           il velo comincia a salire sulla pagina in uscita
    //   +260ms           sotto il velo, il fondo cambia atmosfera
    //   +260ms           sotto il velo, la sezione si monta ed entra
    //   +1200ms          il velo e' alzato, il velo si smonta
    //
    // L'atmosfera aspetta la fine dell'uscita: cambiandola all'istante del
    // clic, la pagina chiara che sta ancora uscendo resterebbe per un
    // attimo sopra il fondo gia' scuro.
    $route: {
      immediate: true,
      handler(verso, da) {
        if (attraversaSoglia(da && da.path, verso.path)) this.soglia = true;

        const atteso = this.calcolaSezione();
        if (atteso === this.inSezione) return;
        clearTimeout(this.attesaAtmosfera);
        this.attesaAtmosfera = setTimeout(() => {
          this.inSezione = this.calcolaSezione();
        }, USCITA_PAGINA_MS);
      },
    },
  },
  created() {
    this.checkAndSetLang();
  },
  beforeUnmount() {
    clearTimeout(this.attesaAtmosfera);
  },
  methods: {
    // In lingua diversa dall'italiano /vocazione mostra la vecchia pagina,
    // che e' scritta per il fondo chiaro: li' l'atmosfera resta spenta.
    calcolaSezione() {
      return this.pagina.lingua === 'it' && inVocazione(this.$route.path);
    },
    // Era una sessantina di righe fra normalizzazione, controlli e
    // messaggi di traccia. La regola sta ora in lingue.mjs, con i suoi
    // test: qui resta scriverla dove il resto del sito la cerca.
    checkAndSetLang() {
      const scelta = linguaDaUsare(localStorage.getItem('lang'), navigator.language);
      localStorage.setItem('lang', scelta);
    },
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bubbler+One&family=Questrial&family=Playfair+Display&family=Old+Standard+TT&display=swap');
html, body {
  overflow-x:hidden !important;
}
.standalone-page {
  background: var(--mdv-bruno-900);
  min-height: 100vh;
  min-height: -webkit-fill-available;
}
</style>
