<template>
  <BaseRiquadro reattivo class="contatto">
    <template #testata>
      <span class="contatto__icona"><slot name="icona"></slot></span>
    </template>
    <slot></slot>
  </BaseRiquadro>
</template>

<script>
import BaseRiquadro from '@/components/ui/BaseRiquadro.vue';

export default {
  name: "MdvContactButton",
  components: { BaseRiquadro },
}
</script>

<style scoped>
.contatto {
  width: 20rem;
  margin: auto;
  text-align: center;
}
.contatto__icona {
  font-size: 3rem;
  line-height: 1;
}
.contatto :deep(p) {
  font-family: var(--mdv-font-navigazione);
  font-size: larger;
}
</style>
