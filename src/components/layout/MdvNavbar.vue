<template>
  <nav class="barra" :class="{ 'barra--tinta': scrollPosition > 50 }">
    <div class="barra__contenuto">
      <router-link class="barra__marchio" :to="{ name: 'chi-siamo' }">
        <img src="../../assets/logo.png" alt="Missionari della Via" class="barra__logo" />
      </router-link>

      <!-- Su schermo largo le voci stanno in riga; sotto la soglia
           passano nel cassetto. Sono lo stesso elenco: cambia solo dove
           viene disegnato. -->
      <ul class="barra__voci">
        <li
          v-for="(item, index) in navbarItems"
          :key="index"
          :class="['barra__voce', { 'barra__voce--altrove': portaFuori(item) }]"
          @mouseenter="apriGruppo(item, index)"
          @mouseleave="apertoIndice = null"
        >
          <template v-if="item.type === 'link'">
            <a
              v-if="item.external"
              target="_blank"
              rel="noopener noreferrer"
              :href="item.to"
              class="mdv-navlink mdv-navlink--chiaro barra__link"
            >
              {{ item.title }}
              <span class="fuori" aria-hidden="true">↗</span>
              <span class="sr-only">(si apre in una nuova scheda)</span>
            </a>
            <router-link
              v-else
              :class="['mdv-navlink', 'mdv-navlink--chiaro', 'barra__link',
                       { 'mdv-navlink--attivo': $route.path === item.to }]"
              :to="item.to"
            >{{ item.title }}</router-link>
          </template>

          <template v-else-if="item.type === 'dropdown'">
            <button
              type="button"
              class="mdv-navlink mdv-navlink--chiaro barra__link barra__link--gruppo"
              :aria-expanded="apertoIndice === index ? 'true' : 'false'"
              @click="apertoIndice = apertoIndice === index ? null : index"
            >
              {{ item.title }}
              <span class="barra__freccia" aria-hidden="true">⌄</span>
            </button>
            <ul v-show="apertoIndice === index" class="barra__pannello">
              <li v-for="(sotto, idx) in item.links" :key="idx">
                <a
                  v-if="sotto.external"
                  target="_blank"
                  rel="noopener noreferrer"
                  :href="sotto.to"
                  class="barra__sottolink"
                  @click="apertoIndice = null"
                >
                  {{ sotto.title }}
                  <span class="fuori" aria-hidden="true">↗</span>
                  <span class="sr-only">(si apre in una nuova scheda)</span>
                </a>
                <router-link
                  v-else
                  class="barra__sottolink"
                  :to="sotto.to"
                  @click="apertoIndice = null"
                >{{ sotto.title }}</router-link>
              </li>
            </ul>
          </template>
        </li>
      </ul>

      <button
        type="button"
        class="barra__apri"
        aria-label="Apri il menu"
        :aria-expanded="cassettoAperto ? 'true' : 'false'"
        @click="cassettoAperto = true"
      >
        <i class="fas fa-bars" aria-hidden="true"></i>
      </button>

      <BaseCassetto :aperto="cassettoAperto" etichetta="Menu principale" @chiudi="chiudi">
        <ul class="menu">
          <li
            v-for="(item, index) in navbarItems"
            :key="index"
            :class="['menu__voce', { 'menu__voce--altrove': portaFuori(item) }]"
          >
            <template v-if="item.type === 'link'">
              <a
                v-if="item.external"
                target="_blank"
                rel="noopener noreferrer"
                :href="item.to"
                class="menu__link"
                @click="chiudi"
              >
                {{ item.title }}
                <span class="fuori" aria-hidden="true">↗</span>
                <span class="sr-only">(si apre in una nuova scheda)</span>
              </a>
              <router-link v-else class="menu__link" :to="item.to" @click="chiudi">
                {{ item.title }}
              </router-link>
            </template>

            <template v-else-if="item.type === 'dropdown'">
              <!-- Dentro un cassetto che si legge dall'alto in basso,
                   aprire in verticale e' piu' naturale che far spuntare
                   un riquadro. -->
              <button
                type="button"
                class="menu__link menu__link--gruppo"
                :aria-expanded="gruppoCassetto === index ? 'true' : 'false'"
                @click="gruppoCassetto = gruppoCassetto === index ? null : index"
              >
                {{ item.title }}
                <span
                  class="menu__freccia"
                  :class="{ 'menu__freccia--su': gruppoCassetto === index }"
                  aria-hidden="true"
                >⌄</span>
              </button>
              <ul v-show="gruppoCassetto === index" class="menu__sottoelenco">
                <li v-for="(sotto, idx) in item.links" :key="idx">
                  <a
                    v-if="sotto.external"
                    target="_blank"
                    rel="noopener noreferrer"
                    :href="sotto.to"
                    class="menu__link menu__link--sotto"
                    @click="chiudi"
                  >
                    {{ sotto.title }}
                    <span class="fuori" aria-hidden="true">↗</span>
                    <span class="sr-only">(si apre in una nuova scheda)</span>
                  </a>
                  <router-link
                    v-else
                    class="menu__link menu__link--sotto"
                    :to="sotto.to"
                    @click="chiudi"
                  >{{ sotto.title }}</router-link>
                </li>
              </ul>
            </template>
          </li>
        </ul>
      </BaseCassetto>
    </div>
  </nav>
