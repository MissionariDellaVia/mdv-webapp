<template>
  <header :class="['voc-intestazione', { 'voc-intestazione--alta': alta }]">
    <div
      v-if="fondale"
      class="voc-intestazione__fondale"
      :style="{ backgroundImage: `url(${fondale})` }"
      aria-hidden="true"
    ></div>

    <div class="container voc-intestazione__contenuto">
      <p v-if="occhiello" class="voc-intestazione__occhiello">{{ occhiello }}</p>

      <h1 class="voc-intestazione__titolo">{{ titolo }}</h1>
      <p v-if="sottotitolo" class="voc-intestazione__sottotitolo">{{ sottotitolo }}</p>

      <span class="voc-intestazione__filo" aria-hidden="true"></span>

      <nav class="voc-intestazione__menu" aria-label="Sezione vocazione">
        <router-link
          v-for="voce in menu"
          :key="voce.nome"
          :to="{ name: voce.nome }"
          :class="['voc-intestazione__voce', {
            'voc-intestazione__voce--attiva': voce.nome === $route.name,
          }]"
          :aria-current="voce.nome === $route.name ? 'page' : null"
        >{{ voce.breve }}</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
import indice from '@/assets/data/indice-vocazione.json';

// L'hub non e' nell'indice — l'indice elenca le pagine interne — ma nel
// menu ci deve stare: e' il ritorno, ed e' sempre la prima voce.
const MENU = [{ nome: 'vocazione', breve: 'Vocazione' }, ...indice];

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
  },
  data() {
    return { menu: MENU };
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
  justify-content: center;
  min-height: 64vh;
  padding-top: calc(var(--mdv-altezza-navbar) + var(--mdv-spazio-6));
  padding-bottom: var(--mdv-spazio-6);
  overflow: hidden;
  text-align: center;
  background:
    radial-gradient(90% 70% at 50% 18%, var(--voc-alone) 0%, transparent 68%),
    linear-gradient(180deg, var(--voc-fondo-alto) 0%, var(--voc-fondo) 82%);
}
.voc-intestazione--alta {
  min-height: 92vh;
}

.voc-intestazione__fondale {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-size: cover;
  background-position: center;
  opacity: 0.26;
  filter: grayscale(0.4) contrast(1.05);
  /* Sfuma verso il basso: l'immagine non ha mai un bordo che la chiude.
     Nella maschera "black" non e' un colore ma "opaco": non e' una scelta
     cromatica e non passa dai token. */
  -webkit-mask-image: linear-gradient(180deg, black 0%, transparent 88%);
  mask-image: linear-gradient(180deg, black 0%, transparent 88%);
  animation: voc-fondale 1800ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

.voc-intestazione__contenuto {
  position: relative;
  max-width: 52rem;
}

.voc-intestazione__occhiello {
  margin-bottom: var(--mdv-spazio-3);
  font-family: var(--mdv-font-navigazione);
  font-size: 0.8rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--mdv-oro);
  animation: voc-sale 900ms 200ms both cubic-bezier(0.22, 0.61, 0.36, 1);
}

.voc-intestazione__titolo {
  margin: 0;
  font-family: var(--mdv-font-titolo);
  font-size: clamp(3rem, 9vw, 6.5rem);
  line-height: 1.05;
  color: var(--mdv-oro-chiaro);
  animation: voc-sale 1100ms 320ms both cubic-bezier(0.22, 0.61, 0.36, 1);
}

.voc-intestazione__sottotitolo {
  margin: var(--mdv-spazio-4) auto 0 auto;
  max-width: 34rem;
  font-family: var(--mdv-font-corpo);
  font-size: clamp(1.1rem, 2.2vw, 1.45rem);
  line-height: 1.7;
  color: var(--mdv-bruno-900);
  opacity: 0.82;
  animation: voc-sale 1100ms 500ms both cubic-bezier(0.22, 0.61, 0.36, 1);
}

.voc-intestazione__filo {
  display: block;
  width: 9rem;
  height: 1px;
  margin: var(--mdv-spazio-6) auto;
  background: linear-gradient(90deg, transparent, var(--mdv-oro), transparent);
  animation: voc-filo 1200ms 700ms both cubic-bezier(0.22, 0.61, 0.36, 1);
}

/* Il menu sta qui, sotto il titolo, e non fra la navbar e l'immagine:
   e' dentro l'atmosfera invece di tagliarla. */
.voc-intestazione__menu {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--mdv-spazio-2) var(--mdv-spazio-5);
  animation: voc-sale 1100ms 880ms both cubic-bezier(0.22, 0.61, 0.36, 1);
}

.voc-intestazione__voce {
  position: relative;
  padding: var(--mdv-spazio-2) 0;
  font-family: var(--mdv-font-navigazione);
  font-size: 0.92rem;
  letter-spacing: 0.08em;
  color: var(--mdv-sabbia-chiara);
  text-decoration: none;
  opacity: 0.72;
  transition: opacity 0.3s ease, color 0.3s ease;
}
.voc-intestazione__voce::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--mdv-oro);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.voc-intestazione__voce:hover,
.voc-intestazione__voce:focus {
  opacity: 1;
  color: var(--mdv-oro-chiaro);
}
.voc-intestazione__voce:hover::after,
.voc-intestazione__voce:focus::after {
  transform: scaleX(1);
}
.voc-intestazione__voce--attiva {
  opacity: 1;
  color: var(--mdv-oro);
}
.voc-intestazione__voce--attiva::after {
  transform: scaleX(1);
}
.voc-intestazione__voce:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: 4px;
}

@keyframes voc-sale {
  from { opacity: 0; transform: translateY(1.6rem); }
  to   { opacity: 1; transform: none; }
}
@keyframes voc-filo {
  from { opacity: 0; transform: scaleX(0); }
  to   { opacity: 1; transform: none; }
}
@keyframes voc-fondale {
  from { opacity: 0; transform: scale(1.08); }
  to   { opacity: 0.26; transform: none; }
}

@media (max-width: 576px) {
  .voc-intestazione {
    min-height: 58vh;
  }
  .voc-intestazione--alta {
    min-height: 82vh;
  }
  .voc-intestazione__menu {
    gap: var(--mdv-spazio-2) var(--mdv-spazio-4);
  }
  .voc-intestazione__voce {
    font-size: 0.85rem;
  }
}
</style>
