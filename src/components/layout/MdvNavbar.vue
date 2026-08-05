<template>
  <nav class="navbar fixed-top navbar-expand-lg entra-velata" :class="{changeColor: scrollPosition > 50}">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'chi-siamo' }">
        <img src="../../assets/logo.png" alt="Missionari della Via" class="logo-navbar"/>
      </router-link>

      <button
        type="button"
        class="navbar-toggler"
        aria-label="Apri il menu"
        :aria-expanded="cassettoAperto ? 'true' : 'false'"
        @click="cassettoAperto = true"
      >
        <i class="fas fa-bars" aria-hidden="true"></i>
      </button>

      <BaseCassetto :aperto="cassettoAperto" etichetta="Menu principale" @chiudi="chiudi">
        <ul class="menu">
          <li v-for="(item, index) in navbarItems" :key="index" class="menu__voce">
            <template v-if="item.type === 'link'">
              <a
                v-if="item.external"
                target="_blank"
                rel="noopener noreferrer"
                :href="item.to"
                class="menu__link"
                @click="chiudi"
              >{{ item.title }}</a>
              <router-link v-else class="menu__link" :to="item.to" @click="chiudi">
                {{ item.title }}
              </router-link>
            </template>

            <template v-else-if="item.type === 'dropdown'">
              <!-- Il pannello a comparsa era un dropdown di Bootstrap.
                   Qui e' un bottone che apre un elenco: dentro un cassetto
                   che si legge dall'alto in basso, aprire in verticale e'
                   anche piu' naturale che far spuntare un riquadro. -->
              <button
                type="button"
                class="menu__link menu__link--gruppo"
                :aria-expanded="apertoIndice === index ? 'true' : 'false'"
                @click="apertoIndice = apertoIndice === index ? null : index"
              >
                {{ item.title }}
                <span class="menu__freccia" :class="{ 'menu__freccia--su': apertoIndice === index }" aria-hidden="true">⌄</span>
              </button>
              <ul v-show="apertoIndice === index" class="menu__sottoelenco">
                <li v-for="(sotto, idx) in item.links" :key="idx">
                  <a
                    v-if="sotto.external"
                    target="_blank"
                    rel="noopener noreferrer"
                    :href="sotto.to"
                    class="menu__link menu__link--sotto"
                    @click="chiudi"
                  >{{ sotto.title }}</a>
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
  created () {
    window.addEventListener('scroll', this.updateScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.updateScroll);
  },
  methods: {
    updateScroll() {
      this.scrollPosition = window.scrollY
    },
    chiudi() {
      this.cassettoAperto = false;
      this.apertoIndice = null;
    },
  },
}
</script>

<style scoped>
nav {
  font-family: var(--mdv-font-navigazione);
}

/* Il logo era un'immagine da 60x73 disegnata a grandezza naturale: su uno
   schermo a densita' doppia — cioe' su qualunque schermo di oggi — veniva
   ingrandita e si vedeva sfocata. Stessa grandezza a video, ma presa dal
   file grande che era gia' in cartella: 313 pixel di sorgente per 72 a
   video reggono anche gli schermi a densita' tripla. */
.logo-navbar {
  height: 4.5rem;
  width: auto;
  max-width: 100%;
}

.navbar {
  height: var(--mdv-altezza-navbar);
  background: transparent;
  transition: background .4s ease-in-out;
}
.changeColor {
  background: var(--mdv-bruno-900-velato);
}

.navbar-toggler {
  border: none;
  border-radius: 0;
  background: none;
  cursor: pointer;
}
.navbar-toggler > i {
  color: var(--mdv-sabbia);
  font-size: 2rem;
}
.navbar-toggler:focus-visible {
  outline: 2px solid var(--mdv-sabbia);
  outline-offset: 2px;
}

/* Il menu vive dentro il cassetto, che è teletrasportato sul body: gli
   stili con ambito non lo raggiungerebbero, quindi passano da :deep. */
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
  font-size: 1.05rem;
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
