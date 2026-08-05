<template>
  <transition name="modale">
    <div
      v-if="aperta"
      class="voc-modale"
      role="dialog"
      aria-modal="true"
      :aria-label="titolo"
      @click.self="$emit('chiudi')"
    >
      <div ref="riquadro" class="voc-modale__riquadro" tabindex="-1">
        <!-- L'intestazione resta ferma mentre il testo scorre: si sa
             sempre chi sta parlando e la chiusura e' sempre a portata. -->
        <header class="voc-modale__testa">
          <div class="voc-modale__identita">
            <slot name="ritratto" />
            <div>
              <p v-if="occhiello" class="voc-modale__occhiello">{{ occhiello }}</p>
              <h2 class="voc-modale__titolo">{{ titolo }}</h2>
            </div>
          </div>

          <button
            type="button"
            class="voc-modale__chiudi"
            aria-label="Chiudi"
            @click="$emit('chiudi')"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div class="voc-modale__corpo">
          <slot />
        </div>

        <footer v-if="$slots.piede" class="voc-modale__piede">
          <slot name="piede" />
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'VocModale',
  props: {
    aperta: { type: Boolean, default: false },
    titolo: { type: String, default: '' },
    occhiello: { type: String, default: '' },
  },
  emits: ['chiudi'],
  watch: {
    aperta(ora) {
      // Con la modale aperta, scorrere muoveva la pagina dietro.
      document.body.style.overflow = ora ? 'hidden' : '';
      if (ora) this.$nextTick(() => this.$refs.riquadro && this.$refs.riquadro.focus());
    },
  },
  mounted() {
    window.addEventListener('keydown', this.daTastiera);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.daTastiera);
    // Smontarsi da aperta lascerebbe la pagina bloccata per sempre.
    document.body.style.overflow = '';
  },
  methods: {
    daTastiera(evento) {
      if (!this.aperta) return;
      if (evento.key === 'Escape') this.$emit('chiudi');
      // Il fuoco non deve poter uscire dalla modale: senza questo, il
      // tabulatore andrebbe a finire sui link della pagina dietro.
      if (evento.key !== 'Tab') return;
      const riquadro = this.$refs.riquadro;
      if (!riquadro) return;
      const fuocabili = riquadro.querySelectorAll(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!fuocabili.length) return;
      const primo = fuocabili[0];
      const ultimo = fuocabili[fuocabili.length - 1];
      if (evento.shiftKey && document.activeElement === primo) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primo.focus();
      }
    },
  },
};
</script>

<style scoped>
.voc-modale {
  position: fixed;
  inset: 0;
  z-index: 2100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--mdv-spazio-4);
  background-color: var(--mdv-velo-scuro);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.voc-modale__riquadro {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 46rem;
  max-height: 88vh;
  border: 1px solid var(--mdv-sabbia);
  border-radius: var(--mdv-raggio-l);
  background-color: var(--voc-fondo-alto);
  box-shadow: 0 2rem 4rem var(--mdv-ombra-media);
  overflow: hidden;
}
.voc-modale__riquadro:focus {
  outline: none;
}

.voc-modale__testa {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--mdv-spazio-4);
  padding: var(--mdv-spazio-5) var(--mdv-spazio-5) var(--mdv-spazio-4);
  border-bottom: 1px solid var(--mdv-sabbia);
  background-color: var(--voc-fondo-alto);
}
.voc-modale__identita {
  display: flex;
  align-items: center;
  gap: var(--mdv-spazio-4);
  min-width: 0;
}
.voc-modale__occhiello {
  margin: 0 0 var(--mdv-spazio-1) 0;
  font-family: var(--mdv-font-navigazione);
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--mdv-oro);
}
.voc-modale__titolo {
  margin: 0;
  font-family: var(--mdv-font-titolo);
  font-size: clamp(1.5rem, 3.4vw, 2.1rem);
  line-height: 1.2;
  color: var(--mdv-oro-chiaro);
}

.voc-modale__chiudi {
  flex: 0 0 auto;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--mdv-sabbia);
  border-radius: 50%;
  background: none;
  font-size: 1.6rem;
  line-height: 1;
  color: var(--mdv-oro);
  cursor: pointer;
  transition: border-color 0.3s ease, color 0.3s ease, transform 0.3s var(--mdv-curva-morbida);
}
.voc-modale__chiudi:hover {
  border-color: var(--mdv-oro);
  color: var(--mdv-oro-chiaro);
  transform: rotate(90deg);
}

.voc-modale__corpo {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: var(--mdv-spazio-5);
  scrollbar-width: thin;
}
.voc-modale__corpo :deep(p) {
  font-family: var(--mdv-font-corpo);
  font-size: 1.05rem;
  line-height: 1.9;
  margin-bottom: var(--mdv-spazio-4);
}
.voc-modale__corpo :deep(blockquote) {
  border-left: 2px solid var(--mdv-oro-scuro);
  padding-left: var(--mdv-spazio-4);
  font-style: italic;
  color: var(--mdv-oro-scuro);
}

.voc-modale__piede {
  flex: 0 0 auto;
  padding: var(--mdv-spazio-3) var(--mdv-spazio-5);
  border-top: 1px solid var(--mdv-sabbia);
}

.modale-enter-active,
.modale-leave-active {
  transition: opacity var(--mdv-uscita-pagina) var(--mdv-curva-morbida);
}
.modale-enter-active .voc-modale__riquadro,
.modale-leave-active .voc-modale__riquadro {
  transition: transform var(--mdv-entrata-pagina) var(--mdv-curva-morbida);
}
.modale-enter-from,
.modale-leave-to {
  opacity: 0;
}
.modale-enter-from .voc-modale__riquadro,
.modale-leave-to .voc-modale__riquadro {
  transform: translateY(1.5rem) scale(0.98);
}

@media (max-width: 576px) {
  .voc-modale {
    padding: 0;
  }
  .voc-modale__riquadro {
    max-height: 100vh;
    height: 100%;
    border: none;
    border-radius: 0;
  }
}
</style>
