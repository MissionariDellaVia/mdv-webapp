<template>
  <footer class="py-5 entra-velata">
    <div class="container">

      <div class="row">
        <div class="col-md-12 text-center">
          <!-- Le bandiere erano una libreria da 259 paesi per i sei che
               servono, e Vite le incorporava tutte nel foglio di stile.
               Ora sono sei file, e sono bottoni: prima erano <span>, quindi
               col tabulatore non si raggiungevano. -->
          <button
            v-for="lingua in lingue"
            :key="lingua.codice"
            type="button"
            class="bandiera"
            :class="{ 'bandiera--attiva': lingua.codice === linguaCorrente }"
            :aria-label="lingua.nome"
            :aria-current="lingua.codice === linguaCorrente ? 'true' : null"
            @click="changeLang(lingua.codice)"
          >
            <img :src="helper.getImgUrl(`bandiere/${lingua.bandiera}.svg`)" alt="" />
          </button>
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
      isLoading: false,
      lingue: [
        { codice: 'it', bandiera: 'it', nome: 'Italiano' },
        { codice: 'en', bandiera: 'gb', nome: 'English' },
        { codice: 'es', bandiera: 'es', nome: 'Español' },
        { codice: 'pt', bandiera: 'pt', nome: 'Português' },
        { codice: 'fr', bandiera: 'fr', nome: 'Français' },
        { codice: 'pl', bandiera: 'pl', nome: 'Polski' },
      ]
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    footerList() {
      return this.$store.getters['page/footer'];
    },
    linguaCorrente() {
      void this.$store.getters['page/navbar'];
      return localStorage.getItem('lang') || 'it';
    },
  },
  // Come la navbar: restava fermo il contenuto e spariva il contenitore.
  methods: {
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
        console.error("Errore nel caricamento della pagina:", error);
      }
      this.isLoading = false
    },
  },
}
</script>

<style scoped>
footer {
  background: var(--mdv-bruno-900-velato);
  -webkit-box-shadow: inset 0 2px 13px 6px var(--mdv-bruno-900-velato);
  -moz-box-shadow: inset 0 2px 13px 6px var(--mdv-bruno-900-velato);
  box-shadow: inset 0 2px 13px 6px var(--mdv-bruno-900-velato);
  color: white;
  position: relative;
  bottom: 0;
}

.hoverable {
  transition-duration: 0.2s;
  transform: scale(0.95);
}

.hoverable:hover {
  transform: scale(1.1);
  color: var(--mdv-sabbia);
}

.copy {
  font-size: 0.8rem;
  padding: 0.8rem;
  border-top: 1px solid var(--mdv-bianco);
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
  background-color: var(--mdv-social-facebook);
}

.social-network a.icoInstagram:hover {
  background-color: var(--mdv-social-instagram);
}

.social-network a.icoYoutube:hover {
  background-color: var(--mdv-social-youtube);
}

.social-network a.icoFacebook:hover i,
.social-network a.icoInstagram:hover i,
.social-network a.icoYoutube:hover i {
  color: var(--mdv-bianco);
}

.social-network a.socialIcon:hover,
.socialHoverClass {
  color: var(--mdv-social-telegram);
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
  color: var(--mdv-bianco);
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
  color: var(--mdv-grigio-scuro);
  -webkit-transition: all 0.8s;
  -moz-transition: all 0.8s;
  -o-transition: all 0.8s;
  -ms-transition: all 0.8s;
  transition: all 0.8s;
}

.social-network a {
  background-color: var(--mdv-sabbia);
  transition: all 0.8s;
}

.bandiera {
  padding: var(--mdv-spazio-1);
  margin: 0 var(--mdv-spazio-2);
  border: none;
  background: none;
  cursor: pointer;
  line-height: 0;
  opacity: 0.65;
  transition: opacity 0.25s ease, transform 0.25s var(--mdv-curva-morbida);
}
.bandiera img {
  width: 1.6rem;
  height: 1.2rem;
  object-fit: cover;
  border-radius: 2px;
}
.bandiera--attiva {
  opacity: 1;
}
.bandiera:focus-visible {
  outline: 2px solid var(--mdv-sabbia);
  outline-offset: 3px;
}
@media (hover: hover) {
  .bandiera:hover {
    opacity: 1;
    transform: scale(1.25);
  }
}
</style>
