<template>
<!--  <header :class="'md-bg bg' + {rootImage}">-->
  <header :class="['md-bg', { 'md-bg--pronta': pronta }]" :style="inlineStyle">
    <div class="container h-100">
      <div class="row h-100 align-items-center">
        <div v-if="brand" class="col-12 text-center">
<!--          <img src="../../assets/logo.png" class="mt-5" alt="logoHome"/>-->
          <h1 class="main-title with-brand text-uppercase">{{ title }}</h1>
          <p v-if="caption" class="lead headerSection">{{ caption }}</p>
        </div>
        <div v-else class="col-12 text-center">
          <h1 class="main-title text-uppercase">{{ title }}</h1>
          <p v-if="caption" class="lead headerSection">{{ caption }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "MdvHeader",
  props: ['image', 'brand', 'title', 'caption'],
  data(){
    return {
      helper: this.$util,
      // Finche' la foto non e' pronta, l'intestazione resta del suo bruno:
      // lo spazio e' gia' riservato, quindi non c'e' niente che si sposta.
      pronta: false
    }
  },
  computed: {
    indirizzoFoto () {
      return this.$util.getImgUrl(this.image ? this.image : 'default.jpg')
    },
    inlineStyle () {
      return { '--mdv-header-foto': `url(${this.indirizzoFoto})` }
    }
  },
  watch: {
    // Nelle pagine ibride l'indirizzo puo' cambiare dopo il primo disegno.
    indirizzoFoto: {
      immediate: true,
      handler (indirizzo) {
        this.pronta = false;
        if (!indirizzo) return;
        const foto = new Image();
        // In entrambi i casi si smette di aspettare: un'immagine che non
        // arriva non deve lasciare l'intestazione vuota per sempre.
        foto.onload = () => { this.pronta = true; };
        foto.onerror = () => { this.pronta = true; };
        foto.src = indirizzo;
      }
    }
  },
}
</script>

<style scoped>

@media only screen and (max-width: 480px) {
  .md-bg {
    height: 100vh !important;
  }
  .main-title {
    font-size: 3rem !important;
  }
  .with-brand {
    font-size: 2.4rem !important;
  }
  .lead.headerSection {
    font-size: 1.5rem !important;
  }
  img {
    width: 2rem !important;
    margin-bottom: 1rem;
  }
}

/* L'altezza e' fissa e non dipende dalla foto: lo spazio e' riservato dal
   primo fotogramma, quindi la pagina non cresce sotto gli occhi quando
   l'immagine arriva. Il fondo bruno regge la scritta anche prima. */
.md-bg {
  position: relative;
  isolation: isolate;
  font-family: var(--mdv-font-titolo);
  height: 45rem;
  margin-bottom: 3%;
  background-color: var(--mdv-bruno-900);
  color: var(--mdv-bianco);
}

/* La foto sta su un livello suo per poterla far entrare in dissolvenza:
   un'immagine di fondo non si puo' animare, un livello si'. */
.md-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: var(--mdv-header-foto);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: inset 0 0 0 2000px var(--mdv-ombra-media);
  opacity: 0;
  transition: opacity 600ms var(--mdv-curva-morbida);
}
.md-bg--pronta::before {
  opacity: 1;
}

.lead.headerSection {
  font-size: 2rem;
  width: 80%;
  margin: auto;
  color: var(--mdv-grigio-chiaro);
}

img {
  width: 4.5rem;
}

.main-title {
  font-size: 4rem;
}

</style>