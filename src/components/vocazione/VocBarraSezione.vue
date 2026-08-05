<template>
  <div class="voc-barra">
    <div class="container voc-barra__contenuto">
      <router-link :to="{ name: 'vocazione' }" class="voc-barra__ritorno">
        <span aria-hidden="true">←</span> Vocazione
      </router-link>

      <span class="voc-barra__separatore" aria-hidden="true">›</span>

      <button
        type="button"
        class="voc-barra__corrente"
        :aria-expanded="apertoIndice ? 'true' : 'false'"
        @click="apertoIndice = !apertoIndice"
      >
        {{ etichettaCorrente }}
        <span class="voc-barra__freccia" aria-hidden="true">⌄</span>
      </button>
    </div>

    <div v-if="apertoIndice" class="voc-barra__pannello">
      <ul class="container voc-barra__lista">
        <li v-for="(voce, i) in pagine" :key="voce.nome">
          <hr v-if="i > 0 && voce.gruppo !== pagine[i - 1].gruppo" class="voc-barra__divisione" />
          <router-link
            :to="{ name: voce.nome }"
            :class="['voc-barra__voce', { 'voc-barra__voce--attiva': voce.nome === rottaCorrente }]"
          >
            {{ voce.etichetta }}
            <span v-if="voce.nome === rottaCorrente" class="voc-barra__qui">sei qui</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VocBarraSezione',
  props: {
    pagine: { type: Array, required: true },
    rottaCorrente: { type: String, default: '' },
  },
  data() {
    return { apertoIndice: false };
  },
  computed: {
    etichettaCorrente() {
      const voce = this.pagine.find((v) => v.nome === this.rottaCorrente);
      return voce ? voce.etichetta : '';
    },
  },
  watch: {
    // Cambiata pagina, il pannello non ha piu' ragione di restare aperto.
    rottaCorrente() {
      this.apertoIndice = false;
    },
  },
  mounted() {
    window.addEventListener('keydown', this.chiudiConEsc);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.chiudiConEsc);
  },
  methods: {
    chiudiConEsc(evento) {
      if (evento.key === 'Escape') this.apertoIndice = false;
    },
  },
};
</script>

<style scoped>
.voc-barra {
  position: sticky;
  top: var(--mdv-altezza-navbar);
  z-index: 1000;
  background-color: var(--mdv-bianco);
  border-bottom: 1px solid var(--mdv-sabbia);
}
.voc-barra__contenuto {
  display: flex;
  align-items: center;
  gap: var(--mdv-spazio-2);
  padding-top: var(--mdv-spazio-2);
  padding-bottom: var(--mdv-spazio-2);
  font-family: var(--mdv-font-navigazione);
  font-size: 0.95rem;
}
.voc-barra__ritorno {
  color: var(--mdv-oro-scuro);
  text-decoration: none;
  white-space: nowrap;
}
.voc-barra__ritorno:hover {
  color: var(--mdv-oro);
}
.voc-barra__separatore {
  color: var(--mdv-sabbia);
}
.voc-barra__corrente {
  background: none;
  border: none;
  padding: var(--mdv-spazio-1) var(--mdv-spazio-2);
  font-family: inherit;
  font-size: inherit;
  color: var(--mdv-bruno-900);
  cursor: pointer;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.voc-barra__freccia {
  color: var(--mdv-oro);
}
.voc-barra__pannello {
  background-color: var(--mdv-bianco);
  border-top: 1px solid var(--mdv-sabbia);
  box-shadow: 0 4px 12px var(--mdv-ombra-lieve);
}
.voc-barra__lista {
  list-style: none;
  padding-top: var(--mdv-spazio-2);
  padding-bottom: var(--mdv-spazio-2);
  margin: 0;
}
.voc-barra__voce {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--mdv-spazio-3);
  padding: var(--mdv-spazio-3) 0;
  font-family: var(--mdv-font-corpo);
  color: var(--mdv-bruno-900);
  text-decoration: none;
}
.voc-barra__voce:hover,
.voc-barra__voce--attiva {
  color: var(--mdv-oro);
}
.voc-barra__qui {
  font-family: var(--mdv-font-navigazione);
  font-size: 0.8rem;
  color: var(--mdv-grigio);
  white-space: nowrap;
}
.voc-barra__divisione {
  border: none;
  border-top: 1px solid var(--mdv-sabbia);
  margin: var(--mdv-spazio-2) 0;
  opacity: 0.6;
}
.voc-barra__ritorno:focus-visible,
.voc-barra__corrente:focus-visible,
.voc-barra__voce:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: 2px;
}
</style>
