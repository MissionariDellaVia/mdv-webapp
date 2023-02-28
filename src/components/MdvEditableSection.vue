<template>
  <section>
    <base-dialog
        :show="!!dialog.show"
        :value="dialog.val"
        :index="dialog.index"
        @update-article="handleArticle"
        @close="cleanOpenDialog"
    />
      <div class="card my-3">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <p class="flex-grow-1 fs-5">
              <span class="fw-bold">Titolo:</span>
              {{ title }}&nbsp;
              <i v-if="title" class="fa-solid fa-pen"></i>
              <i v-else class="fa-solid fa-plus"></i>
            </p>
            <p class="flex-grow-2 fs-5 fw-bold">
            {{ articles.length }} Articoli
            </p>
          </div>

          <div class="row article my-1 align-items-center " v-for="(text, index) in articles" v-bind:key="index" >
            <div class="col-10 text-start ">
              <Markdown class="my-auto" :source="text"></Markdown>
            </div>
            <div class="col-2 text-end">
              <i v-if="text" class="fa-solid fa-pen" @click="openDialog(text, index)"></i>
            </div>
          </div>

        </div>
      </div>
  </section>
</template>

<script>
import Markdown from 'vue3-markdown-it';

export default {
  name: "MdvEditableSection",
  components: {Markdown},
  props: ['title', 'articles', 'image', 'groupKey'],
  emits: ['update-data'],
  data(){
    return {
      helper: this.$util,
      dialog: {
        show: false,
        index: null,
        val: ''
      },

    }
  },
  methods: {
    handleArticle(text, index) {
      const formData = {
        articleIndex: index,
        article: text,
      };

      console.log(JSON.stringify(formData))

      this.$emit('update-data', formData);
    },
    openDialog(value, index) {
      this.dialog.val = value;
      this.dialog.index = index;
      this.dialog.show = true;
    },
    cleanOpenDialog(emittedValue) {
      this.dialog.val = '';
      this.dialog.index = null;
      this.dialog.show = false;
      console.log(emittedValue)
    }
  }
}
</script>

<style scoped>
.card {
  color: #c4bfb4;
  border: 0;
  background-color: rgb(99, 84, 63);
}
p {
  font-family: 'Old Standard TT', sans-serif;
  font-size: 1rem;
}
h4 {
  font-family: 'Playfair Display', sans-serif;
}
i {
  color: #c3ac7d;
  cursor: pointer;
}
.fa-plus:hover, .fa-plus:focus {
  color: #0c9617;
}
.fa-pen:hover, .fa-pen:focus {
  color: #eca61c;
}
.article{
  background-color: #544838;
}
.article:hover{
  background-color: #6c5e4e;
}
</style>