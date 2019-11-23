<template>
  <div class="home">
    <TrainsSearch />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import TrainsSearch from "@/components/TrainsSearch.vue";

@Component({
  components: {
    TrainsSearch
  }
})
export default class Home extends Vue {}
</script>
