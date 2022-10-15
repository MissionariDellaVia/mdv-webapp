<template>
<section>
    <form @submit.prevent="submitForm" class="mt-4 mb-2" >
        <div class="form-floating mb-3">
            <input type="email" class="form-control shadow rounded" v-model="email" id="floatingInput" placeholder="name@example.com">
            <label for="floatingInput">Email</label>
        </div>
        <div class="form-floating mb-3">
            <input type="password" class="form-control shadow rounded" v-model="password" id="floatingPassword" placeholder="Password">
            <label for="floatingPassword">Password</label>
        </div>
        <div class="mx-auto text-center">
          <button type="submit" class="action-button"> Entra </button>
        </div>
    </form>
    <div class="text-center">
        <router-link to="/" class="color3 small">Hai dimenticato la password?</router-link>
    </div>
</section>
</template>

<script>
export default {
    emits: ['login-data'],
    data() {
        return {
            email: '',
            password: '',
            formIsValid: true,
        }
    },
    methods: {
        submitForm() {
            this.formIsValid = true;
            if (this.email === '' || !this.email.includes('@') || this.password.length < 6) {
                this.formIsValid = false;
                return;
            }

            const formData = {
                email: this.email,
                password: this.password
            };

            this.$emit('login-data', formData);
        },
    }
}
</script>
<style scoped>
form {
    margin: auto;
}
.form-control {
    background-color: #fff;
    border-color: transparent;
    color: rgb(40, 29, 2, 0.9) !important;
}
input:focus {
    color: rgb(40, 29, 2, 0.9) !important;
    border-color: transparent !important;
}
.small {
    font-size: 0.70rem;
}
.action-button {
  color: #fff;
  padding: 0.7em 1.7em;
  border-color: transparent;
  font-size: 18px;
  background-color: #59411a;
  transition: all .1s;
  -webkit-box-shadow: 3px 4px 15px -5px #3f2a02;
  box-shadow: 3px 4px 15px -5px #3f2a02;
}
.action-button:hover {
  background-color: #8c681c;
  transform: scale(0.97);
}
.action-button:focus {
  background-color: #8c681c;
  transform: scale(0.93);
}
a {
  font-size: larger;
  text-decoration: none;
  color: #8c681c;
  margin-bottom: 1.2rem;
}
a:hover, a:focus {
  color: #59411a;
}
</style>