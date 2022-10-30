<template>
  <section>
    <MDHeader :image="contattiPage.header.backgroundImage"
              :title="contattiPage.header.title"/>

    <div class="container">

      <div v-for="(place, index) in contattiPage.places" v-bind:key="index" class="row my-4" >
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <div class="text-center fs-2">{{ place.title }}</div>
            </div>
            <div class="card-body">
              <div class="row my-4">
                <div class="col col-lg-12 align-self-start">
                  <BaseMap :lat="place.lat" :lng="place.lng"></BaseMap>
                </div>
              </div>
              <div class="row my-4">
                <div class="col col-lg-4">
                  <MdvContactoButton>
                    <template v-slot:card-header>
                      <i class="fa-solid fa-location-dot"></i>
                    </template>
                    <template v-slot:body>
                      <p v-for="(addr, index) in place.address" v-bind:key="index">
                        <Markdown :source="addr"></Markdown>
                      </p>
                    </template>
                  </MdvContactoButton>
                </div>
                <div class="col col-lg-4">
                  <MdvContactoButton>
                    <template v-slot:card-header>
                      <i class="fa-solid fa-phone"></i>
                    </template>
                    <template v-slot:body>
                      <p class="fw-bold"></p>
                      <p><Markdown :source="place.phone.title"></Markdown><a :href="`tel:0039${place.phone.number}`" >{{ place.phone.number }}</a></p>
                    </template>
                  </MdvContactoButton>
                </div>
                <div class="col col-lg-4">
                  <MdvContactoButton>
                    <template v-slot:card-header>
                      <i class="fa-regular fa-envelope"></i>
                    </template>
                    <template v-slot:body>
                      <p v-for="(email, index) in place.emails" v-bind:key="index">
                        <Markdown :source="email.title"></Markdown>
                        <a :href="`mailto:${email.email}`">{{ email.email }}</a>
                      </p>
                    </template>
                  </MdvContactoButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row my-4">
        <MdvForm :title="contattiPage.form.title"
                 :button-name="contattiPage.form.buttonName"
                 :name-field="contattiPage.form.nameField"
                 :last-name-field="contattiPage.form.lastNameField"
                 :text-field="contattiPage.form.messageField"
        />
      </div>


    </div>
  </section>
</template>

<script>
import MDHeader from "@/components/layout/MdvHeader";
import MdvContactoButton from "@/components/MdvContactButton";
import BaseMap from "@/components/ui/BaseMap";
import MdvForm from "@/components/MdvForm";
import Markdown from 'vue3-markdown-it';

export default {
  name: "ContattiPage",
  components: {MdvForm, BaseMap, MDHeader, MdvContactoButton, Markdown},
  created() {
    this.loadPage("contatti");
  },
  data() {
    return {
      helper: this.$util,
      isLoading: false,
    };
  },
  computed: {
    contattiPage() {
      return this.$store.getters['page/contatti'];
    },
  },
  methods: {
    async loadPage(page) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('page/loadPage', page);
      } catch (error) {
        // this.showToast(error.message || 'Errore caricamento pagina!');
      }
      this.isLoading = false;
    },
  }

}
</script>

<style scoped>
.card {
  border: 0;
}
.card-header{
  font-family: 'Playfair Display', sans-serif;
  color: #fff;
  border: 0;
  background: rgb(40, 29, 2, 0.9);
}
a {
  text-decoration: none;
  color: #8c681c;
  margin-bottom: 1.2rem;
}
a:hover, a:focus {
  color: #59411a;
}
</style>