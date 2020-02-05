<template>
  <v-list-item v-if="isVisible" :to="{ name: routeName }" link exact>
    <v-list-item-action>
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-action>

    <v-list-item-content>
      <v-list-item-title> {{ title }} </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { RouteConfig } from "vue-router/types/router";

@Component({
  components: {}
})
export default class MenuItem extends Vue {
  name = "MenuItem";

  @Prop()
  route!: RouteConfig;

  get isVisible() {
    if (
      this.route.meta &&
      (this.route.meta.visible === undefined || this.route.meta.visible)
    ) {
      return true;
    }
    return false;
  }

  get icon() {
    return this.route.meta.icon || "";
  }

  get routeName() {
    if (this.route.name) {
      return this.route.name;
    }
    return this.route.children && this.route.children.length > 0
      ? this.route.children.find(route => route.path == "")!.name
      : "";
  }

  get title() {
    return (
      this.route.meta.nameArabic ||
      (this.route.name
        ? this.route.name
            .toLowerCase()
            .split("-")
            .map(s => s.charAt(0).toUpperCase() + s.slice(1))
            .join(" ")
        : "")
    );
  }
}
</script>
