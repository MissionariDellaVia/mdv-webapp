<template>
  <div class="container">

    <!-- Toast -->
    <base-toast :show="!!toast.val" :type="toast.type">
      {{ toast.message }}
    </base-toast>

    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>

    <base-card :title="'Area Riservata'">
      <section class="row my-4">
        <div class="col-12 mx-auto">
          <login-form v-if="!signUp" @login-data="handleLogin"></login-form>
        </div>
      </section>
    </base-card>

  </div>
</template>

<script>
// @ is an alias to /src
import LoginForm from '@/components/MdvLoginForm'

export default {
  name: "AuthPage",
  components: {
    LoginForm
  },
  data() {
    return {
      dialog: false,
      isLoading: false,
      toast: {
        val: false,
        message: '',
        type: 'danger'
      },
      signUp: false
    }
  },
  methods: {
    async handleLogin(data) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('login', data);
        const redirectUrl = '/' + (this.$route.query.redirect || 'reserved-area/mdv-admin/dashboard');
        this.$router.replace(redirectUrl);
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
