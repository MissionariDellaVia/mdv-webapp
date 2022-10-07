<template>
  <div class="map-wrap">
    <div class="map" ref="mapContainer"></div>
  </div>
</template>

<script>
import {Map,NavigationControl, Marker } from 'maplibre-gl';
import {shallowRef, onMounted, onUnmounted, markRaw} from 'vue';

export default {
  name: "BaseMap",
  props: {
    lat: Number,
    lng: Number,
  },
  setup(props) {
    const mapContainer = shallowRef(null);
    const map = shallowRef(null);

    onMounted(() => {
      const apiKey = 'h7HNgB120Lbl3ClrZZga';

      const initialState = {lng: props.lng, lat: props.lat, zoom: 16};

      map.value = markRaw(new Map({
        container: mapContainer.value,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
        center: [initialState.lng, initialState.lat],
        zoom: initialState.zoom
      }));
      map.value.addControl(new NavigationControl(), 'top-right');
      new Marker({color: "#8c681c"})
          .setLngLat([props.lng,props.lat])
          .addTo(map.value);
    }),
        onUnmounted(() => {
          map.value?.remove();
        })

    return {
      map, mapContainer
    };
  }
}
</script>

<style scoped>
@import '~maplibre-gl/dist/maplibre-gl.css';

.map-wrap {
  position: relative;
  width: 100%;
  height: 20rem; /* calculate height of the screen minus the heading */
}

.map {
  position: relative;
  width: 100%;
  height: 100%;
}

.watermark {
  position: relative;
  left: 10px;
  bottom: 10px;
  z-index: 999;
}
</style>