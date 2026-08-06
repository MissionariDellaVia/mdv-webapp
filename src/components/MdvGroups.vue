<template>
  <div v-if="luoghi.length" class="container">
    <!-- I gruppi sono i luoghi in cui la comunita' e' presente, non
         categorie di attivita': oggi ce n'e' uno, domani ce ne saranno
         altri. La fascia porta il nome del posto — con un luogo solo fa da
         titolo, con piu' luoghi diventa la scelta. -->
    <BaseSchede :voci="luoghi" etichetta="Luoghi" v-slot="{ voce }">
      <MdvArticle
        v-for="(sezione, i) in voce.sezioni"
        :key="i"
        small="true"
        :image-url="sezione.image ? sezione.image.url : null"
        :align="sezione.image ? sezione.image.align : null"
        :title="sezione.title"
        :texts="sezione.articles"
      />
    </BaseSchede>
  </div>

  <p v-else class="text-center my-5 py-5 nessuna-attivita">
    Nessuna attività disponibile al momento.
  </p>
</template>

<script>
import BaseSchede from "@/components/ui/BaseSchede.vue";
import MdvArticle from "@/components/MdvArticle.vue";

export default {
  name: "MdvGroups",
  components: { BaseSchede, MdvArticle },
  props: {
    groups: Array
  },
  computed: {
    // Il primo gruppo aveva un ramo di markup tutto suo, copiato dal ciclo
    // sottostante con un carattere piu' grande. E' un luogo come gli altri.
    luoghi() {
      return (this.groups || []).map((gruppo) => ({
        chiave: gruppo.key,
        titolo: gruppo.title,
        citta: gruppo.city,
        sezioni: gruppo.sections || [],
      }));
    }
  }
}
</script>

<style scoped>
.nessuna-attivita {
  font-family: var(--mdv-font-corpo);
  color: var(--mdv-grigio);
}
</style>
