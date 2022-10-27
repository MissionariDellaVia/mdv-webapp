<template>
  <MdvNavbar v-show="!$route.meta.reservedArea"/>
  <router-view v-slot="{ Component }">
    <transition name="scale" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view >
  <MdvFooter v-show="!$route.meta.reservedArea" />
</template>

<script>
import MdvNavbar from "@/components/layout/MdvNavbar";
import MdvFooter from "@/components/layout/MdvFooter";

const supportedLang = ['it', 'en', 'pl', 'es', 'fr']

export default {
  name: 'App',
  components: {
    MdvNavbar,MdvFooter
  },
  computed: {
    didAutoLogout() {
      return this.$store.getters.didAutoLogout;
    }
  },
  created() {
    this.$store.dispatch('tryLogin');
    this.checkAndSetLang();
  },
  watch: {
    didAutoLogout(curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.replace('/auth');
      }
    }
  },
  methods: {
    checkAndSetLang() {
      if (localStorage.getItem('lang')) {
        let currentLang = localStorage.getItem('lang');
        console.debug( "lang found in storage: " + localStorage.getItem('lang'));

        if (currentLang.length > 2) {
          currentLang = currentLang.substring(0,2);
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

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
