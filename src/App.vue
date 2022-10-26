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
    if (localStorage.getItem('lang')) {
      console.debug( "current lang: " + localStorage.getItem('lang'));
    } else {
      localStorage.setItem('lang', ''+navigator.language.slice(0,2));
    }
  },
  watch: {
    didAutoLogout(curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.replace('/auth');
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
