<template>
  <header :class="['voc-intestazione', { 'voc-intestazione--alta': alta }]">
    <div
      v-if="fondale"
      class="voc-intestazione__fondale"
      :style="{ backgroundImage: `url(${fondale})` }"
      aria-hidden="true"
    ></div>

    <div class="container voc-intestazione__contenuto">
      <router-link
        v-if="ritorno"
        :to="{ name: 'vocazione' }"
        class="voc-intestazione__ritorno"
      >
        <span class="voc-intestazione__freccia" aria-hidden="true">←</span> Vocazione
      </router-link>

      <p v-if="occhiello" class="voc-intestazione__occhiello">{{ occhiello }}</p>
      <h1 class="voc-intestazione__titolo">{{ titolo }}</h1>
      <p v-if="sottotitolo" class="voc-intestazione__sottotitolo">{{ sottotitolo }}</p>
      <span class="voc-intestazione__filo" aria-hidden="true"></span>
    </div>

    <span v-if="alta" class="voc-intestazione__discesa" aria-hidden="true"></span>
  </header>
</template>

<script>
export default {
  name: 'VocIntestazione',
  props: {
    titolo: { type: String, required: true },
    sottotitolo: { type: String, default: '' },
    // Sopracciglio: dice dove ci si trova senza bisogno di una barra.
    occhiello: { type: String, default: '' },
    immagine: { type: String, default: '' },
    // L'hub apre la sezione e occupa quasi tutto lo schermo; le pagine
    // interne no, altrimenti si scrolla molto per arrivare al testo.
    alta: { type: Boolean, default: false },
    ritorno: { type: Boolean, default: false },
  },
  computed: {
    fondale() {
      return this.immagine ? this.$util.getImgUrl(this.immagine) : '';
    },
  },
};
</script>

<style scoped>
/* Questa intestazione non e' MdvHeader: e' la porta della sezione.
   La foto resta, ma come memoria sotto il buio; il gradiente finisce
   esattamente sul colore di fondo della pagina, cosi' l'hero non ha un
   bordo inferiore — si scioglie nello sfondo. */
.voc-intestazione {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 62vh;
  padding-top: calc(var(--mdv-altezza-navbar) + var(--mdv-spazio-5));
  padding-bottom: var(--mdv-spazio-6);
  overflow: hidden;
  background:
    radial-gradient(90% 70% at 50% 12%, var(--voc-alone) 0%, transparent 68%),
    linear-gradient(180deg, var(--voc-fondo-alto) 0%, var(--voc-fondo) 78%);
}
.voc-intestazione--alta {
  min-height: 88vh;
}

.voc-intestazione__fondale {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-size: cover;
  background-position: center;
  opacity: 0.28;
  filter: grayscale(0.4) contrast(1.05);
  /* Sfuma verso il basso: l'immagine non ha mai un bordo che la chiude.
     Nella maschera "black" non e' un colore ma "opaco": non e' una scelta
     cromatica e non passa dai token. */
  -webkit-mask-image: linear-gradient(180deg, black 0%, transparent 88%);
  mask-image: linear-gradient(180deg, black 0%, transparent 88%);
  animation: voc-respiro-fondale 1600ms ease-out both;
}

.voc-intestazione__contenuto {
  position: relative;
  max-width: 46rem;
}

.voc-intestazione__ritorno {
  display: inline-block;
  margin-bottom: var(--mdv-spazio-5);
  font-family: var(--mdv-font-navigazione);
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  color: var(--mdv-sabbia-chiara);
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.2s, color 0.2s;
  animation: voc-sale 800ms 120ms both ease-out;
}
.voc-intestazione__ritorno:hover,
.voc-intestazione__ritorno:focus {
  opacity: 1;
  color: var(--mdv-oro-chiaro);
}
.voc-intestazione__freccia {
  display: inline-block;
  transition: transform 0.2s;
}
.voc-intestazione__ritorno:hover .voc-intestazione__freccia {
  transform: translateX(-0.25rem);
}

.voc-intestazione__occhiello {
  margin-bottom: var(--mdv-spazio-2);
  font-family: var(--mdv-font-navigazione);
  font-size: 0.8rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--mdv-oro);
  animation: voc-sale 900ms 260ms both ease-out;
}

.voc-intestazione__titolo {
  margin: 0;
  font-family: var(--mdv-font-titolo);
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  line-height: 1.1;
  color: var(--mdv-oro-chiaro);
  animation: voc-sale 1000ms 380ms both ease-out;
}

.voc-intestazione__sottotitolo {
  margin: var(--mdv-spazio-3) 0 0 0;
  font-family: var(--mdv-font-corpo);
  font-size: clamp(1.05rem, 2vw, 1.3rem);
  line-height: 1.7;
  color: var(--mdv-bruno-900);
  opacity: 0.82;
  animation: voc-sale 1000ms 540ms both ease-out;
}

.voc-intestazione__filo {
  display: block;
  height: 1px;
  margin-top: var(--mdv-spazio-5);
  background: linear-gradient(90deg, var(--mdv-oro), transparent);
  animation: voc-filo 1200ms 760ms both ease-out;
}

.voc-intestazione__discesa {
  position: absolute;
  left: 50%;
  bottom: var(--mdv-spazio-4);
  width: 1px;
  height: 3rem;
  background: linear-gradient(180deg, transparent, var(--mdv-oro));
  animation: voc-respiro 2800ms 1400ms ease-in-out infinite;
}

@keyframes voc-sale {
  from { opacity: 0; transform: translateY(1.4rem); }
  to   { opacity: 1; transform: none; }
}
@keyframes voc-filo {
  from { width: 0; opacity: 0; }
  to   { width: 8rem; opacity: 1; }
}
@keyframes voc-respiro-fondale {
  from { opacity: 0; transform: scale(1.06); }
  to   { opacity: 0.28; transform: none; }
}
@keyframes voc-respiro {
  0%, 100% { opacity: 0.15; transform: translateY(-0.4rem); }
  50%      { opacity: 0.8; transform: translateY(0.4rem); }
}

@media (max-width: 576px) {
  .voc-intestazione {
    min-height: 56vh;
  }
  .voc-intestazione--alta {
    min-height: 76vh;
  }
}
</style>
