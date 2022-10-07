<template>
  <div class="container">

    <ul class="nav nav-pills nav-justified mb-3" id="pills-tab" role="tablist">
      <li v-for="(group, index) in groups" v-bind:key="index" class="nav-item" role="presentation">
        <div class="nav-link" :class="index === 0 ? 'active' : ''" :id=" 'pills-' + group.key + '-tab'" data-bs-toggle="pill" :data-bs-target="'#' + group.key" role="tab" aria-controls="pills-home" aria-selected="true">
          {{ group.title }}</div>
      </li>
    </ul>
    <div class="tab-content" id="pills-tabContent">
        <div v-for="(group, index) in groups" v-bind:key="index" class="tab-pane fade" :class="index === 0 ? 'show active' : ''" :id="group.key" >
          <MdvArticle v-for="(section, index) in group.sections" v-bind:key="index"
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
  props: ['groups']
}
</script>

<style scoped>

.nav-link {
  font-family: 'Bubbler One', sans-serif;
  background: #59411a !important;
  color: #fff !important;
  font-size: 2rem;
  border-radius: 0 !important;
  border-color: #fff !important;
  box-shadow: none !important;
  cursor: pointer;
  -webkit-transition: all .2s;
  -moz-transition: all .2s;
  -o-transition: all .2s;
  transition: all .2s;
  transition-timing-function: ease-in-out;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;

}
.nav-link.active, .nav-link:hover, .nav-link:focus, .nav-link:active  {
  background: #c3ac7d !important;
  color: #fff;
}
.nav-link:hover {
  background: #c3ac7d !important;
}
</style>