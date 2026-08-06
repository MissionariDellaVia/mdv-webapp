<template>
  <a
    :href="refLink"
    target="_blank"
    rel="noopener noreferrer"
    :class="['articolo', { 'articolo--rilievo': rilievo }]"
  >
    <span v-if="imageUrl" class="articolo__cornice">
      <img :src="helper.getImgUrl(imageUrl)" alt="" class="articolo__foto" referrerpolicy="no-referrer" />
    </span>

    <span class="articolo__testo">
      <span class="articolo__data">{{ parsedDate }}</span>
      <span class="articolo__titolo">{{ title }}</span>
      <span class="articolo__filo" aria-hidden="true"></span>
    </span>
  </a>
</template>

<script>
// Una scheda sola, due pesi. L'articolo piu' recente sta in rilievo: non
// e' un ornamento, e' l'unica cosa che le tre schede hanno da dire
// l'una rispetto all'altra.
export default {
  name: "MdvBlogCard",
  props: {
    title: String,
    publishDate: Date,
    imageUrl: String,
    refLink: String,
    rilievo: { type: Boolean, default: false },
  },
  data() {
    return { helper: this.$util };
  },
  computed: {
    parsedDate() {
      if (!this.publishDate) return '';
      return `${this.publishDate.getDate()} ${this.publishDate.toLocaleDateString('default', { month: 'long' })}`;
    }
  },
}
</script>

<style scoped>
.articolo {
  display: flex;
  flex-direction: column;
  gap: var(--mdv-spazio-4);
  height: 100%;
  text-decoration: none;
  color: inherit;
}

/* La cornice ritaglia: e' l'immagine a muoversi dentro, non la scheda a
   sobbalzare. */
.articolo__cornice {
  display: block;
  overflow: hidden;
  border-radius: var(--mdv-raggio-s);
  background-color: var(--mdv-fondo-scheda);
  aspect-ratio: 3 / 2;
}
.articolo__foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 700ms var(--mdv-curva-morbida);
}

.articolo__testo {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--mdv-spazio-2);
}
.articolo__data {
  font-family: var(--mdv-font-navigazione);
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--mdv-oro);
}
.articolo__titolo {
  font-family: var(--mdv-font-corpo);
  font-size: 1.15rem;
  line-height: 1.4;
  color: var(--mdv-bruno-900);
  transition: color 300ms ease;
}
/* Il filo si tira sotto al titolo al passaggio: e' il solo movimento. */
.articolo__filo {
  display: block;
  width: 2rem;
  height: 1px;
  margin-top: auto;
  padding-top: var(--mdv-spazio-3);
  border-bottom: 1px solid var(--mdv-oro);
  transition: width 500ms var(--mdv-curva-morbida);
}

.articolo--rilievo .articolo__cornice {
  aspect-ratio: 16 / 10;
}
.articolo--rilievo .articolo__titolo {
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.25;
}

.articolo:focus-visible {
  outline: 2px solid var(--mdv-oro);
  outline-offset: 4px;
  border-radius: var(--mdv-raggio-s);
}

@media (hover: hover) {
  .articolo:hover .articolo__foto {
    transform: scale(1.05);
  }
  .articolo:hover .articolo__titolo {
    color: var(--mdv-oro);
  }
  .articolo:hover .articolo__filo {
    width: 5rem;
  }
}
</style>
