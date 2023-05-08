<template>
  <footer v-if="show" class="py-5">
    <div class="container">

      <div class="row">
        <div class="col-md-12 text-center">
          <span class="fi fi-it" @click="changeLang('it')"></span>
          <span class="fi fi-gb ms-3" @click="changeLang('en')"></span>
          <span class="fi fi-es ms-3" @click="changeLang('es')"></span>
          <span class="fi fi-pt ms-3" @click="changeLang('pt')"></span>
          <span class="fi fi-fr ms-3" @click="changeLang('fr')"></span>
          <span class="fi fi-pl ms-3" @click="changeLang('pl')"></span>
        </div>
      </div>

      <div class="row mx-auto my-5 gy-3">
        <div v-for="(footer, index) in footerList" v-bind:key="index" class="col-sm-3 hoverable">
          <h5 class="text-center">{{ footer.title }}</h5>
          <a target="_blank" :href="`${footer.to}`">
            <img class="img-fluid" :src="helper.getImgUrl(`${footer.image}`)" :alt="footer.image"/>
          </a>
        </div>
      </div>

<!--      <div class="row">-->
<!--        <div class="col-md-12">-->
<!--          <p class="text-center">Puoi seguirci anche su:</p>-->
<!--        </div>-->
<!--      </div>-->
      <div class="row mb-4 text-center">
        <ul class="list-inline social-network social-circle">
          <li><a target="_blank" rel="noopener noreferrer"
                 href="https://www.facebook.com/people/Missionari-e-Missionarie-della-Via/100068706078801/"
                 class="icoFacebook " title="Facebook"><i class="fa fa-facebook fa-xl"></i></a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/missionaridellavia/"
                 class="icoInstagram " title="Instagram"><i class="fa-brands fa-instagram fa-xl"></i></a></li>
          <li><a target="_blank" rel="noopener noreferrer"
                 href="https://www.youtube.com/channel/UCI-KljGpZAOQlazH5vuRlfA" class="icoYoutube " title="Youtube"><i
              class="fa-brands fa-youtube fa-xl"></i></a></li>
        </ul>
      </div>

      <div class="row mb-4">
        <div class="col-md-12 copy">
          <p class="text-center">&copy; Copyright 2022 - Missionari della Via. Tutti i diritti riservati.</p>
        </div>
      </div>
    </div>
  </footer>

</template>

<script>
export default {
  name: "MdvFooter",
  data() {
    return {
      helper: this.$util,
      show: false,
      isLoading: false
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    footerList() {
      return this.$store.getters['page/footer'];
    },
  },
  watch: {
    $route(to, from) {
      console.debug('to: ' + to.path + ' - from: ' + from.path)
      this.show = false;
      this.setShow();
    }
  },
  methods: {
    setShow() {
      setTimeout(() => {
        this.show = true;
      }, 300);
    },
    scrollToTop() {
      window.scrollTo(0,0);
    },
    async changeLang(lang) {
      this.isLoading = true;
      try {
        console.debug("change from " + localStorage.getItem('lang') + " to " + lang);
        console.debug("current route " + this.currentRouteName);
        this.$store.dispatch('page/changeLang', {lang: lang, route: this.currentRouteName});
        this.scrollToTop();
      } catch (error) {
        // this.showToast(error.message || 'Errore caricamento pagina!');
      }
      this.isLoading = false
    },
  },
  created() {
    this.setShow();
  },
}
</script>

<style scoped>
footer {
  background: rgb(40, 29, 2, 0.9);
  -webkit-box-shadow: inset 0 2px 13px 6px #281D02E5;
  -moz-box-shadow: inset 0 2px 13px 6px #281D02E5;
  box-shadow: inset 0 2px 13px 6px #281D02E5;
  color: white;
  position: relative;
  bottom: 0;
}

.hoverable {
  transition-duration: 0.2s;
  transform: scale(0.8);
}

.hoverable:hover {
  transform: scale(1);
  color: #c3ac7d;
}

.copy {
  font-size: 0.8rem;
  padding: 0.8rem;
  border-top: 1px solid #FFFFFF;
}

ul.social-network {
  list-style: none;
  display: inline;
  margin-left: 0 !important;
  padding: 0;
}

ul.social-network li {
  display: inline;
  margin: 0 5px;
}

.social-network a.icoFacebook:hover {
  background-color: #3B5998;
}

.social-network a.icoInstagram:hover {
  background-color: #b83dbd;
}

.social-network a.icoYoutube:hover {
  background-color: #ff0000;
}

.social-network a.icoFacebook:hover i,
.social-network a.icoInstagram:hover i,
.social-network a.icoYoutube:hover i {
  color: #fff;
}

.social-network a.socialIcon:hover,
.socialHoverClass {
  color: #44BCDD;
}

.social-circle li a {
  display: inline-block;
  position: relative;
  margin: 0 auto 0 auto;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  text-align: center;
  width: 3.5rem;
  height: 3.5rem;
  font-size: 1.2rem;
}

.social-circle li i {
  margin: 0;
  line-height: 3.5rem;
  color: #fff;
  text-align: center;
}

.social-circle li a:hover i,
.triggeredHover {
  -moz-transform: rotate(360deg);
  -webkit-transform: rotate(360deg);
  -ms--transform: rotate(360deg);
  transform: rotate(360deg);
  -webkit-transition: all 0.2s;
  -moz-transition: all 0.2s;
  -o-transition: all 0.2s;
  -ms-transition: all 0.2s;
  transition: all 0.2s;
}

.social-circle i {
  color: #595959;
  -webkit-transition: all 0.8s;
  -moz-transition: all 0.8s;
  -o-transition: all 0.8s;
  -ms-transition: all 0.8s;
  transition: all 0.8s;
}

.social-network a {
  background-color: #c3ac7d;
  transition: all 0.8s;
}

.fi {
  font-size: larger;
  cursor: pointer;
  transition: all 0.1s ease;
}
.fi:hover {
  transform: scale(1.4);
}
</style>
