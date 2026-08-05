<template>
  <div v-if="groups && groups.length" class="container">
    <BaseSchede :voci="voci" etichetta="Gruppi di attività" v-slot="{ voce }">
      <MdvArticle
        v-for="(section, index) in voce.sections"
        :key="index"
        small="true"
        :image-url="section.image ? section.image.url : null"
        :align="section.image ? section.image.align : null"
        :title="section.title"
        :texts="section.articles"
      />
    </BaseSchede>
  </div>

  <p v-else class="text-center my-5 py-5 nessuna-attivita">
    Nessuna attività disponibile al momento.
  </p>
</template>

<script>
import MdvArticle from "@/components/MdvArticle.vue";
import BaseSchede from "@/components/ui/BaseSchede.vue";

export default {
  name: "MdvGroups",
  components: { MdvArticle, BaseSchede },
  props: {
    groups: Array
  },
  computed: {
    // Il primo gruppo faceva riga a se' con un carattere piu' grande e un
    // ramo di markup tutto suo, duplicato dal ciclo sottostante. E' un
    // gruppo come gli altri: qui sono un elenco solo.
    voci() {
      return (this.groups || []).map((gruppo) => ({
        chiave: gruppo.key,
        titolo: gruppo.title,
        sections: gruppo.sections,
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
