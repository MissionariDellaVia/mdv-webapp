<template>
  <teleport to="body" >
      <div v-if="show" class="position-absolute start-50 top-50">
        <div class="ping"></div>
      </div>
  </teleport>
</template>

<script>
export default {
  data(){
    return {
      show: false,
    }
  },
  watch:{
    $route (to, from){
      console.log('to: ' + to.path + ' - from: ' + from.path)
      this.show = false;
      this.setShow();
    }
  },
  methods: {
    setShow() {
      setTimeout(() => {
        this.show = true;
      }, 300);
    }
  },
  created () {
    this.setShow();
  },
}

</script>

<style scoped>
/* From uiverse.io by @G4b413l */
.ping {
  --uib-size: 50px;
  --uib-speed: 1s;
  --uib-color: #8c681c;
  position: relative;
  height: var(--uib-size);
  width: var(--uib-size);
}

.ping::before,
.ping::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: var(--uib-color);
  animation: pulse7132 var(--uib-speed) linear infinite;
  transform: scale(0);
  opacity: 0;
}

.ping::after {
  animation-delay: calc(var(--uib-speed) / -2);
}

@keyframes pulse7132 {
  0% {
    transform: scale(0);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>