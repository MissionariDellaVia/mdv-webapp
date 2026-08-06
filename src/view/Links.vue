<template>
  <section class="pagina relative min-h-screen overflow-x-hidden px-4 py-12 font-navigazione">
    <div class="sfondo fixed inset-0 -z-10"></div>

    <div class="mx-auto w-full max-w-lg">
      <header class="apparizione mb-12 text-center">
        <img
          src="../assets/standalone.png"
          alt="Missionari della Via"
          class="logo mx-auto mb-6 w-30"
        />
        <h1 class="mb-2 font-corpo text-4xl font-semibold text-sabbia-chiara">
          Missionari della Via
        </h1>
        <p class="m-0 text-lg italic tracking-wide text-sabbia">
          Tutti i nostri collegamenti
        </p>
      </header>

      <!-- Le nove voci erano nove blocchi identici copiati a mano, con il
           ritardo dell'animazione scritto dentro l'attributo style. Ora
           sono dati: aggiungerne una e' una riga. -->
      <nav class="flex flex-col gap-4" aria-label="Collegamenti">
        <a
          v-for="(voce, i) in collegamenti"
          :key="voce.href"
          :href="voce.href"
          target="_blank"
          rel="noopener noreferrer"
          class="voce relative flex items-center overflow-hidden rounded-full border-2 px-6 py-5 text-panna no-underline"
          :style="{ animationDelay: `${0.1 + i * 0.05}s` }"
        >
          <span :class="['icona', voce.marchio && `icona--${voce.marchio}`]">
            <i :class="voce.icona" aria-hidden="true"></i>
          </span>
          <span class="flex-1 text-base font-medium">{{ voce.titolo }}</span>
          <span class="freccia text-sm opacity-60">
            <i class="fas fa-external-link-alt" aria-hidden="true"></i>
          </span>
        </a>
      </nav>
    </div>
  </section>
</template>

<script>
const COLLEGAMENTI = [
  { titolo: 'Sito Ufficiale', href: 'https://www.missionaridellavia.net/#/', icona: 'fas fa-home' },
  { titolo: 'Blog dei Piccoli della Via', href: 'https://blogdeipiccolidellavia.blogspot.com/', icona: 'fas fa-blog' },
  { titolo: 'Facebook - Consacrati', href: 'https://www.facebook.com/profile.php?id=100068706078801', icona: 'fab fa-facebook-f', marchio: 'facebook' },
  { titolo: 'Instagram', href: 'https://www.instagram.com/missionaridellavia/', icona: 'fab fa-instagram', marchio: 'instagram' },
  { titolo: 'Via del Vangelo', href: 'https://missionaridellavia.github.io/mdv-gospel-way-app/#/', icona: 'fas fa-book-open' },
  { titolo: 'Canale YouTube', href: 'https://www.youtube.com/@MdV-missionaridellavia', icona: 'fab fa-youtube', marchio: 'youtube' },
  { titolo: 'Sito Vocazionale', href: 'https://www.vocazione.altervista.org/#/', icona: 'fas fa-church' },
  { titolo: 'Cristiani di Strada', href: 'https://www.cristianidistrada.net/', icona: 'fas fa-praying-hands' },
  { titolo: 'Facebook - Laici', href: 'https://www.facebook.com/comunitamissionaria.dellavia', icona: 'fab fa-facebook-f', marchio: 'facebook' },
];

export default {
  name: 'LinksPage',
  data() {
    return { collegamenti: COLLEGAMENTI };
  },
};
</script>

<style scoped>
/* Impaginazione e tipografia stanno nelle utility, qui sopra. Qui resta
   quello che le utility non sanno dire: i gradienti, la luce che
   attraversa la voce al passaggio, i colori dei marchi. */
.pagina {
  min-height: -webkit-fill-available;
  background: var(--mdv-bruno-900);
}

.sfondo {
  background: linear-gradient(135deg, var(--mdv-bruno-900) 0%, var(--mdv-bruno-600) 100%);
}
.sfondo::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 20% 50%, color-mix(in srgb, var(--mdv-sabbia) 10%, transparent) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, color-mix(in srgb, var(--mdv-sabbia-chiara) 10%, transparent) 0%, transparent 50%);
}

.logo {
  transition: transform 0.3s ease;
}

.voce {
  background: color-mix(in srgb, var(--mdv-bianco) 8%, transparent);
  border-color: color-mix(in srgb, var(--mdv-sabbia) 25%, transparent);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  opacity: 0;
  animation: scivola 0.6s ease-out forwards;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
/* Luce che attraversa la voce da sinistra a destra. */
.voce::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 -100%;
  width: 100%;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--mdv-sabbia) 20%, transparent), transparent);
  transition: left 0.5s ease;
}
.voce:active {
  transform: translateY(-1px) scale(0.98);
}
.voce:focus-visible {
  outline: 2px solid var(--mdv-sabbia-chiara);
  outline-offset: 3px;
}

.icona {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.8rem;
  height: 2.8rem;
  margin-right: var(--mdv-spazio-4);
  border-radius: 50%;
  font-size: 1.3rem;
  color: var(--mdv-sabbia-chiara);
  background: color-mix(in srgb, var(--mdv-sabbia) 25%, transparent);
  transition: all 0.3s ease;
}
.icona--facebook {
  background: color-mix(in srgb, var(--mdv-social-facebook) 20%, transparent);
  color: var(--mdv-social-facebook);
}
.icona--instagram {
  background: color-mix(in srgb, var(--mdv-social-instagram) 20%, transparent);
  color: var(--mdv-social-instagram);
}
.icona--youtube {
  background: color-mix(in srgb, var(--mdv-social-youtube) 20%, transparent);
  color: var(--mdv-social-youtube);
}

.freccia {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

@keyframes scivola {
  from { opacity: 0; transform: translateX(-30px); }
  to   { opacity: 1; transform: none; }
}
@keyframes comparsa {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: none; }
}
.apparizione {
  animation: comparsa 0.8s ease-out;
}

@media (hover: hover) {
  .logo:hover {
    transform: scale(1.05);
  }
  .voce:hover {
    background: color-mix(in srgb, var(--mdv-sabbia) 15%, transparent);
    border-color: var(--mdv-sabbia-chiara);
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 25px color-mix(in srgb, var(--mdv-sabbia) 40%, transparent);
  }
  .voce:hover::before {
    left: 100%;
  }
  .voce:hover .icona {
    transform: rotate(360deg);
    background: color-mix(in srgb, var(--mdv-sabbia-chiara) 40%, transparent);
  }
  .voce:hover .freccia {
    opacity: 1;
    transform: translateX(3px);
  }
}
</style>