</template>

<script>
import { usaPagina } from '@/store/pagina.mjs';
import BaseCassetto from '@/components/ui/BaseCassetto.vue';

// Sotto questa larghezza le voci non ci stanno in riga e passano nel
// cassetto. E' la stessa soglia che usava navbar-expand-lg.
const SOGLIA_CASSETTO = '(max-width: 991.98px)';

export default {
  name: "MdvNavbar",
  components: { BaseCassetto },
  setup() {
    return { pagina: usaPagina() };
  },
  data() {
    return {
      scrollPosition: null,
      cassettoAperto: false,
      apertoIndice: null,
      gruppoCassetto: null,
    }
  },
  computed: {
    navbarItems() {
      return this.pagina.navbar;
    }
  },
  // Niente watch su $route: la navbar spariva e riappariva a ogni
  // navigazione, ed e' quello a far sembrare che si ricarichi tutto.
  // Sta ferma, cambia solo il contenuto sotto.
  created() {
    window.addEventListener('scroll', this.updateScroll);
    window.addEventListener('keydown', this.chiudiConEsc);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.updateScroll);
    window.removeEventListener('keydown', this.chiudiConEsc);
  },
  methods: {
    updateScroll() {
      this.scrollPosition = window.scrollY;
    },
    // Un gruppo che contiene solo destinazioni fuori dal sito: si
    // riconosce da cosa c'e' dentro, non dalla posizione, cosi' resta
    // vero anche se domani l'ordine delle voci cambia.
    portaFuori(item) {
      return item.type === 'dropdown' && item.links.every((s) => s.external);
    },
    // Il passaggio del mouse apre il gruppo solo dove un mouse c'e'
    // davvero: sul tocco resterebbe aperto dopo il tocco.
    apriGruppo(item, index) {
      if (item.type !== 'dropdown') return;
      if (!window.matchMedia('(hover: hover)').matches) return;
      if (window.matchMedia(SOGLIA_CASSETTO).matches) return;
      this.apertoIndice = index;
    },
    chiudiConEsc(evento) {
      if (evento.key === 'Escape') this.apertoIndice = null;
    },
    chiudi() {
      this.cassettoAperto = false;
      this.gruppoCassetto = null;
    },
  },
}
</script>

<style scoped>
.barra {
  position: fixed;
  isolation: isolate;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
  height: var(--mdv-altezza-navbar);
  display: flex;
  align-items: center;
  font-family: var(--mdv-font-navigazione);
  background: transparent;
  transition:
    height 400ms var(--mdv-curva-morbida),
    background var(--mdv-transito-atmosfera) ease,
    box-shadow 400ms ease;
}
/* Finche' la barra e' trasparente sta sopra una fotografia, e le
   fotografie non sono tutte scure: sopra un edificio bianco il testo
   sabbia sparisce. Un velo sfumato scende dal bordo alto e si esaurisce
   poco sotto la barra — si vede il testo, non si vede il velo.
   Quando la barra si tinge il velo non serve piu' e si spegne, se no i
   due scuri si sommano. */
