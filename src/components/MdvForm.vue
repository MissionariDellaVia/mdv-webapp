<template>
  <div class="card">
    <div v-if="title" class="card-header">
      <div class="text-center fs-3">{{ title }}</div>
    </div>
    <div class="card-body my-3">
      <form class="mx-auto">
        <div class="row mb-3">
          <div class="col">
            <div class="form-floating">
              <input type="text" class="form-control" v-model="name" id="name" placeholder="Mario">
              <label for="floatingInput">Nome</label>
            </div>
          </div>
          <div class="col">
            <div class="form-floating">
              <input type="text" class="form-control" v-model="lastName" id="lastName" placeholder="Rossi">
              <label for="floatingInput">Cognome</label>
            </div>
          </div>
        </div>
        <div class="form-floating mb-3">
          <input type="email" class="form-control" v-model="email" id="email" placeholder="name@example.com">
          <label for="floatingInput">Email</label>
        </div>
        <div class="form-floating  mb-3">
          <textarea class="form-control" v-model="textArea" id="textArea" placeholder="inserire una richiesta"
                    rows="4"></textarea>
          <label for="floatingInput">Richiesta</label>
        </div>
        <div class="row mb-3">
          <div class="col-12 text-center">
            <button type="submit" class="btn btn-contact"> Entra</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "MdvForm",
  props: ['title'],
  data() {
    return {
      toast: false,
      name: '',
      lastName: '',
      email: '',
      textArea: '',
    }
  },
  methods: {
    submitForm() {
      // if (!this.formIsValid) {
      //     this.showToast();
      //     return;
      // }

      const formData = {
        name: this.name,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      };

      this.$emit('register-data', formData);
    },
  }

}
</script>

<style scoped>
.card {
  border: 0;
}

.card-header {
  font-family: 'Playfair Display', sans-serif;
  color: #fff;
  border: 0;
  background: rgb(40, 29, 2, 0.9);
}

p {
  font-family: 'Old Standard TT', sans-serif;
  font-size: 1.3rem;
}

img {
  max-width: 22rem;
  margin: auto;
}

form {
  width: 60%;
  margin: auto;
}

.form-control {
  background-color: #e5e4df;
  border-color: transparent;
  color: rgb(40, 29, 2, 0.9) !important;
}

.form-floating {
  color: rgb(40, 29, 2, 0.9) !important;
}

label {
  margin-left: 0.75rem;
}

input:focus, textarea:focus, button:focus {
  box-shadow: none;
  background-color: #e5e4df !important;
  border-color: transparent !important;
}

.btn-contact {
  background-color: rgb(40, 29, 2, 0.9);
  color: #FFFFFF;
  font-size: 1.2rem;
  border-radius: 0;
}

@media only screen and (max-width: 480px) {
  form {
    width: 100%;
  }
}
</style>