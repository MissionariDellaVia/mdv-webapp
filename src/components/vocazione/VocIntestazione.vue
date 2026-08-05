<template>
  <header :class="['voc-intestazione', { 'voc-intestazione--alta': alta }]">
    <transition name="fondale">
      <div
        v-if="fondale"
        :key="fondale"
        class="voc-intestazione__fondale"
        :style="{ backgroundImage: `url(${fondale})` }"
        aria-hidden="true"
      ></div>
    </transition>

    <div class="container voc-intestazione__contenuto">
      <!-- Cambiando pagina cambia solo cio' che sta qui dentro. Lo spazio
           e' riservato e i due testi sono sovrapposti, quindi il titolo
           nuovo entra mentre il vecchio esce senza che niente si sposti
           in altezza: il filo e il menu non si muovono di un pixel. -->
      <div class="voc-intestazione__testo">
        <!-- out-in: senza, i due titoli restano sovrapposti per mezzo
             secondo e si legge un doppione — il nuovo che compare mentre
             il vecchio e' ancora li'. Lo spazio e' riservato, quindi
             darsi il cambio non sposta niente. -->
        <transition name="titolo" mode="out-in">
          <div :key="titolo" class="voc-intestazione__strato">
            <p v-if="occhiello" class="voc-intestazione__occhiello">{{ occhiello }}</p>
            <h1 class="voc-intestazione__titolo">{{ titolo }}</h1>
            <p v-if="sottotitolo" class="voc-intestazione__sottotitolo">{{ sottotitolo }}</p>
          </div>
        </transition>
      </div>

      <span class="voc-intestazione__filo entra entra--4" aria-hidden="true"></span>

      <!-- Il menu resta montato: e' il punto fermo della sezione. -->
      <nav class="voc-intestazione__menu entra entra--5" aria-label="Sezione vocazione">
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
}

.voc-intestazione__contenuto {
  position: relative;
  max-width: 54rem;
}

/* Altezza riservata al titolo: e' il motivo per cui il menu non balla
   passando da "Vocazione" a "Vocazione alla vita consacrata". Scala con
   lo schermo insieme al corpo del titolo. */
.voc-intestazione__testo {
  position: relative;
  min-height: clamp(15rem, 32vh, 22rem);
}
.voc-intestazione__strato {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.voc-intestazione__occhiello {
  margin-bottom: var(--mdv-spazio-3);
  font-family: var(--mdv-font-navigazione);
  font-size: 0.8rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--mdv-oro);
}

.voc-intestazione__titolo {
  margin: 0;
  font-family: var(--mdv-font-titolo);
  font-size: clamp(2.6rem, 7.6vw, 5.6rem);
  line-height: 1.08;
  color: var(--mdv-oro-chiaro);
}

.voc-intestazione__sottotitolo {
  margin: var(--mdv-spazio-4) auto 0 auto;
  max-width: 34rem;
  font-family: var(--mdv-font-corpo);
  font-size: clamp(1.1rem, 2.2vw, 1.45rem);
  line-height: 1.7;
  color: var(--mdv-bruno-900);
  opacity: 0.82;
}

.voc-intestazione__filo {
  display: block;
  width: 9rem;
  height: 1px;
  margin: var(--mdv-spazio-6) auto;
  background: linear-gradient(90deg, transparent, var(--mdv-oro), transparent);
}

/* Il menu sta qui, sotto il titolo, e non fra la navbar e l'immagine:
   e' dentro l'atmosfera invece di tagliarla. Sta su una riga sola; se
   lo schermo non basta scorre in orizzontale, che e' meno peggio del
   menu che va a capo e smette di leggersi come menu. */
.voc-intestazione__menu {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  /* "safe" evita che, quando la riga non ci sta, il centraggio nasconda
     la prima voce oltre il bordo sinistro dell'area che scorre. */
  justify-content: safe center;
  gap: clamp(var(--mdv-spazio-3), 2.4vw, var(--mdv-spazio-5));
  max-width: 100%;
  padding-inline: var(--mdv-spazio-2);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.voc-intestazione__menu::-webkit-scrollbar {
  display: none;
}

/* Metriche identiche per ogni voce — stessa altezza di riga, stesso
   riempimento, display esplicito: cosi' nessuna puo' sedersi piu' in
   alto o piu' in basso delle altre. */
.voc-intestazione__voce {
  position: relative;
  display: block;
  flex: 0 0 auto;
  padding: var(--mdv-spazio-2) 0;
  line-height: 1.4;
  font-family: var(--mdv-font-navigazione);
  font-size: clamp(0.78rem, 1.35vw, 0.92rem);
  letter-spacing: 0.07em;
  white-space: nowrap;
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
  transition: transform 0.35s var(--mdv-curva-morbida);
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

/* Il titolo si scambia in dissolvenza incrociata, con un velo di sfocatura
   che fa "mettere a fuoco" quello nuovo. Niente spostamenti: il testo non
   sale e non scende, cambia e basta. */
.titolo-enter-active {
  transition:
    opacity 620ms var(--mdv-curva-morbida),
    filter 620ms var(--mdv-curva-morbida);
}
.titolo-leave-active {
  transition:
    opacity 300ms ease-in,
    filter 300ms ease-in;
}
.titolo-enter-from,
.titolo-leave-to {
  opacity: 0;
  filter: blur(12px);
}

/* La foto di fondo si sostituisce in dissolvenza incrociata: i due
   livelli sono sovrapposti, quindi non c'e' mai un buco fra l'una e
   l'altra. Ultime nel foglio perche' devono vincere sull'opacita' base. */
.fondale-enter-active,
.fondale-leave-active {
  transition: opacity 900ms var(--mdv-curva-morbida);
}
.fondale-enter-from,
.fondale-leave-to {
  opacity: 0;
}

@media (max-width: 576px) {
  .voc-intestazione {
    min-height: 58vh;
  }
  .voc-intestazione--alta {
    min-height: 82vh;
  }
}
</style>
