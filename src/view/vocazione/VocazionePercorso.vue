<template>
  <section>
    <div class="voc-percorso">
      <component
        :is="componentePer(blocco.tipo)"
        v-for="(blocco, i) in blocchiValidi"
        :key="i"
        v-rivela
        v-bind="propsPer(blocco)"
      />

      <!-- La proposta chiude ogni percorso: vive qui e non nel contenuto,
           per non averne quattro copie destinate a divergere. -->
      <aside class="voc-percorso__proposta">
        <h2 class="voc-percorso__proposta-titolo">Vuoi parlarne con qualcuno?</h2>
        <p class="voc-percorso__proposta-testo">
          Accompagniamo spiritualmente chi è in ricerca vocazionale e proponiamo dei ritiri.
        </p>
        <router-link :to="{ name: 'vocazione-proposta' }" class="mdv-invito">
          Scopri la nostra proposta
          <span class="mdv-invito__freccia" aria-hidden="true">&rarr;</span>
        </router-link>
      </aside>
    </div>
  </section>
</template>

<script>
import VocProsa from '@/components/vocazione/VocProsa.vue';
import VocElenco from '@/components/vocazione/VocElenco.vue';
import VocPassi from '@/components/vocazione/VocPassi.vue';
import VocRiflessioni from '@/components/vocazione/VocRiflessioni.vue';
import VocTestimonianze from '@/components/vocazione/VocTestimonianze.vue';
import VocRimandi from '@/components/vocazione/VocRimandi.vue';
import contenuto from '@/assets/data/vocazione.json';

const PER_TIPO = {
  prosa: 'VocProsa',
  elenco: 'VocElenco',
  segni: 'VocElenco',
  passi: 'VocPassi',
  riflessioni: 'VocRiflessioni',
  testimonianze: 'VocTestimonianze',
  rimandi: 'VocRimandi',
};

export default {
  name: 'VocazionePercorso',
  components: {
    VocProsa, VocElenco, VocPassi, VocRiflessioni, VocTestimonianze, VocRimandi,
  },
  props: {
    chiave: { type: String, required: true },
  },
  computed: {
    percorso() {
      return contenuto.percorsi[this.chiave];
    },
    blocchiValidi() {
      return this.percorso.blocchi.filter((b) => {
        if (PER_TIPO[b.tipo]) return true;
        console.warn(`[vocazione] blocco ignorato, tipo sconosciuto: "${b.tipo}"`);
        return false;
      });
    },
  },
  methods: {
    componentePer(tipo) {
      return PER_TIPO[tipo];
    },
    propsPer(blocco) {
      const { tipo, ...resto } = blocco;
      // "segni" e' un elenco con la spunta; i blocchi con stato devono sapere
      // in che percorso si trovano, per non mescolare le risposte fra pagine.
      if (tipo === 'segni') return { ...resto, variante: 'segni' };
      if (tipo === 'passi' || tipo === 'riflessioni') return { ...resto, percorso: this.chiave };
      return resto;
    },
  },
};
</script>

<style scoped>
.voc-percorso {
  margin-inline: auto;
  padding-inline: var(--mdv-spazio-4);
  max-width: 46rem;
  padding-top: var(--mdv-spazio-4);
  padding-bottom: var(--mdv-spazio-6);
}
.voc-percorso__proposta {
  margin-top: var(--mdv-spazio-6);
  padding-top: var(--mdv-spazio-5);
  border-top: 1px solid var(--mdv-sabbia);
  text-align: center;
}
.voc-percorso__proposta-titolo {
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-oro);
  font-size: 1.6rem;
  margin-bottom: var(--mdv-spazio-3);
}
.voc-percorso__proposta-testo {
  font-family: var(--mdv-font-corpo);
  font-size: var(--mdv-testo-m);
  margin-bottom: var(--mdv-spazio-4);
}
</style>
