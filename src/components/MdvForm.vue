<template>
  <div class="card">

    <base-toast :show="!!toast.val" :type="toast.type">
      {{ toast.message }}
    </base-toast>

    <div v-if="title" class="card-header">
      <div class="text-center fs-3">{{ title }}</div>
    </div>
    <div class="card-body my-3">
      <form class="mx-auto" @submit.prevent="submitForm">
        <div class="row mb-3">
          <div class="col">
            <div class="form-floating">
              <input type="text" class="form-control" v-model="name" id="name" placeholder="Mario">
              <label for="floatingInput">{{ nameField }}</label>
            </div>
          </div>
          <div class="col">
            <div class="form-floating">
              <input type="text" class="form-control" v-model="lastName" id="lastName" placeholder="Rossi">
              <label for="floatingInput">{{ lastNameField }}</label>
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
          <label for="floatingInput">{{ textField }}</label>
        </div>
        <div class="row mb-3">
          <div class="col-12 text-center">
            <button type="submit" class="btn btn-contact"> {{ buttonName }}</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "MdvForm",
  props: ['title', 'nameField', 'lastNameField', 'textField', 'buttonName' ],
  data() {
    return {
      toast: {
        val: false,
        message: '',
        type: 'danger'
      },
      name: '',
      lastName: '',
      email: '',
      textArea: '',
    }
  },
  methods: {
    showToast(message, isSuccess = false) {
      this.toast.val = true;
      this.toast.message = message;

      if (isSuccess) {
        this.toast.type = 'success';
        setTimeout(() => {
          this.toast.val = false;
        }, 1500);
      } else {
        this.toast.type = 'danger';
        setTimeout(() => {
          this.toast.val = false
        }, 3000);
      }
    },
    async submitForm() {
      const formData = {
        nome: this.name,
        cognome: this.lastName,
        mail: this.email,
        message: this.textArea,
        to: "missionaridellavia.lamezia@gmail.com"
      };

      const response = await fetch(
          `https://vocazione.altervista.org/api/SendMail.php`,
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          }
      );
      const responseData = await response.json();

      if (!response.ok) {
        console.log('Errore inserimento' + responseData.message)
        this.showToast("errore nell'invio della richiesta!", false)
      } else {
        this.showToast("richiesta inviata", true)
      }

    },
  }

}
</script>

<style scoped>
.card {
  border: 0;
}

.card-header {
  font-family: var(--mdv-font-corpo);
  color: var(--mdv-bianco);
  border: 0;
  background: var(--mdv-bruno-900-velato);
}

p {
  font-family: var(--mdv-font-alternativo);
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
  background-color: var(--mdv-fondo-campo);
  border-color: transparent;
  color: var(--mdv-bruno-900-velato) !important;
}

.form-floating {
  color: var(--mdv-bruno-900-velato) !important;
}

label {
  margin-left: 0.75rem;
}

input:focus, textarea:focus, button:focus {
  box-shadow: none;
  background-color: var(--mdv-fondo-campo) !important;
  border-color: transparent !important;
}

.btn-contact {
  background-color: var(--mdv-bruno-900-velato);
  color: var(--mdv-bianco);
  font-size: 1.2rem;
  border-radius: 0;
}

@media only screen and (max-width: 480px) {
  form {
    width: 100%;
  }
}
</style>