<template>
  <div class="container">

    <!-- Toast -->
    <base-toast :show="!!toast.val" :type="toast.type">
      {{ toast.message }}
    </base-toast>

    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>

    <base-dashboard :title="'Dashboard'">
      <section class="row gy-5 my-5 mx-auto">
        <div v-for="(page, index) in pages" v-bind:key="index" class="col-sm-12 col-md-4 text-center">
          <base-button :title="page.title" @click="handleButtonClick(page.key)"/>
        </div>
      </section>
    </base-dashboard>

  </div>
</template>

<script>
// @ is an alias to /src
import BaseDashboard from "@/components/ui/BaseDashboard";
import BaseButton from "@/components/ui/BaseButton";

export default {
  name: "AuthPage",
  components: {
    BaseButton,
    BaseDashboard,
  },
  data() {
    return {
      isLoading: false,
      toast: {
        val: false,
        message: '',
        type: 'danger'
      },
      signUp: false,
      pages: [
        {title: "Chi Siamo", key: "chi-siamo"},
        {title: "Vocazioni", key: "vocazioni"},
        {title: "Attività",  key: "attivita"},
        {title: "Prega con noi", key: "prega-con-noi"},
        {title: "Approfondimenti", key: "approfondimenti"},
        {title: "Contatti", key: "contatti"}
      ]
    }
  },
  methods: {
    async handleButtonClick(pageKey) {
      this.isLoading = true;
      try {
        // const redirectUrl = '/' + (this.$route.query.redirect || 'user/home');
        console.log(pageKey)
      } catch (error) {
        this.showToast(error.message || 'Errore nel Login!');
      }
      this.isLoading = false;
    },
    showToast(message, isSuccess = false) {
      this.toast.val = true;
      this.toast.message = message;

      if (isSuccess) {
        this.toast.type = 'success';
        setTimeout(() => {
          this.toast.val = false;
        }, 700);
      } else {
        this.toast.type = 'danger';
        setTimeout(() => {
          this.toast.val = false
        }, 3000);
      }
    },
  }

}
</script>

<style scoped>
.card {
  border-color: transparent;
  background-color: #eff0eb;
}

.small {
  font-size: 0.70rem;
}
</style>
