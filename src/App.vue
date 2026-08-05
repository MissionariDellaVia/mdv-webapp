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
  </div>
</template>

<script>
import MdvNavbar from "@/components/layout/MdvNavbar";
import MdvFooter from "@/components/layout/MdvFooter";
import { inVocazione } from "@/utility/inVocazione.mjs";

const supportedLang = ['it', 'en', 'pl', 'es', 'fr']

export default {
  name: 'App',
  components: {
    MdvNavbar,MdvFooter
  },
  computed: {
    // Navbar e footer sono fratelli del router-view: l'atmosfera puo'
    // essere applicata solo da qui per raggiungerli tutti.
    // In lingua diversa dall'italiano /vocazione mostra la vecchia pagina,
    // che e' scritta per il fondo chiaro: li' l'atmosfera resta spenta.
    // La navbar cambia a ogni cambio lingua: leggerla rende il calcolo
    // reattivo senza doverne aggiungere uno stato apposito.
    inSezione() {
      void this.$store.getters['page/navbar'];
      const lingua = localStorage.getItem('lang') || 'it';
      return lingua === 'it' && inVocazione(this.$route.path);
    },
  },
  created() {
    this.checkAndSetLang();
  },
  methods: {
    checkAndSetLang() {
      if (localStorage.getItem('lang')) {
        let currentLang = localStorage.getItem('lang');
        console.debug( "lang found in storage: " + localStorage.getItem('lang'));

        if (currentLang.length > 2) {
          currentLang = currentLang.substring(0,2).toLowerCase();
          localStorage.setItem('lang', currentLang);
          console.debug( "normalized lang in storage: " + currentLang);
        }

        if (!supportedLang.includes(currentLang)) {
          console.debug( "lang: " + currentLang + " is not supported, setting default web-app language");
          localStorage.setItem('lang', 'it')
          return;
        }
        return;
      }

      console.debug( "lang not found in storage, try to set locale: " + navigator.language);
      let localLang = navigator.language.substring(0, 2);
      if (supportedLang.includes(localLang)) {
        console.debug( "lang: " + localLang + " is supported");
        localStorage.setItem('lang', localLang)
      } else {
        console.debug( "lang: " + localLang + " is not supported, setting default web-app language");
        localStorage.setItem('lang', 'it');
      }

    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bubbler+One&family=Montserrat&family=Questrial&family=Playfair+Display&family=Old+Standard+TT&display=swap');
html, body {
  overflow-x:hidden !important;
}
.standalone-page {
  background: #281d02;
  min-height: 100vh;
  min-height: -webkit-fill-available;
}
.standalone-page body,
.standalone-page html {
  background: #281d02 !important;
}
.markdown-mdv blockquote{
  color: #8c681c !important;
  font-style: italic;
  /*text-align: center;*/
}
.markdown-mdv a {
  text-decoration: none;
  color: #8c681c;
}
.markdown-mdv a:hover, .markdown-mdv a:focus {
  color: #59411a;
}
.markdown-mdv em {
  font-size: smaller;
  color: rgba(40, 29, 2, 0.9);
}
.markdown-mdv em > a {
  color: rgb(222, 148, 11) !important;
}
.markdown-mdv em > a:hover, .markdown-mdv em > a:focus {
  color: rgb(140, 104, 28) !important;
}
</style>
