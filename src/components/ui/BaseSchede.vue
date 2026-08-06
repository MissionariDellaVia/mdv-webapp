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
/* Fasce piene a tutta larghezza, come prima: qui la linguetta non e' un
   comando discreto in mezzo al testo, e' l'insegna del luogo di cui stai
   leggendo. Con un luogo solo fa da titolo, con piu' luoghi si sceglie.
   Lo stacco dal contenuto resta corto: la fascia e cio' che annuncia sono
   la stessa cosa, allontanarli li fa sembrare due. */
.schede__linguette {
  display: flex;
  flex-direction: column;
  gap: var(--mdv-spazio-2);
  margin-bottom: var(--mdv-spazio-3);
}

.schede__linguetta {
  width: 100%;
  padding: var(--mdv-spazio-3) var(--mdv-spazio-4);
  border: none;
  font-family: var(--mdv-font-corpo);
  font-size: 2rem;
  line-height: 1.3;
  color: var(--mdv-bianco);
  background-color: var(--mdv-bruno-900-velato);
  cursor: pointer;
  transition: background-color 240ms ease;
}
.schede__linguetta--attiva {
  background-color: var(--mdv-sabbia);
}
.schede__linguetta:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: -4px;
}
.schede__pannello:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: 4px;
}

@media (hover: hover) {
  .schede__linguetta:hover {
    background-color: var(--mdv-sabbia);
  }
}

@media (max-width: 576px) {
  .schede__linguetta {
    font-size: 1.4rem;
  }
}

</style>
