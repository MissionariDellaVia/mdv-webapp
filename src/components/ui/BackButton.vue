<template>
    <button class="btn back-button rounded-circle" @click="$router.go(-1)"> <i class="far fa-hand-point-left"></i> </button>
</template>

<script>
export default {}
</script>

<style scoped>
.back-button {
    color: var(--mdv-bianco);
    border-color: transparent;
    font-size: 18px;
    background-color: var(--mdv-terra);
    transition: all .1s;
    -webkit-box-shadow: 3px 4px 15px -5px var(--mdv-grigio); 
    box-shadow: 3px 4px 15px -5px var(--mdv-grigio);
}
.back-button:hover {
    background-color: var(--mdv-pietra-rosata);
    transform: scale(0.97);
}
.back-button:active {
    background-color: var(--mdv-pietra-rosata);
    transform: scale(0.93);
}
</style>