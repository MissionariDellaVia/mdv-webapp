<template>
    <button class="btn back-button rounded-circle" @click="$router.go(-1)"> <i class="far fa-hand-point-left"></i> </button>
</template>

<script>
export default {}
</script>

<style scoped>
.back-button {
    color: #fff;
    border-color: transparent;
    font-size: 18px;
    background-color: #6e4f3a;
    transition: all .1s;
    -webkit-box-shadow: 3px 4px 15px -5px #7E7E7E; 
    box-shadow: 3px 4px 15px -5px #7E7E7E;
}
.back-button:hover {
    background-color: #c3b5b9;
    transform: scale(0.97);
}
.back-button:active {
    background-color: #c3b5b9;
    transform: scale(0.93);
}
</style>