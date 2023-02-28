<template>
  <section class="container">
    <!-- Toast -->
    <base-toast :show="!!toast.val" :type="toast.type">
      {{ toast.message }}
    </base-toast>

    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <base-dashboard v-else :title="'Dashboard'">
      <section class="row my-4 text-center">
        <div class="col-12">
          <h2 class="main-title">Gruppi Attività</h2>
        </div>
      </section>
      <section class="row gy-5 pb-5 mx-auto">
        <div v-for="group in attivitaPage.groups" v-bind:key="group.key" class="col-sm-12 col-md-4 text-center">
          <base-button :title="group.title" :link="'/reserved-area/mdv-admin/dashboard/' + group.key"/>
        </div>
      </section>
    </base-dashboard>

  </section>
</template>

<script>
// @ is an alias to /src
import BaseDashboard from "@/components/ui/BaseDashboard";
import BaseButton from "@/components/ui/BaseButton";

export default {
  name: "DashboardPage",
  components: {
    BaseButton,
    BaseDashboard,
  },
  created() {
    this.loadPage("attivita");
  },
  data() {
    return {
      isLoading: false,
      show: false,
      toast: {
        val: false,
        message: '',
        type: 'danger'
      },
    }
  },
  computed: {
    attivitaPage() {
      return this.$store.getters['page/attivita'];
    }
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
.main-title {
  font-family: 'Bubbler One', sans-serif;
  font-size: 3rem;
  color: #655640;
}
</style>
