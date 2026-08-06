<template>
  <BaseRiquadro class="modulo">
    <base-toast :show="!!toast.val" :type="toast.type">
      {{ toast.message }}
    </base-toast>

    <template v-if="title" #testata>
      <div class="text-center">{{ title }}</div>
    </template>

    <form class="modulo__campi" @submit.prevent="submitForm">
      <!-- Le etichette puntavano tutte a "floatingInput", che non esiste:
           cliccarle non metteva il fuoco in nessun campo, e un lettore di
           schermo leggeva quattro volte lo stesso nome. Ora ognuna e'
           legata al suo. -->
      <div class="modulo__coppia">
        <p class="modulo__campo">
          <label for="nome">{{ nameField }}</label>
          <input id="nome" v-model="name" type="text" autocomplete="given-name" />
        </p>
        <p class="modulo__campo">
          <label for="cognome">{{ lastNameField }}</label>
          <input id="cognome" v-model="lastName" type="text" autocomplete="family-name" />
        </p>
      </div>

      <p class="modulo__campo">
        <label for="posta">Email</label>
        <input id="posta" v-model="email" type="email" autocomplete="email" />
      </p>

      <p class="modulo__campo">
        <label for="messaggio">{{ textField }}</label>
        <textarea id="messaggio" v-model="textArea" rows="5"></textarea>
      </p>

      <p class="modulo__invio">
        <button type="submit" class="mdv-invito">{{ buttonName }}</button>
      </p>
    </form>
  </BaseRiquadro>
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
.modulo {
  max-width: 44rem;
  margin: 0 auto;
}
.modulo__campi {
  display: flex;
  flex-direction: column;
  gap: var(--mdv-spazio-4);
}
.modulo__coppia {
  display: grid;
  gap: var(--mdv-spazio-4);
}

.modulo__campo {
  display: flex;
  flex-direction: column;
  gap: var(--mdv-spazio-2);
  margin: 0;
}
.modulo__campo label {
  font-family: var(--mdv-font-navigazione);
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--mdv-grigio);
}
.modulo__campo input,
.modulo__campo textarea {
  width: 100%;
  padding: var(--mdv-spazio-3);
  border: 1px solid var(--mdv-sabbia);
  border-radius: var(--mdv-raggio-s);
  background-color: var(--mdv-bianco);
  font-family: var(--mdv-font-corpo);
  font-size: 1rem;
  color: var(--mdv-bruno-900);
  transition: border-color 240ms ease;
}
.modulo__campo textarea {
  resize: vertical;
}
.modulo__campo input:focus,
.modulo__campo textarea:focus {
  outline: none;
  border-color: var(--mdv-oro);
}

.modulo__invio {
  margin: var(--mdv-spazio-2) 0 0;
  text-align: center;
}

@media (min-width: 36rem) {
  .modulo__coppia {
    grid-template-columns: 1fr 1fr;
  }
}
</style>