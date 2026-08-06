<template>
  <section>
    <!-- Intestazione e modulo arrivano dal JSON locale: sono qui dal primo
         fotogramma. Solo le sedi aspettano la rete, e lo dicono al loro
         posto invece di far sparire la pagina intera. -->
    <MDHeader
      :image="contattiPage.header.backgroundImage"
      :title="contattiPage.header.title"
    />

    <div class="mx-auto w-full max-w-6xl px-4 py-16">
      <!-- La sagoma di una sede: i recapiti a sinistra, la mappa a
           destra. Quando arriva prende esattamente questo posto. -->
      <div v-if="isLoading" class="attesa" role="status" aria-busy="true">
        <span class="sr-only">Caricamento delle sedi in corso</span>
        <div class="attesa__dati">
          <BaseScheletro altezza="0.8rem" larghezza="35%" />
          <BaseScheletro altezza="2.2rem" larghezza="75%" />
          <div v-for="i in 3" :key="i" class="attesa__voce">
            <BaseScheletro altezza="0.7rem" larghezza="30%" />
            <BaseScheletro altezza="1.2rem" larghezza="80%" />
          </div>
        </div>
        <BaseScheletro altezza="20rem" />
      </div>

      <!-- Ogni sede era una scheda dentro una colonna dentro una riga, con
           dentro altre tre schede per indirizzo, telefono e posta. Per un
           indirizzo, un numero e due email era tutta scatola e niente
           contenuto. Qui la sede e' due colonne: da una parte cosa serve
           sapere, dall'altra dove si trova. -->
      <article
        v-for="sede in contattiPage.luoghi"
        :key="sede.chiave"
        class="sede"
        v-rivela
      >
        <div class="sede__dati">
          <p v-if="sede.citta" class="mdv-sopratitolo sede__citta">{{ sede.citta }}</p>
          <h2 class="mdv-titolo-sezione sede__nome">{{ sede.titolo }}</h2>

          <dl class="sede__elenco">
            <div v-if="sede.indirizzo.length" class="sede__voce">
              <dt class="sede__etichetta">
                <i class="fa-solid fa-location-dot" aria-hidden="true"></i> Indirizzo
              </dt>
              <dd class="sede__valore">
                <span v-for="(riga, i) in sede.indirizzo" :key="i" class="block">{{ riga }}</span>
              </dd>
            </div>

            <div v-if="sede.telefono" class="sede__voce">
              <dt class="sede__etichetta">
                <i class="fa-solid fa-phone" aria-hidden="true"></i> {{ sede.etichettaTelefono }}
              </dt>
              <dd class="sede__valore">
                <a :href="`tel:0039${sede.telefono}`">{{ sede.telefono }}</a>
              </dd>
            </div>

            <div v-if="sede.posta.length" class="sede__voce">
              <dt class="sede__etichetta">
                <i class="fa-regular fa-envelope" aria-hidden="true"></i> Scrivere
              </dt>
              <dd class="sede__valore">
                <span v-for="(voce, i) in sede.posta" :key="i" class="block">
                  <span class="sede__a-chi">{{ voce.etichetta }}</span>
                  <a :href="`mailto:${voce.indirizzo}`">{{ voce.indirizzo }}</a>
                </span>
              </dd>
            </div>
          </dl>

          <!-- Su una pagina di contatti mancava la cosa piu' pratica: come
               ci si arriva. -->
          <a
            v-if="sede.lat && sede.lng"
            :href="`https://www.google.com/maps/dir/?api=1&destination=${sede.lat},${sede.lng}`"
            target="_blank"
            rel="noopener noreferrer"
            class="mdv-invito sede__indicazioni"
          >
            Come arrivare
            <span class="mdv-invito__freccia" aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <div class="sede__mappa">
          <BaseMap :lat="sede.lat" :lng="sede.lng" />
        </div>
      </article>

      <hr class="separatore" />

      <MdvForm
        :title="contattiPage.form.title"
        :button-name="contattiPage.form.buttonName"
        :name-field="contattiPage.form.nameField"
        :last-name-field="contattiPage.form.lastNameField"
        :text-field="contattiPage.form.messageField"
      />
    </div>
  </section>
</template>

<script>
import { usaPagina } from '@/store/pagina.mjs';
import MDHeader from "@/components/layout/MdvHeader.vue";
import MdvForm from "@/components/MdvForm.vue";
import BaseScheletro from "@/components/ui/BaseScheletro.vue";
import { defineAsyncComponent } from 'vue';

