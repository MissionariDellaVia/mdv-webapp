<template>
  <teleport to="body">
    <transition name="ingrandimento">
      <div
        v-if="show"
        class="ingrandimento"
        role="dialog"
        aria-modal="true"
        aria-label="Immagine ingrandita"
        @click.self="tryClose"
      >
        <img :src="helper.getImgUrl(imageLink)" alt="" class="ingrandimento__foto" />

        <button
          v-if="!fixed"
          type="button"
          class="ingrandimento__chiudi"
          aria-label="Chiudi"
          @click="tryClose"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'ImageDialog',
  props: {
    show: { type: Boolean, required: true },
    fixed: { type: Boolean, required: false, default: false },
    imageLink: { type: String, required: true },
  },
  emits: ['close'],
  data() {
    return { helper: this.$util };
  },
  watch: {
    show(ora) {
      document.body.style.overflow = ora ? 'hidden' : '';
    },
  },
  mounted() {
    window.addEventListener('keydown', this.chiudiConEsc);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.chiudiConEsc);
    document.body.style.overflow = '';
  },
  methods: {
    chiudiConEsc(evento) {
      if (evento.key === 'Escape') this.tryClose();
    },
    tryClose() {
      if (this.fixed) return;
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
/* Il riquadro era ancorato a 20vh dall'alto con l'immagine larga 100vw:
   una foto alta usciva dallo schermo verso il basso e non c'era modo di
   vederla tutta. Ora l'immagine sta al centro e non supera mai lo
   schermo — si rimpicciolisce lei. */
.ingrandimento {
  position: fixed;
  inset: 0;
  z-index: 2100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--mdv-spazio-5);
  background-color: var(--mdv-velo-scuro);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

.ingrandimento__foto {
  max-width: min(92vw, 64rem);
  max-height: 88vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: var(--mdv-raggio-s);
  box-shadow: 0 1rem 3rem var(--mdv-ombra-media);
}

.ingrandimento__chiudi {
  position: absolute;
  top: var(--mdv-spazio-4);
  right: var(--mdv-spazio-4);
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--mdv-sabbia);
  border-radius: 50%;
  background: none;
  font-size: 1.6rem;
  line-height: 1;
  color: var(--mdv-sabbia-chiara);
  cursor: pointer;
  transition: color 0.25s ease, border-color 0.25s ease, transform 0.3s var(--mdv-curva-morbida);
}
.ingrandimento__chiudi:focus-visible {
  outline: 2px solid var(--mdv-sabbia);
  outline-offset: 2px;
}

.ingrandimento-enter-active,
.ingrandimento-leave-active {
  transition: opacity var(--mdv-uscita-pagina) var(--mdv-curva-morbida);
}
.ingrandimento-enter-active .ingrandimento__foto,
.ingrandimento-leave-active .ingrandimento__foto {
  transition: transform var(--mdv-entrata-pagina) var(--mdv-curva-morbida);
}
.ingrandimento-enter-from,
.ingrandimento-leave-to {
  opacity: 0;
}
.ingrandimento-enter-from .ingrandimento__foto,
.ingrandimento-leave-to .ingrandimento__foto {
  transform: scale(0.94);
}

@media (hover: hover) {
  .ingrandimento__chiudi:hover {
    color: var(--mdv-bianco);
    border-color: var(--mdv-sabbia-chiara);
    transform: rotate(90deg);
  }
}
</style>
