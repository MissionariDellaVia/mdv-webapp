<template>
  <MdvNavbar/>
  <router-view v-slot="{ Component }">
    <transition name="scale" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <MdvFooter/>
</template>

<script>
import MdvNavbar from "@/components/layout/MdvNavbar";
import MdvFooter from "@/components/layout/MdvFooter";

export default {
  name: 'App',
  components: {
    MdvNavbar,MdvFooter
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
