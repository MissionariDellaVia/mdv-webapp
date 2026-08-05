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
        <button
          type="button"
          class="voc-modale__chiudi"
          aria-label="Chiudi"
          @click="$emit('chiudi')"
        >×</button>

        <h2 class="voc-modale__titolo">{{ titolo }}</h2>
        <div class="voc-modale__corpo">
          <slot />
        </div>
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
    window.addEventListener('keydown', this.chiudiConEsc);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.chiudiConEsc);
    // Smontarsi da aperta lascerebbe la pagina bloccata per sempre.
    document.body.style.overflow = '';
  },
  methods: {
    chiudiConEsc(evento) {
      if (evento.key === 'Escape' && this.aperta) this.$emit('chiudi');
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
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}
.voc-modale__riquadro {
  position: relative;
  width: 100%;
  max-width: 44rem;
  max-height: 86vh;
  overflow-y: auto;
  padding: var(--mdv-spazio-6);
  background-color: var(--voc-fondo-alto);
  border: 1px solid var(--mdv-sabbia);
  border-radius: var(--mdv-raggio-m);
  box-shadow: 0 1.5rem 3rem var(--mdv-ombra-media);
}
.voc-modale__riquadro:focus {
  outline: none;
}
.voc-modale__chiudi {
  position: absolute;
  top: var(--mdv-spazio-3);
  right: var(--mdv-spazio-4);
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: var(--mdv-oro);
  cursor: pointer;
}
.voc-modale__titolo {
  font-family: var(--mdv-font-titolo);
  font-size: 2rem;
  color: var(--mdv-oro-chiaro);
  margin-bottom: var(--mdv-spazio-5);
  padding-right: var(--mdv-spazio-6);
}
.voc-modale__corpo :deep(p) {
  font-family: var(--mdv-font-corpo);
  font-size: 1.05rem;
  line-height: 1.9;
  margin-bottom: var(--mdv-spazio-4);
}
.voc-modale__corpo :deep(blockquote) {
  border-left: 2px solid var(--mdv-sabbia);
  padding-left: var(--mdv-spazio-4);
  font-style: italic;
  color: var(--mdv-oro-scuro);
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
  transform: scale(0.97);
}
</style>
