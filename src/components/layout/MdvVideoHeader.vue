<template>
  <header class="video-wrapper">
    <video playsinline autoplay muted loop :poster="helper.getImgUrl('chiSiamo.jpg')">
      <source :src="helper.getImgUrl('intro-1440.mp4')" type="video/mp4">
    </video>

    <!-- Il ramo con il marchio e quello senza erano identici tranne una
         classe sul titolo: erano due copie della stessa cosa. -->
    <div class="header">
      <div class="header__contenuto">
        <h1 :class="['main-title uppercase', { 'with-brand': brand }]">{{ title }}</h1>
        <p v-if="caption" class="lead headerSection">{{ caption }}</p>
      </div>
    </div>

    <!-- L'unico invito a scorrere di tutto il sito: ha senso solo qui,
         dove l'apertura occupa tutto lo schermo e altrimenti non si
         capirebbe che sotto c'e' altro. -->
    <button type="button" class="video-wrapper__scorri" aria-label="Scorri per continuare" @click="scorriSotto">
      <i class="fas fa-chevron-down" aria-hidden="true"></i>
    </button>
  </header>
</template>

<script>
export default {
  name: "MdvVideoHeader",
  props: ['image', 'brand', 'title', 'caption'],
  data(){
    return {
      helper: this.$util
    }
  },
  methods: {
    // Il bordo inferiore dell'header stesso, non "una finestra di
    // altezza": su schermi che cambiano quota durante lo scorrimento
    // (la barra degli indirizzi dei telefoni si apre e si chiude) resta
    // valido comunque, perche' e' una misura presa nell'istante del
    // clic.
    scorriSotto() {
      const sotto = this.$el.getBoundingClientRect().bottom + window.scrollY;
      const morbido = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: sotto, behavior: morbido ? 'smooth' : 'auto' });
    },
  },
}
</script>

<style scoped>
.header__contenuto {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  text-align: center;
}


/* L'unico hero del sito che occupa tutto lo schermo: e' la porta
   d'ingresso, tutte le altre pagine hanno gia' un'intestazione piu'
   contenuta (vedi MdvHeader). "dvh" invece di "vh" perche' sul telefono
   la barra degli indirizzi si apre e si chiude scorrendo, e "vh" conta
   sempre lo spazio massimo — l'hero sarebbe sempre un po' piu' alto
   dello schermo visibile e l'invito a scorrere risulterebbe tagliato
   fuori. Il browserslist del progetto (ultime due versioni, "not dead")
   non copre piu' nessun browser senza "dvh", quindi non serve un valore
   di riserva. */
.video-wrapper {
  position: relative;
  height: 100dvh;
  overflow: hidden;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-wrapper::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  background: linear-gradient(180deg, color-mix(in srgb, var(--mdv-bruno-900) 80%, transparent) 0%, transparent 32%);
}
video {
  object-fit: cover;
  height: 100%;
  width: 100%;

  position: absolute;
  top: 0;
  left: 0;
}
.header{
  position: relative;
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-bianco);
  text-shadow: 1px 1px 8px var(--mdv-velo-scuro);
}

.lead.headerSection {
  font-size: clamp(1.15rem, 2.4vw, 1.6rem);
  text-transform: uppercase;
  width: 80%;
  margin: auto;
  color: var(--mdv-argento);
}

/* Piu' grande di prima (era 4rem fissi): a tutto schermo lo spazio in
   piu' va riempito, non lasciato vuoto attorno a un titolo piccolo. Il
   minimo resta leggibile anche sui telefoni piu' stretti senza bisogno
   di un'eccezione a parte. */
.main-title {
  font-size: clamp(2.75rem, 6.2vw, 5rem);
}

/* L'invito a scorrere: un rimbalzo lentissimo e una pausa, come il
   riflesso sulla voce accesa della barra dentro /vocazione — si vede
   se lo si guarda, non chiede attenzione da solo. E' un bottone vero,
   non un'icona muta: si puo' toccare, e porta esattamente dove
   promette. */
.video-wrapper__scorri {
  position: absolute;
  left: 50%;
  bottom: var(--mdv-spazio-5);
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid color-mix(in srgb, var(--mdv-bianco) 55%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--mdv-bruno-900) 25%, transparent);
  color: var(--mdv-bianco);
  font-size: 1rem;
  cursor: pointer;
  animation: video-scorri 2.8s var(--mdv-curva-morbida) infinite;
}
.video-wrapper__scorri:hover,
.video-wrapper__scorri:focus-visible {
  border-color: var(--mdv-bianco);
}
.video-wrapper__scorri:focus-visible {
  outline: 2px solid var(--mdv-bianco);
  outline-offset: 3px;
}
@keyframes video-scorri {
  0%, 55%, 100% { transform: translateX(-50%) translateY(0); }
  27% { transform: translateX(-50%) translateY(0.4rem); }
}
@media (prefers-reduced-motion: reduce) {
  .video-wrapper__scorri {
    animation: none;
  }
}
</style>