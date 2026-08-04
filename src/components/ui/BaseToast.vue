<template>
    <teleport to="body">
        <transition :name="type">
            <div v-if="show" class="toast-alert-wrapper fixed-top">
                <div class="toast-alert text-center mx-auto" :class="type">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            required: true,
        },
        type: {
            type: String,
            default: 'success'
        }
    },
}
</script>

<style scoped>
.toast-alert-wrapper {
    margin-top: 130px;
}
.toast-alert {
    font-family: 'Playfair Display', sans-serif;
    padding: 20px;
    /*border-radius: 10px;*/
    box-shadow: 1px 3px 5px rgba(0,0,0,0.2);
    max-width: 450px;
    font-size: 1.2rem;
    color: white;
    background: #417a5a;
}
.toast-alert.danger {
    color: white;
    background-color: #773737 !important;
}

/* enter transitions */
.danger-enter-active {
    animation: wobble 0.5s ease;
}
/* leave transitions */
.danger-leave-to {
    opacity: 0;
    transform: translateY(-60px);
}
.danger-leave-active {
    transition: all 0.3s ease;
}
@keyframes wobble {
    0% { transform: translateY(-100px); opacity: 0 }
    50% { transform: translateY(0px); opacity: 1 }
    60% { transform: translateX(8px); opacity: 1 }
    70% { transform: translateX(-8px); opacity: 1 }
    80% { transform: translateX(4px); opacity: 1 }
    90% { transform: translateX(-4px); opacity: 1 }
    100% { transform: translateX(0px); opacity: 1 }
}

.success-enter-from,
.success-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.success-enter-active {
    transition: all 0.3s ease-out;
}

.success-leave-active {
    transition: all 0.3s ease-in;
}

.success-enter-to,
.success-leave-from {
    opacity: 1;
    transform: scale(1);
}
</style>