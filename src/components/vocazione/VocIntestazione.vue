<template>
  <header class="voc-intestazione">
    <transition name="fondale">
      <div
        v-if="fondale"
        :key="fondale"
        class="voc-intestazione__fondale"
        :style="{ backgroundImage: `url(${fondale})` }"
        aria-hidden="true"
      ></div>
    </transition>

    <div class="voc-intestazione__contenuto">
      <!-- Cambiando pagina cambia solo cio' che sta qui dentro. Lo spazio
           e' riservato e i due testi si danno il cambio sovrapposti,
           quindi il filo e il menu non si spostano di un pixel: la loro
           posizione e' identica su tutte le pagine della sezione. -->
      <div class="voc-intestazione__testo">
        <!-- "appear": anche la prima comparsa e' un'entrata, non un
             apparire di colpo. Senza, il titolo si vedeva gia' fatto
             sotto il velo che si alzava, invece di formarsi mentre si
             alza. -->
        <transition name="titolo" mode="out-in" appear>
          <div :key="titolo" class="voc-intestazione__strato">
            <p v-if="occhiello" class="voc-intestazione__occhiello">{{ occhiello }}</p>
            <h1 class="voc-intestazione__titolo">{{ titolo }}</h1>
            <p v-if="sottotitolo" class="voc-intestazione__sottotitolo">{{ sottotitolo }}</p>
          </div>
        </transition>
      </div>

      <span class="voc-intestazione__filo entra entra--4" aria-hidden="true"></span>

      <!-- Il menu resta montato: e' il punto fermo della sezione. -->
      <nav v-if="voci.length" class="voc-intestazione__menu entra entra--5" :aria-label="etichettaMenu">
        <router-link
          v-for="voce in voci"
          :key="voce.nome"
          :to="{ name: voce.nome }"
          :class="['mdv-navlink', 'voc-intestazione__voce', {
            'mdv-navlink--attivo': voce.nome === $route.name,
          }]"
          :aria-current="voce.nome === $route.name ? 'page' : null"
        >{{ voce.breve }}</router-link>
      </nav>
    </div>
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
    // Le voci arrivano da fuori: l'intestazione non sa nulla della
    // sezione che sta intestando, e puo' servirne altre.
    voci: { type: Array, default: () => [] },
    etichettaMenu: { type: String, default: 'Sezione' },
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
   bordo inferiore — si scioglie nello sfondo.

   Una sola geometria per tutte le pagine, hub compreso: se la copertina
   fosse piu' alta, il menu si troverebbe ogni volta a un'altezza diversa
   e il passaggio da una pagina all'altra si vedrebbe come uno scarto. */
.voc-intestazione {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 42vh;
  padding-top: calc(var(--mdv-altezza-navbar) + var(--mdv-spazio-4));
  padding-bottom: var(--mdv-spazio-5);
  overflow: hidden;
  text-align: center;
  background:
    radial-gradient(90% 70% at 50% 18%, var(--voc-alone) 0%, transparent 68%),
    linear-gradient(180deg, var(--voc-fondo-alto) 0%, var(--voc-fondo) 82%);
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
  margin-inline: auto;
  padding-inline: var(--mdv-spazio-4);
}

/* Altezza riservata al titolo: e' il motivo per cui il menu non balla
   passando da "Vocazione" a "Vocazione alla vita consacrata". */
.voc-intestazione__testo {
  position: relative;
  min-height: clamp(8.5rem, 19vh, 12rem);
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
  font-size: clamp(2.1rem, 5.4vw, 3.6rem);
  line-height: 1.1;
  color: var(--mdv-oro-chiaro);
}

.voc-intestazione__sottotitolo {
  margin: var(--mdv-spazio-3) auto 0 auto;
  max-width: 34rem;
  font-family: var(--mdv-font-corpo);
  font-size: clamp(1.02rem, 1.9vw, 1.2rem);
  line-height: var(--mdv-interlinea-corpo);
  color: var(--mdv-bruno-900);
  opacity: 0.82;
}

.voc-intestazione__filo {
  display: block;
  width: 9rem;
  height: 1px;
  margin: var(--mdv-spazio-5) auto;
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
  /* La riga scorre ma la barra e' nascosta, quindi quando non ci sta
     l'ultima voce viene tagliata a meta' parola e basta: "Proposta" si
     legge "Propost", e sembra un errore di battitura invece che un menu
     che continua. Le due sfumature ai bordi dicono che c'e' dell'altro.
     Quando la riga ci sta tutta cadono sullo spazio vuoto ai lati e non
     si vedono, quindi non serve accenderle a mano.
     "black" qui non e' un colore: di una maschera conta solo l'opacita'. */
  --sfumatura: linear-gradient(
    to right,
    transparent 0,
    black var(--mdv-spazio-5),
    black calc(100% - var(--mdv-spazio-5)),
    transparent 100%
  );
  -webkit-mask-image: var(--sfumatura);
  mask-image: var(--sfumatura);
}
.voc-intestazione__menu::-webkit-scrollbar {
  display: none;
}

/* Il gesto e' quello di .mdv-navlink, condiviso con tutto il sito. Qui
   restano solo le misure che dipendono da questa riga: non deve andare a
   capo e deve rimpicciolirsi quando lo schermo stringe. */
.voc-intestazione__voce {
  flex: 0 0 auto;
  font-size: clamp(0.78rem, 1.35vw, 0.92rem);
  white-space: nowrap;
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
</style>
