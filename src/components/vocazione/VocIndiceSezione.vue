<template>
  <nav class="voc-indice" aria-label="Sezione vocazione">
    <div class="container voc-indice__contenuto">
      <p class="voc-indice__soprattitolo">Continua</p>

      <div v-for="gruppo in gruppi" :key="gruppo.nome" class="voc-indice__gruppo">
        <h2 class="voc-indice__titolo-gruppo">{{ gruppo.etichetta }}</h2>
        <ul class="voc-indice__lista">
          <li v-for="voce in gruppo.voci" :key="voce.nome">
            <span v-if="voce.nome === rottaCorrente" class="voc-indice__qui">
              {{ voce.etichetta }}
              <span class="voc-indice__nota">sei qui</span>
            </span>
            <router-link v-else :to="{ name: voce.nome }" class="voc-indice__voce">
              {{ voce.etichetta }}
            </router-link>
          </li>
        </ul>
      </div>

      <router-link :to="{ name: 'vocazione' }" class="voc-indice__ritorno">
        <span aria-hidden="true">←</span> Torna all'inizio di Vocazione
      </router-link>
    </div>
  </nav>
</template>

<script>
const ETICHETTE_GRUPPO = {
  percorsi: 'I quattro percorsi',
  altro: 'Altro',
};

export default {
  name: 'VocIndiceSezione',
  props: {
    pagine: { type: Array, required: true },
    rottaCorrente: { type: String, default: '' },
  },
  computed: {
    // L'ordine dei gruppi e' quello del file: l'indice resta l'unica
    // fonte, qui si raggruppa soltanto.
    gruppi() {
      const perNome = [];
      for (const voce of this.pagine) {
        let gruppo = perNome.find((g) => g.nome === voce.gruppo);
        if (!gruppo) {
          gruppo = {
            nome: voce.gruppo,
            etichetta: ETICHETTE_GRUPPO[voce.gruppo] || voce.gruppo,
            voci: [],
          };
          perNome.push(gruppo);
        }
        gruppo.voci.push(voce);
      }
      return perNome;
    },
  },
};
</script>

<style scoped>
/* Sta in fondo alla pagina, non fra la navbar e l'hero: non c'e' niente
   con cui possa entrare in contrasto. */
.voc-indice {
  border-top: 1px solid var(--mdv-sabbia);
  padding-top: var(--mdv-spazio-6);
  padding-bottom: var(--mdv-spazio-6);
}
.voc-indice__contenuto {
  max-width: 46rem;
}
.voc-indice__soprattitolo {
  font-family: var(--mdv-font-navigazione);
  font-size: 0.8rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--mdv-oro);
  margin-bottom: var(--mdv-spazio-5);
}
.voc-indice__gruppo {
  margin-bottom: var(--mdv-spazio-5);
}
.voc-indice__titolo-gruppo {
  font-family: var(--mdv-font-navigazione);
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mdv-grigio);
  margin-bottom: var(--mdv-spazio-3);
}
.voc-indice__lista {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
.voc-indice__lista li + li {
  border-top: 1px solid var(--mdv-sabbia);
}
.voc-indice__voce,
.voc-indice__qui {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--mdv-spazio-3);
  padding: var(--mdv-spazio-3) 0;
  font-family: var(--mdv-font-corpo);
  font-size: 1.1rem;
  text-decoration: none;
}
.voc-indice__voce {
  color: var(--mdv-bruno-900);
  transition: color 0.2s, padding-left 0.2s;
}
.voc-indice__voce:hover,
.voc-indice__voce:focus {
  color: var(--mdv-oro);
  padding-left: var(--mdv-spazio-2);
}
.voc-indice__qui {
  color: var(--mdv-oro);
}
.voc-indice__nota {
  font-family: var(--mdv-font-navigazione);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mdv-grigio);
  white-space: nowrap;
}
.voc-indice__ritorno {
  display: inline-block;
  margin-top: var(--mdv-spazio-3);
  font-family: var(--mdv-font-navigazione);
  font-size: 0.95rem;
  color: var(--mdv-sabbia-chiara);
  text-decoration: none;
}
.voc-indice__ritorno:hover,
.voc-indice__ritorno:focus {
  color: var(--mdv-oro-chiaro);
}
.voc-indice__voce:focus-visible,
.voc-indice__ritorno:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: 2px;
}
</style>
