<template>
  <div class="auth-container">
    <base-toast :show="!!toast.val" :type="toast.type">
      {{ toast.message }}
    </base-toast>

    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>

    <div v-else class="auth-card">
      <div class="auth-header">
        <div class="logo-section">
          <h1 class="auth-title">Missionari della Via</h1>
          <p class="auth-subtitle">Area Riservata</p>
        </div>
      </div>

      <div class="auth-body">
        <login-form @login-data="handleLogin"></login-form>
      </div>

      <div class="auth-footer">
        <p class="text-muted small">Accesso riservato agli amministratori</p>
      </div>
    </div>
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
        const redirectUrl = '/' + (this.$route.query.redirect || 'admin');
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
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #281d02;
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
  overflow: hidden;
}

.auth-header {
  background: #8c681c;
  padding: 40px 30px;
  text-align: center;
  color: white;
}

.logo-section {
  margin-bottom: 0;
}

.auth-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: white;
}

.auth-subtitle {
  font-family: 'Old Standard TT', serif;
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.95;
  font-style: italic;
}

.auth-body {
  padding: 40px 30px;
}

.auth-footer {
  padding: 20px 30px;
  background: #f8f9fa;
  text-align: center;
  border-top: 1px solid #e9ecef;
}

.small {
  font-size: 0.85rem;
  margin: 0;
}

@media (max-width: 576px) {
  .auth-title {
    font-size: 1.5rem;
  }

  .auth-subtitle {
    font-size: 1rem;
  }

  .auth-body {
    padding: 30px 20px;
  }
}
</style>
