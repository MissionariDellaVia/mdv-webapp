<template>
  <div class="container">
    <!-- Toast -->
    <base-toast :show="!!toast.val" :type="toast.type">
      {{ toast.message }}
    </base-toast>

    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <base-dashboard v-else :title="groupPage.title">
      <div class="row text-center mb-4">
        <router-link :to="'/reserved-area/mdv-admin/dashboard'">
          <i class="fa-regular fa-hand-point-left back-page"></i>
        </router-link>
      </div>
      <div class="row my-3">
        <div class="col-md-12 text-center">
          <span class="fi fi-it" @click="changeLang('it')"></span>
          <span class="fi fi-gb ms-3" @click="changeLang('en')"></span>
          <span class="fi fi-es ms-3" @click="changeLang('es')"></span>
          <span class="fi fi-pt ms-3" @click="changeLang('pt')"></span>
          <span class="fi fi-fr ms-3" @click="changeLang('fr')"></span>
          <span class="fi fi-pl ms-3" @click="changeLang('pl')"></span>
        </div>
      </div>
      <div class="row section-group mb-4">
        <div class="col-12" v-for="(section, index) in groupPage.sections" v-bind:key="index">
          <mdv-editable-section
                                :title="section.title"
                                :groupKey="groupPage.key"
                                :articles="section.articles"
          />

        </div>
      </div>
    </base-dashboard>

  </div>
</template>

<script>
// @ is an alias to /src
import BaseDashboard from "@/components/ui/BaseDashboard";
import MdvEditableSection from "@/components/MdvEditableSection";

export default {
  name: "EditActivityPage",
  components: {
    BaseDashboard, MdvEditableSection
  },
  props: ['page'],
  created () {
    this.loadPage("attivita");
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
      mainTitle: ''
    }
  },
  computed: {
    groupPage() {
      const activityGroups = this.$store.getters['page/attivita'].groups;
      console.log(activityGroups);
      return activityGroups.filter( group => group.key === this.page )[0];
      // return this.$store.getters['page/attivita'];
    },
    currentRouteName() {
      return this.$route.name;
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
    async changeLang(lang) {
      this.isLoading = true;
      try {
        console.debug("change from " + localStorage.getItem('lang') + " to " + lang);
        console.debug("current route " + this.currentRouteName);
        this.$store.dispatch('page/changeLang', {lang: lang, route: 'attivita'});
        this.scrollToTop();
      } catch (error) {
        // this.showToast(error.message || 'Errore caricamento pagina!');
      }
      this.isLoading = false
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
.section-group {
  max-height: 35rem;
  overflow: auto;
}
.fi {
  font-size: larger;
  cursor: pointer;
  transition: all 0.1s ease;
}
.fi:hover {
  transform: scale(1.4);
}
</style>
