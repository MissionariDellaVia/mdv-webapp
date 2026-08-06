<template>
  <header class="video-wrapper">
    <video playsinline autoplay muted loop :poster="helper.getImgUrl('chiSiamo.jpg')">
      <source :src="helper.getImgUrl('intro-1440.mp4')" type="video/mp4">
    </video>

    <!-- Il ramo con il marchio e quello senza erano identici tranne una
         classe sul titolo: erano due copie della stessa cosa. -->
    <div class="header">
      <div class="header__contenuto">
        <h1 :class="['main-title uppercase', { 'with-brand': brand }]">{{ title }}</h1>
        <p v-if="caption" class="lead headerSection">{{ caption }}</p>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "MdvVideoHeader",
  props: ['image', 'brand', 'title', 'caption'],
  data(){
    return {
      helper: this.$util
    }
  },
}
</script>

<style scoped>
.header__contenuto {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  text-align: center;
}


@media only screen and (max-width: 480px) {
  .video-wrapper {
    height: 100vh !important;
  }
  video {
    object-fit: cover !important;
    height: 100%;
    width: 100%;

    position: absolute;
    top: 0;
    left: 0;
  }
  .main-title {
    margin-top: 3rem;
    font-size: 3rem !important;
  }
  .with-brand {
    font-size: 2.4rem !important;
  }
  .lead.headerSection {
    font-size: 1.5rem !important;
  }
  img {
    width: 2rem !important;
    margin-bottom: 1rem;
  }
}
@media only screen and (max-width: 1300px) and (min-width: 480px) {
  .video-wrapper {
    height: 45rem !important;
  }

}

.video-wrapper {
  position: relative;
  height: 45rem;
  overflow: hidden;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-wrapper::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  background: linear-gradient(180deg, color-mix(in srgb, var(--mdv-bruno-900) 80%, transparent) 0%, transparent 32%);
}
video {
  object-fit: cover;
  height: 100%;
  width: 100%;

  position: absolute;
  top: 0;
  left: 0;
}
.header{
  position: relative;
  font-family: var(--mdv-font-titolo);
  color: var(--mdv-bianco);
  text-shadow: 1px 1px 8px var(--mdv-velo-scuro);
}

.lead.headerSection {
  font-size: 2rem;
  text-transform: uppercase;
  width: 80%;
  margin: auto;
  color: var(--mdv-argento);
}

img {
  width: 4.5rem;
}

.main-title {
  font-size: 4rem;
}
</style>