<template>
  <div id="line-actions">
    <v-btn
      class="ml-2"
      color="info"
      small
      link
      outlined
      :to="{ name: `lines.stations`, params: { lineId: line.id } }"
      >المحطات</v-btn
    >
    <v-btn
      color="primary"
      small
      link
      :to="{ name: `lines.trains`, params: { lineId: line.id } }"
      >القطارات</v-btn
    >

    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
      v-if="$can('delete', 'Line')"
    >
      <template v-slot:activator="{ on }">
        <v-icon class="mr-10" color="error" v-on="on">
          mdi-delete
        </v-icon>
      </template>
      <v-card>
        <v-card-title class="headline">مسح خط {{ line.name }}</v-card-title>
        <v-card-text>هل أنت متأكد انك تريد مسح الخط؟!</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="onDeleteClicked">مسح</v-btn>
          <v-btn text @click="dialog = false">الغاء</v-btn>
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
