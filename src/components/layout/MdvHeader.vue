<template>
  <header :class="['md-bg', { 'md-bg--pronta': pronta }]" :style="inlineStyle">
    <div class="md-bg__contenuto">
      <h1 :class="['main-title uppercase', { 'with-brand': brand }]">{{ title }}</h1>
      <p v-if="caption" class="lead headerSection">{{ caption }}</p>
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

/* Era alta 45rem fisse, e in cima a Vocazione — l'unica sezione con
   un'intestazione sua — se ne vedono circa 33: sei intestazioni uguali
   fra loro e piu' grandi di quella. Ora la misura e' la stessa di
   VocIntestazione, min-height in vh invece di un'altezza fissa: sugli
   schermi bassi occupa meno, su quelli alti si adegua.
   Prima c'era anche un'eccezione per il telefono che la portava a
   100vh — cioe' piu' grande proprio dove lo spazio conta di piu'. Il
   min-height in vh la rende gia' proporzionata li' senza bisogno di
   un'eccezione. */
.md-bg {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: var(--mdv-font-titolo);
  min-height: 42vh;
  padding-top: calc(var(--mdv-altezza-navbar) + var(--mdv-spazio-4));
  padding-bottom: var(--mdv-spazio-6);
  margin-bottom: 3%;
  background-color: var(--mdv-bruno-900);
  color: var(--mdv-bianco);
}

/* Il centraggio verticale sta sul genitore, non piu' qui: un'altezza
   fissa permetteva a questo elemento di essere alto "100%" del genitore,
   ma con un'altezza minima invece che fissa quel 100% tornerebbe auto. */
.md-bg__contenuto {
  max-width: 60rem;
  margin: 0 auto;
  padding: 0 var(--mdv-spazio-4);
  text-align: center;
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

/* Stessa scala di VocIntestazione: fluida fra un minimo e un massimo,
   non un valore fisso che resta identico su ogni schermo. */
.lead.headerSection {
  font-size: clamp(1.02rem, 1.9vw, 1.2rem);
  width: 80%;
  margin: auto;
  color: var(--mdv-grigio-chiaro);
}

.main-title {
  font-size: clamp(2.1rem, 5.4vw, 3.6rem);
}

</style>