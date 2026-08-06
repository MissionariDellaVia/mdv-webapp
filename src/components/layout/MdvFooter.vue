<template>
  <footer class="pie entra-velata">
    <div class="mx-auto w-full max-w-6xl px-4 py-12">

      <div class="pie__lingue">
        <!-- Le bandiere erano una libreria da 259 paesi per le sei che
             servono. Ora sono sei file, e sono bottoni: prima erano
             <span>, quindi col tabulatore non si raggiungevano. -->
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

      <div class="pie__marchi">
        <div v-for="(voce, index) in footerList" :key="index" class="pie__marchio">
          <h2 class="pie__nome">{{ voce.title }}</h2>
          <a target="_blank" rel="noopener noreferrer" :href="voce.to">
            <img :src="helper.getImgUrl(voce.image)" :alt="voce.title" />
          </a>
        </div>
      </div>

      <ul class="pie__social">
        <li v-for="rete in social" :key="rete.nome">
          <a
            :href="rete.href"
            target="_blank"
            rel="noopener noreferrer"
            :title="rete.nome"
            :class="['pie__social-link', `pie__social-link--${rete.chiave}`]"
          >
            <i :class="rete.icona" aria-hidden="true"></i>
            <span class="sr-only">{{ rete.nome }}</span>
          </a>
        </li>
      </ul>

      <p class="pie__firma">
        &copy; Copyright 2022 - Missionari della Via. Tutti i diritti riservati.
      </p>
    </div>
  </footer>
</template>

<script>
import { usaPagina } from '@/store/pagina.mjs';
export default {
  name: "MdvFooter",
  setup() {
    return { pagina: usaPagina() };
  },
  data() {
    return {
      helper: this.$util,
      isLoading: false,
      social: [
        { chiave: 'facebook', nome: 'Facebook', icona: 'fa-brands fa-facebook-f',
          href: 'https://www.facebook.com/people/Missionari-e-Missionarie-della-Via/100068706078801/' },
        { chiave: 'instagram', nome: 'Instagram', icona: 'fa-brands fa-instagram',
          href: 'https://www.instagram.com/missionaridellavia/' },
        { chiave: 'youtube', nome: 'YouTube', icona: 'fa-brands fa-youtube',
          href: 'https://www.youtube.com/channel/UCI-KljGpZAOQlazH5vuRlfA' },
      ],
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
      return this.pagina.footer;
    },
    linguaCorrente() {
      return this.pagina.lingua;
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
        this.pagina.cambiaLingua(lang, this.currentRouteName);
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
.pie {
  background: var(--mdv-bruno-900-velato);
  box-shadow: inset 0 2px 13px 6px var(--mdv-bruno-900-velato);
  color: var(--mdv-bianco);
}

.pie__lingue {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--mdv-spazio-2);
}

.pie__marchi {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: var(--mdv-spazio-5);
  margin: var(--mdv-spazio-6) 0;
}
.pie__marchio {
  text-align: center;
  transition: transform 0.25s var(--mdv-curva-morbida);
}
.pie__nome {
  font-family: var(--mdv-font-navigazione);
  font-size: 1rem;
  margin-bottom: var(--mdv-spazio-3);
}
.pie__marchio img {
  max-width: 100%;
  height: auto;
  margin: auto;
}

.pie__social {
  display: flex;
  justify-content: center;
  gap: var(--mdv-spazio-3);
  list-style: none;
  padding: 0;
  margin: 0 0 var(--mdv-spazio-6);
}
.pie__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  font-size: 1.2rem;
  color: var(--mdv-bianco);
  background-color: var(--mdv-sabbia);
  transition: background-color 0.5s ease, transform 0.5s ease;
}
.pie__social-link:focus-visible {
  outline: 2px solid var(--mdv-sabbia-chiara);
  outline-offset: 3px;
}

.pie__firma {
  padding-top: var(--mdv-spazio-4);
  border-top: 1px solid var(--mdv-bianco);
  font-size: 0.8rem;
  text-align: center;
  margin: 0;
}

.bandiera {
  padding: var(--mdv-spazio-1);
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
  .pie__marchio:hover {
    transform: scale(1.06);
  }
  .pie__social-link:hover {
    transform: rotate(360deg);
  }
  .pie__social-link--facebook:hover {
    background-color: var(--mdv-social-facebook);
  }
  .pie__social-link--instagram:hover {
    background-color: var(--mdv-social-instagram);
  }
  .pie__social-link--youtube:hover {
    background-color: var(--mdv-social-youtube);
  }
}
</style>