.barra::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  top: 0;
  z-index: -1;
  height: calc(var(--mdv-altezza-navbar) * 2.2);
  /* Tre fermate invece di due: pieno sotto la barra, ancora percepibile a
     meta', spento in fondo. Con una sfumatura lineare secca il velo si
     alleggerisce troppo presto, proprio all'altezza del testo. */
  background: linear-gradient(
    180deg,
    var(--mdv-velo-alto) 0%,
    var(--mdv-velo-alto) 38%,
    var(--mdv-velo-alto-coda) 62%,
    transparent 100%
  );
  pointer-events: none;
  transition: opacity 400ms ease;
}
.barra--tinta::before {
  opacity: 0;
}

.barra--tinta {
  height: var(--mdv-altezza-navbar-compatta);
  background: var(--mdv-bruno-900-velato);
  box-shadow: 0 0.5rem 1.5rem var(--mdv-ombra-lieve);
}
.barra__contenuto {
  width: 100%;
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: var(--mdv-spazio-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--mdv-spazio-4);
}

/* Il logo era un'immagine da 60x73 disegnata a grandezza naturale: su uno
   schermo a densita' doppia — cioe' su qualunque schermo di oggi — veniva
   ingrandita e si vedeva sfocata. Stessa grandezza a video, ma presa dal
   file grande che era gia' in cartella. */
.barra__logo {
  height: 4.5rem;
  width: auto;
  display: block;
  transition: height 400ms var(--mdv-curva-morbida);
}
/* Il marchio si stringe con la barra: restando grande la schiaccerebbe. */
.barra--tinta .barra__logo {
  height: 3rem;
}

/* ── Voci in riga, da schermo largo ──────────────────────────────────── */
.barra__voci {
  display: none;
  list-style: none;
  padding: 0;
  margin: 0 0 0 auto;
  gap: var(--mdv-spazio-5);
}
.barra__voce {
  position: relative;
}
/* Un filo prima del gruppo che porta altrove: la barra dice a colpo
   d'occhio dove finisce il sito e dove comincia il resto. Le frecce ↗
   lo dicono voce per voce, questo lo dice tutto insieme. */
.barra__voce--altrove {
  padding-left: clamp(var(--mdv-spazio-3), 2.4vw, var(--mdv-spazio-5));
  margin-left: calc(clamp(var(--mdv-spazio-3), 2.4vw, var(--mdv-spazio-5)) * -0.5);
}
.barra__voce--altrove::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 1px;
  height: 1.4rem;
  transform: translateY(-50%);
  background-color: color-mix(in srgb, var(--mdv-sabbia) 70%, transparent);
}
.barra__link {
  display: inline-flex;
  align-items: center;
  gap: var(--mdv-spazio-2);
  padding: var(--mdv-spazio-2) 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 0.95rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--mdv-sabbia-chiara);
  cursor: pointer;
  position: relative;
}
.barra__link::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 2px;
  background-color: var(--mdv-sabbia);
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}
.barra__link.router-link-active::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
.barra__link:focus-visible {
  outline: 2px solid var(--mdv-sabbia);
  outline-offset: 3px;
}

/* Era un riquadro scuro appoggiato al bordo, senza forma e senza stacco:
   sembrava un pezzo di barra caduto giu'. Ora e' una scheda, con un
   respiro sopra e un'ombra che la stacca dalla pagina. */
.barra__pannello {
  position: absolute;
  top: calc(100% + var(--mdv-spazio-2));
  right: 0;
  min-width: 15rem;
  list-style: none;
  padding: var(--mdv-spazio-2);
  margin: 0;
  border: 1px solid color-mix(in srgb, var(--mdv-sabbia) 30%, transparent);
  border-radius: var(--mdv-raggio-m);
  background: var(--mdv-bruno-900-velato);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  box-shadow: 0 1rem 2.5rem var(--mdv-ombra-media);
  animation: pannello-entra 240ms var(--mdv-curva-morbida) both;
}
/* Una linguetta che lega il pannello alla voce da cui esce. */
.barra__pannello::before {
  content: '';
  position: absolute;
  top: calc(var(--mdv-spazio-2) * -1);
  right: 0;
  left: 0;
  height: var(--mdv-spazio-2);
}
@keyframes pannello-entra {
  from { opacity: 0; transform: translateY(-0.4rem); }
  to   { opacity: 1; transform: none; }
}

