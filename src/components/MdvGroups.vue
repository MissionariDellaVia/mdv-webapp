<template>
  <div class="container">

    <div class="nav nav-pills mb-3 text-center" id="pills-tab" role="tablist">
      <div class="nav-item shadow-sm col-12 mb-2" role="presentation">
        <div class="nav-link fs-2 active main-group" :id=" 'pills-' + mainGroup.key + '-tab'" data-bs-toggle="pill" :data-bs-target="'#' + mainGroup.key" role="tab" aria-controls="pills-home" aria-selected="true"
             @click="tabLog(mainGroup.key)">
          {{ mainGroup.title }}</div>
      </div>

      <div v-for="(group, index) in subGroups" v-bind:key="index" class="nav-item shadow-sm col-12 mb-2" role="presentation">
        <div class="nav-link fs-3 main-group" :id=" 'pills-' + group.key + '-tab'" data-bs-toggle="pill" :data-bs-target="'#' + group.key" role="tab" aria-controls="pills-home" aria-selected="true"
             @click="tabLog(group.key)">
          {{ group.title }}</div>
      </div>
    </div>
    <div class="tab-content" id="pills-tabContent">
        <div class="tab-pane fade show active" :id="mainGroup.key"  @click="articleLog(mainGroup.key)">
          <MdvArticle v-for="(section, index) in mainGroup.sections" v-bind:key="index" small="true"
                      :image-url="section.image ? section.image.url : null"
                      :align="section.image ? section.image.align : null"
                      :title="section.title"
                      :texts="section.articles"/>
        </div>
        <div v-for="(group, index) in subGroups" v-bind:key="index" class="tab-pane fade" :id="group.key" >
          <MdvArticle v-for="(section, index) in group.sections" v-bind:key="index" small="true"
                      :image-url="section.image ? section.image.url : null"
                      :align="section.image ? section.image.align : null"
                      :title="section.title"
                      :texts="section.articles"/>
        </div>
    </div>

  </div>
</template>

<script>
import MdvArticle from "@/components/MdvArticle";
export default {
  name: "MdvGroups",
  components: {MdvArticle},
  props: {
    groups: Array
  },
  computed: {
    mainGroup() {
      return this.groups[0];
    },
    subGroups() {
      return this.groups.slice(1);
    }
  },
  methods: {
    articleLog(string) {
      console.log("from article " + string);
    },
    tabLog(string) {
      console.log("from tab" + string);
    }
  }
}
</script>

<style scoped>

.nav-link {
  font-family: 'Playfair Display', sans-serif;
  background: rgb(40, 29, 2, 0.9) !important;
  color: #fff !important;
  border-radius: 0 !important;
  border-color: #fff !important;
  box-shadow: none !important;
  cursor: pointer;
  -webkit-transition: all .2s;
  -moz-transition: all .2s;
  -o-transition: all .2s;
  transition: all .2s;
  transition-timing-function: ease;
  -moz-transition-timing-function: ease;
  -webkit-transition-timing-function: ease;
  -o-transition-timing-function: ease;

}
.nav-link.active, .nav-link:hover, .nav-link:focus, .nav-link:active  {
  background: #c3ac7d !important;
  color: #fff;
}
.nav-link:hover {
  background: #c3ac7d !important;
}
.subgroup {
  height: 6.5rem;
}

@media only screen and (max-width: 480px) {
  .subgroup {
    height: 9rem;
    font-size: 1.1rem !important;
  }
}

.main-group {
  min-width: 100% !important;
}

</style>
