<template>
  <nav class="navbar fixed-top navbar-expand-lg entra-velata" :class="{changeColor: scrollPosition > 50}">
    <div class="container">
      <!-- Logo image -->
      <a class="navbar-brand" href="#">
        <img src="../../assets/logo.png" alt="Missionari della Via" class="logo-navbar"/>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <i class="fas fa-bars"></i>
      </button>

      <!-- Navigation with Offcanvas menu -->
      <div class="offcanvas offcanvas-start" tabindex="-1" id="navbarNav" aria-labelledby="DrawerBar">
        <div class="offcanvas-header">
          <i class="fas fa-times fa-lg close-icon ms-auto" data-bs-dismiss="offcanvas"></i>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav ms-auto text-uppercase">

            <li v-for="(item, index) in navbarItems" v-bind:key="index" :class="item.type === 'dropdown' ? 'nav-item dropdown' : 'nav-item'">

              <!-- Regular Link -->
              <template v-if="item.type === 'link'">
                <a v-if="item.external" target="_blank" :href="`${item.to}`" class="nav-link hover-underline-animation" @click="closeOffcanvas">{{ item.title }}</a>
                <router-link v-else class="nav-link hover-underline-animation" :to="`${item.to}`" @click="closeOffcanvas">{{ item.title }}</router-link>
              </template>

              <!-- Dropdown -->
              <template v-else-if="item.type === 'dropdown'">
                <a class="nav-link dropdown-toggle" href="#" :id="`navbarDropdown-${index}`" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {{ item.title }}
                </a>
                <div class="dropdown-menu dropdown-menu-end animate slideIn" :aria-labelledby="`navbarDropdown-${index}`">
                  <template v-for="(dropdownItem, idx) in item.links" v-bind:key="idx">
                    <a v-if="dropdownItem.external" target="_blank" :href="`${dropdownItem.to}`" class="dropdown-item" @click="closeOffcanvas">{{ dropdownItem.title }}</a>
                    <router-link v-else class="dropdown-item" :to="`${dropdownItem.to}`" @click="closeOffcanvas">{{ dropdownItem.title }}</router-link>
                  </template>
                </div>
              </template>

            </li>

          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { usaPagina } from '@/store/pagina.mjs';
export default {
  name: "MdvNavbar",
  setup() {
    return { pagina: usaPagina() };
  },
  data() {
    return {
      scrollPosition: null
    }
  },
  methods: {
    updateScroll() {
      this.scrollPosition = window.scrollY
    },
    closeOffcanvas() {
      const offcanvasElement = document.getElementById('navbarNav');
      if (offcanvasElement && window.bootstrap && window.bootstrap.Offcanvas) {
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (bsOffcanvas) {
          bsOffcanvas.hide();
        }
      }
    }
  },
  computed: {
    navbarItems() {
      return this.pagina.navbar;
    }
  },
  // Niente watch su $route: la navbar spariva e riappariva a ogni
  // navigazione, ed e' quello a far sembrare che si ricarichi tutto.
  // Sta ferma, cambia solo il contenuto sotto.
  created () {
    window.addEventListener('scroll', this.updateScroll);
  },

}
</script>

<style scoped>
nav {
  font-family: var(--mdv-font-navigazione);
}

/* Il logo era un'immagine da 60x73 disegnata a grandezza naturale: su uno
   schermo a densita' doppia — cioe' su qualunque schermo di oggi — veniva
   ingrandita e si vedeva sfocata. Stessa grandezza a video, ma presa dal
   file grande che era gia' in cartella: 313 pixel di sorgente per 72 a
   video reggono anche gli schermi a densita' tripla. */
.logo-navbar {
  height: 4.5rem;
  width: auto;
  max-width: 100%;
}
.navbar {
  height: var(--mdv-altezza-navbar);
  background: transparent;
  -webkit-transition: all .4s;
  -moz-transition: all .4s;
  -o-transition: all .4s;
  transition: all .4s;
  transition-timing-function: ease-in-out;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
}
.changeColor{
  background: var(--mdv-bruno-900-velato);
}
.navbar a, .nav-item, .nav-link:focus {
  color: var(--mdv-bianco);
}
.nav-link, .nav-link:hover {
  color: var(--mdv-sabbia-chiara);
}
.navbar a:focus, .navbar a:hover, .nav-item a:focus, .nav-item a:hover{
  color: var(--mdv-sabbia-chiara);
}
.hover-underline-animation, .router-link-active {
  display: inline-block;
  position: relative;

}
.hover-underline-animation:after, .router-link-active:after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 0.2rem;
  bottom: -1px;
  left: 0;
  background-color: var(--mdv-sabbia);
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}
.hover-underline-animation:hover:after, .hover-underline-animation:focus:after, .hover-underline-animation:active:after, .router-link-active:after {
  transform: scaleX(1);
  transform-origin: bottom left;

}

.dropdown-menu {
  background: var(--mdv-bruno-900-velato);
}

.dropdown-item:hover{
  background-color: transparent;
}

.navbar-toggler > i{
  color: var(--mdv-sabbia) !important;
  font-size: 2rem;
  border-color: transparent;
}
.navbar-toggler > i:focus, .navbar-toggler > i:active, .navbar-toggler > i:hover {
  box-shadow: none;
  color: var(--mdv-pietra) !important;
}

.close-icon {
  color: var(--mdv-sabbia);
  cursor: pointer;
  margin-right: 0.2rem;
  margin-top: 0.5rem;
  font-size: 2rem;
}
.close-icon:hover {
  color: var(--mdv-pietra);
}

.navbar-toggler{
  border-radius: 0;
  border-color: transparent;
}

.navbar-toggler:focus {
  text-decoration: none;
  outline: none;
  box-shadow: none;
}

.offcanvas {
  background: var(--mdv-bruno-900-velato);
}

@media only screen and (min-width: 768px) {
  .animate {
    animation-duration: 0.3s;
    -webkit-animation-duration: 0.3s;
    animation-fill-mode: both;
    -webkit-animation-fill-mode: both;
  }
}

@keyframes slideIn {
  0% {
    transform: translateY(1rem);
    opacity: 0;
  }

  100% {
    transform: translateY(0rem);
    opacity: 1;
  }

  0% {
    transform: translateY(1rem);
    opacity: 0;
  }
}

@-webkit-keyframes slideIn {
  0% {
    -webkit-transform: transform;
    -webkit-opacity: 0;
  }

  100% {
    -webkit-transform: translateY(0);
    -webkit-opacity: 1;
  }

  0% {
    -webkit-transform: translateY(1rem);
    -webkit-opacity: 0;
  }
}

.slideIn {
  -webkit-animation-name: slideIn;
  animation-name: slideIn;
}
</style>