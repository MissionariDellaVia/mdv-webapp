<template>
  <div class="schede">
    <div class="schede__linguette" role="tablist" :aria-label="etichetta">
      <button
        v-for="(voce, i) in voci"
        :key="voce.chiave"
        :ref="(el) => (linguette[i] = el)"
        type="button"
        role="tab"
        :id="`linguetta-${identificativo}-${voce.chiave}`"
        :aria-controls="`pannello-${identificativo}-${voce.chiave}`"
        :aria-selected="i === attiva ? 'true' : 'false'"
        :tabindex="i === attiva ? 0 : -1"
        :class="['schede__linguetta', { 'schede__linguetta--attiva': i === attiva }]"
        @click="attiva = i"
        @keydown="daTastiera($event, i)"
      >{{ voce.titolo }}</button>
    </div>

    <div
      v-for="(voce, i) in voci"
      :key="voce.chiave"
      v-show="i === attiva"
      role="tabpanel"
      :id="`pannello-${identificativo}-${voce.chiave}`"
      :aria-labelledby="`linguetta-${identificativo}-${voce.chiave}`"
      :tabindex="0"
      class="schede__pannello"
    >
      <slot :voce="voce" :indice="i" />
    </div>
  </div>
</template>

<script>
// Linguette al posto dei "pill" di Bootstrap, che avevano bisogno del suo
// JavaScript. Il markup di prima dichiarava aria-controls="pills-home"
// identico su ogni linguetta: per un lettore di schermo puntavano tutte
// allo stesso pannello, e nessuna a quello giusto. Qui ognuna e' legata al
// suo, e le frecce spostano la selezione come previsto per questo comando.
let contatore = 0;

export default {
  name: 'BaseSchede',
  props: {
    // [{ chiave, titolo }]
    voci: { type: Array, required: true },
    etichetta: { type: String, default: 'Sezioni' },
  },
  data() {
    contatore += 1;
    return { attiva: 0, identificativo: contatore, linguette: [] };
  },
  watch: {
    // Cambiando lingua o dati, l'elenco puo' accorciarsi sotto i piedi.
    voci() {
      if (this.attiva >= this.voci.length) this.attiva = 0;
    },
  },
  methods: {
    daTastiera(evento, i) {
      const ultimo = this.voci.length - 1;
      const dove = {
        ArrowRight: i === ultimo ? 0 : i + 1,
        ArrowLeft: i === 0 ? ultimo : i - 1,
        Home: 0,
        End: ultimo,
      }[evento.key];
      if (dove === undefined) return;
      evento.preventDefault();
      this.attiva = dove;
      this.$nextTick(() => this.linguette[dove] && this.linguette[dove].focus());
    },
  },
};
</script>

<style scoped>
/* Erano blocchi bruni pieni, uno per riga, a tutta larghezza: pesavano
   quanto il contenuto che dovevano annunciare. Qui sono parole in fila su
   un filo, e la sola scelta accesa e' quella attiva. */
.schede__linguette {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--mdv-spazio-2) var(--mdv-spazio-5);
  border-bottom: 1px solid var(--mdv-sabbia);
  margin-bottom: var(--mdv-spazio-6);
}

.schede__linguetta {
  position: relative;
  padding: var(--mdv-spazio-3) var(--mdv-spazio-1);
  border: none;
  background: none;
  font-family: var(--mdv-font-navigazione);
  font-size: 0.95rem;
  letter-spacing: 0.06em;
  line-height: 1.4;
  color: var(--mdv-bruno-900);
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 260ms ease, color 260ms ease;
}
/* Il filo dell'attiva copre quello del contenitore: e' la stessa riga,
   accesa nel punto in cui ti trovi. */
.schede__linguetta::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  height: 2px;
  background-color: var(--mdv-oro);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 320ms var(--mdv-curva-morbida);
}
.schede__linguetta--attiva {
  opacity: 1;
  color: var(--mdv-oro);
}
.schede__linguetta--attiva::after {
  transform: scaleX(1);
}
.schede__linguetta:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: 2px;
}
.schede__pannello:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: 4px;
}

@media (hover: hover) {
  .schede__linguetta:hover {
    opacity: 1;
    color: var(--mdv-oro-scuro);
  }
}

@media (max-width: 576px) {
  .schede__linguette {
    gap: var(--mdv-spazio-1) var(--mdv-spazio-4);
  }
  .schede__linguetta {
    font-size: 0.88rem;
  }
}
</style>
