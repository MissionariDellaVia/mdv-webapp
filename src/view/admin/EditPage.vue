<template>
  <div class="container">

    <!-- Toast -->
    <base-toast :show="!!toast.val" :type="toast.type">
      {{ toast.message }}
    </base-toast>

    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <base-dashboard v-else :title="page">
      <div class="row text-center mb-4">
        <router-link to="/reserved-area/mdv-admin/dashboard">
          <i class="fa-regular fa-hand-point-left back-page"></i>
        </router-link>
      </div>
      <section v-if="currentPage.main" class="row my-2 pb-5">
        <h2>Main</h2>
        <div class="form-floating mb-3">
          <input type="text" class="form-control shadow rounded-4" v-model="mainTitle" id="floatingInput" placeholder="name@example.com">
          <label for="floatingInput">Titolo</label>
        </div>
      </section>
    </base-dashboard>

  </div>
</template>

<script>
// @ is an alias to /src
import BaseDashboard from "@/components/ui/BaseDashboard";

export default {
  name: "EditPage",
  components: {
    BaseDashboard,
  },
  props: ['page'],
  created () {
    this.loadPage(this.page);
  },
  data() {
    return {
      helper: this.$util,
      isLoading: false,
      toast: {
        val: false,
        message: '',
        type: 'danger'
      },
      signUp: false,
      mainTitle: '',
    }
  },
  computed: {
    currentPage() {
      return this.$store.getters['page/' + this.helper.toCamelCase(this.page)];
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
.back-page {
  color: #63543f;
  font-size: 2rem;
  cursor: pointer;
}
.back-page:hover, .back-page:focus {
  color: #c0902c;
  font-size: 2rem;
  cursor: pointer;
}
</style>
