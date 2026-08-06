<template>
  <teleport to="body">
    <transition name="velo">
      <div v-if="aperto" class="cassetto__velo" @click="$emit('chiudi')"></div>
    </transition>

    <transition name="cassetto">
      <aside
        v-if="aperto"
        ref="pannello"
        class="cassetto"
        role="dialog"
        aria-modal="true"
        :aria-label="etichetta"
        tabindex="-1"
      >
        <div class="cassetto__testa">
          <button type="button" class="cassetto__chiudi" aria-label="Chiudi" @click="$emit('chiudi')">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="cassetto__corpo">
          <slot />
        </div>
      </aside>
    </transition>
  </teleport>
</template>

<script>
// Cassetto laterale al posto dell'offcanvas di Bootstrap, che aveva
// bisogno del suo JavaScript. Le meccaniche sono le stesse gia' scritte
// per VocModale — fuoco che non esce, Escape, pagina che non scorre
// dietro — perche' sono le stesse che servono a qualunque cosa si apra
// sopra la pagina.
//
// Sta in <teleport> sul body: dentro la navbar sarebbe figlio di un
// elemento fisso e trasformato, e un elemento fisso dentro un antenato
// trasformato smette di essere fisso rispetto alla finestra.
const FUOCABILI = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default {
  name: 'BaseCassetto',
  props: {
    aperto: { type: Boolean, default: false },
    etichetta: { type: String, default: 'Menu' },
  },
  emits: ['chiudi'],
  watch: {
    aperto(ora) {
      document.body.style.overflow = ora ? 'hidden' : '';
      if (ora) this.$nextTick(() => this.$refs.pannello && this.$refs.pannello.focus());
    },
  },
  mounted() {
    window.addEventListener('keydown', this.daTastiera);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.daTastiera);
    // Smontarsi da aperto lascerebbe la pagina bloccata per sempre.
    document.body.style.overflow = '';
  },
  methods: {
    daTastiera(evento) {
      if (!this.aperto) return;
      if (evento.key === 'Escape') {
        this.$emit('chiudi');
        return;
      }
      if (evento.key !== 'Tab') return;

      const pannello = this.$refs.pannello;
      if (!pannello) return;
      const dentro = pannello.querySelectorAll(FUOCABILI);
      if (!dentro.length) return;

      const primo = dentro[0];
      const ultimo = dentro[dentro.length - 1];
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
.cassetto__velo {
  position: fixed;
  inset: 0;
  z-index: 1040;
  background-color: var(--mdv-velo-scuro);
}

/* Si apre dal lato del bottone che lo chiama. Prima il bottone stava a
   destra e il cassetto entrava da sinistra: il pollice attraversava lo
   schermo per raggiungere quello che aveva appena aperto. */
.cassetto {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1045;
  display: flex;
  flex-direction: column;
  width: min(22rem, 85vw);
  background-color: var(--mdv-bruno-900-velato);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
.cassetto:focus {
  outline: none;
}

/* La chiusura sta dove stava il bottone che ha aperto: si tocca due
   volte nello stesso punto. */
.cassetto__testa {
  display: flex;
  justify-content: flex-end;
  padding: var(--mdv-spazio-3);
}
.cassetto__chiudi {
  width: 2.75rem;
  height: 2.75rem;
  border: none;
  background: none;
  font-size: 2rem;
  line-height: 1;
  color: var(--mdv-sabbia);
  cursor: pointer;
  transition: color 0.25s ease, transform 0.3s var(--mdv-curva-morbida);
}
.cassetto__chiudi:focus-visible {
  outline: 2px solid var(--mdv-sabbia);
  outline-offset: 2px;
}

.cassetto__corpo {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: var(--mdv-spazio-3) var(--mdv-spazio-5) var(--mdv-spazio-6);
}

.cassetto-enter-active,
.cassetto-leave-active {
  transition: transform var(--mdv-entrata-pagina) var(--mdv-curva-morbida);
}
.cassetto-enter-from,
.cassetto-leave-to {
  transform: translateX(100%);
}

.velo-enter-active,
.velo-leave-active {
  transition: opacity var(--mdv-entrata-pagina) var(--mdv-curva-morbida);
}
.velo-enter-from,
.velo-leave-to {
  opacity: 0;
}

@media (hover: hover) {
  .cassetto__chiudi:hover {
    color: var(--mdv-pietra);
    transform: rotate(90deg);
  }
}
</style>