// La mappa si porta dietro maplibre-gl, il pezzo piu' pesante di tutto il
// sito. Caricata cosi', arriva solo quando qualcuno apre i contatti: chi
// legge "chi siamo" non scarica piu' un motore cartografico.
const BaseMap = defineAsyncComponent(() => import("@/components/ui/BaseMap.vue"));

export default {
  name: "ContattiPage",
  setup() {
    return { pagina: usaPagina() };
  },
  components: { MdvForm, BaseMap, BaseScheletro, MDHeader },
  created() {
    this.loadPage("contatti");
  },
  data() {
    return { isLoading: false };
  },
  computed: {
    contattiPage() {
      return this.pagina.contatti;
    },
  },
  methods: {
    async loadPage(page) {
      this.isLoading = true;
      try {
        await this.pagina.caricaPagina(page);
      } catch (error) {
        console.error("Errore nel caricamento della pagina:", error);
      }
      this.isLoading = false;
    },
  }
}
</script>

<style scoped>
.attesa {
  display: grid;
  gap: var(--mdv-spazio-6);
  padding-bottom: var(--mdv-ritmo-sezione);
}
.attesa__dati {
  display: flex;
  flex-direction: column;
  gap: var(--mdv-spazio-3);
}
.attesa__voce {
  display: flex;
  flex-direction: column;
  gap: var(--mdv-spazio-2);
  margin-top: var(--mdv-spazio-3);
}
@media (min-width: 56rem) {
  .attesa {
    grid-template-columns: 5fr 6fr;
    align-items: center;
  }
}

.sede {
  display: grid;
  gap: var(--mdv-spazio-6);
  padding-bottom: var(--mdv-spazio-6);
  margin-bottom: var(--mdv-spazio-6);
  border-bottom: 1px solid var(--mdv-sabbia);
}
.sede:last-of-type {
  border-bottom: none;
}

.sede__citta {
  margin-bottom: var(--mdv-spazio-2);
}
.sede__nome {
  margin-bottom: var(--mdv-spazio-5);
}

.sede__elenco {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--mdv-spazio-5);
}
.sede__etichetta {
  display: flex;
  align-items: center;
  gap: var(--mdv-spazio-2);
  margin-bottom: var(--mdv-spazio-2);
  font-family: var(--mdv-font-navigazione);
  font-size: var(--mdv-testo-xs);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--mdv-grigio);
}
.sede__valore {
  margin: 0;
  font-family: var(--mdv-font-corpo);
  font-size: var(--mdv-testo-m);
  line-height: var(--mdv-interlinea-corpo);
  color: var(--mdv-bruno-900);
}
.sede__valore .block + .block {
  margin-top: var(--mdv-spazio-2);
}
.sede__a-chi {
  display: inline-block;
  min-width: 5rem;
  font-family: var(--mdv-font-navigazione);
  font-size: var(--mdv-testo-s);
  color: var(--mdv-grigio);
}

/* Il bottone chiude il blocco dei recapiti: gli serve aria sopra, o
   sembra appiccicato all'ultimo indirizzo email. */
.sede__indicazioni {
  margin-top: var(--mdv-spazio-6);
}

/* La mappa ha una forma sua e non galleggia dentro una scheda. */
.sede__mappa {
  overflow: hidden;
  border-radius: var(--mdv-raggio-m);
  border: 1px solid var(--mdv-sabbia);
  min-height: 20rem;
}
.sede__mappa :deep(> *) {
  height: 100%;
  min-height: 20rem;
}

/* Il modulo e' un'altra cosa rispetto alle sedi, e una riga lo dice.
   Era un <div class="modulo"> attorno a MdvForm — ma la radice di un
   componente figlio eredita anche l'ambito del genitore, e la radice di
   MdvForm si chiama anch'essa "modulo": la regola col bordo colpiva tutte
   e due, e le righe diventavano due. Un separatore esplicito non puo'
   collidere con il nome di nessuno. */
.separatore {
  border: none;
  border-top: 1px solid var(--mdv-sabbia);
  margin: var(--mdv-spazio-6) 0;
  opacity: 1;
}

@media (min-width: 56rem) {
  .sede {
    grid-template-columns: 5fr 6fr;
    align-items: center;
    gap: var(--mdv-spazio-6) var(--mdv-spazio-6);
  }
}
</style>
