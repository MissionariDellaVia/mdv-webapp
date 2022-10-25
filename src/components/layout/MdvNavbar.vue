<template>
  <nav v-if="show" class="navbar fixed-top navbar-expand-lg" :class="{changeColor: scrollPosition > 50}">
    <div class="container">
      <!-- Logo image -->
      <a class="navbar-brand" href="#">
        <img src="../../assets/logo-small.png" alt="logo" class="img-fluid"/>
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

            <li v-for="(item, index) in navbarLinks" v-bind:key="index" data-bs-dismiss="offcanvas" class="nav-item">
              <a v-if="item.external" target="_blank" :href="`${item.to}`" class="nav-link hover-underline-animation">{{ item.title }}</a>
              <router-link v-else class="nav-link hover-underline-animation" :to="`${item.to}`">{{ item.title }}</router-link>
            </li>

            <li v-for="(dropdown, index) in navbarDropdowns" v-bind:key="index"  class="nav-item dropdown">

              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {{ dropdown.title }}
              </a>
              <div class="dropdown-menu dropdown-menu-end animate slideIn" aria-labelledby="navbarDropdown">
                <div v-for="(dropdownItem, index) in dropdown.links" v-bind:key="index">
                  <a v-if="dropdownItem.external" target="_blank" :href="`${dropdownItem.to}`" class="dropdown-item">{{ dropdownItem.title }}</a>
                  <router-link v-else class="dropdown-item" :to="`${dropdownItem.to}`">{{ dropdownItem.title }}</router-link>
                </div>
              </div>
            </li>

          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "MdvNavbar",
  data() {
    return {
      scrollPosition: null,
      show: true
    }
  },
  methods: {
    updateScroll() {
      this.scrollPosition = window.scrollY
    },
    setShow() {
      setTimeout(() => {
        this.show = true;
      }, 300);
    },
    async changeLang() {
      try {
        this.$store.dispatch('page/changeLang', {lang: navigator.language, route: this.currentRouteName});
        this.scrollToTop();
      } catch (error) {
        // this.showToast(error.message || 'Errore caricamento pagina!');
      }
    },
  },
  computed: {
    navbarLinks() {
      if (this.$store.getters['page/navbar'] == null)
        this.changeLang()
      console.log(this.$store.getters['page/navbar'])
      return this.$store.getters['page/navbar'].filter(item => item.type === 'link');
    },
    navbarDropdowns() {
      if (this.$store.getters['page/navbar'] == null)
        this.changeLang()
      return this.$store.getters['page/navbar'].filter(item => item.type === 'dropdown');
    }
  },
  watch:{
    $route (){
      this.show = false;
      this.setShow();
    }
  },
  created () {
    window.addEventListener('scroll', this.updateScroll);
  },

}
</script>

<style scoped>
nav {
  font-family: 'Questrial', sans-serif;
}
.navbar {
  height: 6.5rem;
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
  background: rgb(40, 29, 2, 0.9);
}
.navbar a, .nav-item, .nav-link:focus {
  color: #ffffff;
}
.nav-link, .nav-link:hover {
  color: #dcbca8;
}
.navbar a:focus, .navbar a:hover, .nav-item a:focus, .nav-item a:hover{
  color: #dcbca8;
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
  background-color: #c3ac7d;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}
.hover-underline-animation:hover:after, .hover-underline-animation:focus:after, .hover-underline-animation:active:after, .router-link-active:after {
  transform: scaleX(1);
  transform-origin: bottom left;

}

.dropdown-menu {
  background: rgb(40, 29, 2, 0.9);
}

.dropdown-item:hover{
  background-color: transparent;
}

.navbar-toggler > i{
  color: #c3ac7d !important;
  font-size: 2rem;
  border-color: transparent;
}
.navbar-toggler > i:focus, .navbar-toggler > i:active, .navbar-toggler > i:hover {
  box-shadow: none;
  color: #c5c1b9 !important;
}

.close-icon {
  color: #c3ac7d;
  cursor: pointer;
}
.close-icon:hover {
  color: #c5c1b9;
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
  background: rgb(40, 29, 2, 0.9);
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