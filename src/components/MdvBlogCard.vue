<template>
  <BaseRiquadro reattivo class="scheda-blog">
    <template #immagine>
      <img
        :src="helper.getImgUrl(imageUrl)"
        class="scheda-blog__foto"
        alt=""
        referrerpolicy="no-referrer"
      />
    </template>

    <h3 class="scheda-blog__titolo">{{ title }}</h3>
    <p class="scheda-blog__data">pubblicato il {{ parsedDate }}</p>
    <hr class="scheda-blog__filo" />
    <a :href="refLink" class="mdv-invito">
      Leggi di più
      <span class="mdv-invito__freccia" aria-hidden="true">&rarr;</span>
    </a>
  </BaseRiquadro>
</template>

<script>
import BaseRiquadro from '@/components/ui/BaseRiquadro.vue';

export default {
  name: "MdvBlogCard",
  components: { BaseRiquadro },
  props: ['title', 'cardText', 'publishDate', 'imageUrl', 'refLink'],
  computed: {
    parsedDate() {
      return this.publishDate.getDate() + " " + this.publishDate.toLocaleDateString('default', { month: 'long' });
    }
  },
  data(){
    return {
      helper: this.$util
    }
  }
}
</script>

<style scoped>
.scheda-blog {
  width: 21rem;
  max-width: 100%;
  text-align: center;
  background-color: var(--mdv-fondo-scheda);
}
.scheda-blog__foto {
  width: 100%;
  height: 15rem;
  object-fit: cover;
}
.scheda-blog__titolo {
  font-family: var(--mdv-font-corpo);
  font-size: 1.25rem;
  line-height: 1.4;
  margin: 0;
}
.scheda-blog__data {
  font-family: var(--mdv-font-navigazione);
  font-size: 0.9rem;
  color: var(--mdv-grigio-scuro);
  margin: var(--mdv-spazio-3) 0 0 0;
}
.scheda-blog__filo {
  border: none;
  border-top: 2px solid var(--mdv-sabbia);
  width: 70%;
  margin: var(--mdv-spazio-4) auto;
  opacity: 1;
}
</style>