/* Stessa forma delle voci della barra: maiuscolo e stessa spaziatura.
   Non e' solo uniformita' — i titoli nei dati sono scritti in modo
   incoerente ("blog", "Laici", "Via del Vangelo", "canale youtube"), e in
   sei lingue. Il maiuscolo li pareggia tutti. La regola "capitalize" del
   CSS no: alza la prima lettera di ogni parola, e in italiano
   produrrebbe "Via Del Vangelo". */
.barra__sottolink {
  display: flex;
  align-items: center;
  gap: var(--mdv-spazio-2);
  padding: var(--mdv-spazio-3);
  border-radius: var(--mdv-raggio-s);
  font-size: var(--mdv-testo-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--mdv-sabbia-chiara);
  white-space: nowrap;
  transition: background-color 200ms ease, color 200ms ease;
}

/* Il segno di uscita: dice che quel link porta via dal sito, e con lui
   la nota che i lettori di schermo annunciano. */
.fuori {
  font-size: 0.75em;
  opacity: 0.55;
  transition: opacity 200ms ease, transform 200ms ease;
}
.barra__sottolink:focus-visible {
  outline: 2px solid var(--mdv-sabbia);
  outline-offset: -2px;
}

/* ── Pulsante del cassetto, fino a schermo largo ─────────────────────── */
.barra__apri {
  border: none;
  background: none;
  cursor: pointer;
  line-height: 0;
}
.barra__apri > i {
  color: var(--mdv-sabbia);
  font-size: 2rem;
}
.barra__apri:focus-visible {
  outline: 2px solid var(--mdv-sabbia);
  outline-offset: 2px;
}

@media (min-width: 992px) {
  .barra__voci {
    display: flex;
  }
  .barra__apri {
    display: none;
  }
}

@media (hover: hover) {
  .barra__sottolink:hover {
    color: var(--mdv-bianco);
    background-color: color-mix(in srgb, var(--mdv-sabbia) 18%, transparent);
  }
  .barra__link:hover .fuori,
  .barra__sottolink:hover .fuori,
  .menu__link:hover .fuori {
    opacity: 1;
    transform: translate(1px, -1px);
  }
}

/* Il menu del cassetto e' teletrasportato sul body: gli stili con ambito
   non lo raggiungerebbero, quindi passano da :deep. */
:deep(.menu) {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--mdv-spazio-1);
}
:deep(.menu__link) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--mdv-spazio-3);
  width: 100%;
  padding: var(--mdv-spazio-3) 0;
  border: none;
  background: none;
  font-family: var(--mdv-font-navigazione);
  font-size: var(--mdv-testo-m);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: left;
  text-decoration: none;
  color: var(--mdv-sabbia-chiara);
  cursor: pointer;
  transition: color 0.25s ease, padding-left 0.25s var(--mdv-curva-morbida);
}
:deep(.menu__link:focus-visible) {
  outline: 2px solid var(--mdv-sabbia);
  outline-offset: 2px;
}
:deep(.menu__voce + .menu__voce) {
  border-top: 1px solid var(--mdv-bruno-700);
}
/* Nel cassetto il confine e' uno stacco piu' largo e un filo d'oro:
   sotto ci sono i posti fuori dal sito. */
:deep(.menu__voce--altrove) {
  margin-top: var(--mdv-spazio-4);
  padding-top: var(--mdv-spazio-2);
  border-top: 1px solid var(--mdv-oro-scuro) !important;
}
:deep(.menu__freccia) {
  transition: transform 0.3s var(--mdv-curva-morbida);
}
:deep(.menu__freccia--su) {
  transform: rotate(180deg);
}
:deep(.menu__sottoelenco) {
  list-style: none;
  padding: 0 0 var(--mdv-spazio-2) var(--mdv-spazio-4);
  margin: 0;
}
:deep(.menu__link--sotto) {
  font-size: 0.92rem;
  text-transform: none;
  letter-spacing: 0.03em;
  padding: var(--mdv-spazio-2) 0;
}

@media (hover: hover) {
  :deep(.menu__link:hover) {
    color: var(--mdv-bianco);
    padding-left: var(--mdv-spazio-2);
  }
}
</style>
