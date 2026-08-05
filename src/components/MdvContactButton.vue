<template>
  <BaseRiquadro reattivo class="contatto">
    <template #testata>
      <span class="contatto__icona"><slot name="card-header"></slot></span>
    </template>
    <slot name="body"></slot>
  </BaseRiquadro>
</template>

<script>
import BaseRiquadro from '@/components/ui/BaseRiquadro';

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
