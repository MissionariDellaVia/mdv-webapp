<template>
  <nav v-if="show" class="navbar fixed-top navbar-expand-lg" :class="{changeColor: scrollPosition > 250}">
    <div class="container">
      <!-- Logo image -->
      <a class="navbar-brand" href="#">
        <img src="../../assets/logo-small.png" alt="logo" class="img-fluid"/>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation menu -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link hover-underline-animation" to="/">CHI SIAMO</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link hover-underline-animation" to="/vocazione">VOCAZIONE</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link hover-underline-animation" to="/attivita">ATTIVITA</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link hover-underline-animation" href="https://blogdeipiccolidellavia.blogspot.com/">BLOG</a>
          </li>
          <li class="nav-item">
            <a class="nav-link hover-underline-animation" href="https://www.cristianidistrada.net">FRATERNITA LAICALE</a>
          </li>
          <li class="nav-item">
            <router-link class="nav-link hover-underline-animation" to="/contatti">CONTATTI</router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              ALTRO
            </a>
            <!-- Here's the magic. Add the .animate and .slideIn classes to your .dropdown-menu and you're all set! -->
            <div class="dropdown-menu dropdown-menu-end animate slideIn" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="https://www.youtube.com/channel/UCI-KljGpZAOQlazH5vuRlfA">CANALE YOUTUBE</a>
              <router-link class="dropdown-item" to="/prega-con-noi">PREGA CON NOI </router-link>
              <router-link class="dropdown-item" to="/approfondimenti">APPROFONDIMENTI </router-link>
            </div>
          </li>
        </ul>
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
  background: #c3ac7d;
}

.dropdown-item:hover{
  background-color: white;
}

@media (min-width: 768px) {
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