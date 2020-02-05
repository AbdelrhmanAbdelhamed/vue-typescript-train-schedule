<template>
  <div id="line-actions">
    <v-btn
      :to="{ name: `lines.stations`, params: { lineId: line.id } }"
      class="ml-2"
      color="info"
      small
      link
      outlined
      >المحطات</v-btn
    >
    <v-btn
      :to="{ name: `lines.trains`, params: { lineId: line.id } }"
      color="primary"
      small
      link
      >القطارات</v-btn
    >

    <v-dialog
      v-model="dialog"
      v-if="$can('delete', 'Line')"
      persistent
      max-width="290"
    >
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" class="mr-10" color="error">
          mdi-delete
        </v-icon>
      </template>
      <v-card>
        <v-card-title class="headline">مسح خط {{ line.name }}</v-card-title>
        <v-card-text>هل أنت متأكد انك تريد مسح الخط؟!</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="onDeleteClicked" color="error" text>مسح</v-btn>
          <v-btn @click="dialog = false" text>الغاء</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import LinesModule from "@/store/modules/Lines";
import UsersModule from "@/store/modules/Users";

@Component({
  components: {}
})
export default class LineActions extends Vue {
  @Prop()
  line: any;

  dialog = false;

  onDeleteClicked() {
    LinesModule.delete(this.line.id);
    this.dialog = false;
  }
}
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
