<template>
  <div v-if="luoghi.length">
    <!-- I gruppi sono i luoghi in cui la comunita' e' presente, non
         categorie di attivita': oggi ce n'e' uno, domani ce ne saranno
         altri. La fascia porta il nome del posto — con un luogo solo fa da
         titolo, con piu' luoghi diventa la scelta. -->
    <!-- Senza un'etichetta, "Santuario Madonna della Catena" in una
         fascia bruna puo' essere il titolo di una sezione, il nome di
         un'attivita', qualunque cosa. Questa riga dice che e' un luogo —
         e quando i luoghi saranno piu' d'uno, dira' che si sceglie. -->
    <p class="mdv-sopratitolo dove">Dove siamo</p>

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

  <p v-else class="nessuna-attivita my-12 py-12 text-center">
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
.dove {
  text-align: center;
  margin-bottom: var(--mdv-spazio-3);
}
.nessuna-attivita {
  font-family: var(--mdv-font-corpo);
  color: var(--mdv-grigio);
}
</style>
