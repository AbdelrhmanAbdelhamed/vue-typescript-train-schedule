<template>
  <div id="line-actions" class="d-print-none">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
      v-if="$can('delete', 'Station')"
    >
      <template v-slot:activator="{ on }">
        <v-icon class="mr-10" color="error" v-on="on">mdi-delete</v-icon>
      </template>
      <v-card>
        <v-card-title class="headline">
          <span>مسح محطة {{ station.name }}</span>
          <span>الخاصة بخط {{ station.lineName }}</span>
        </v-card-title>
        <v-card-text>هل أنت متأكد انك تريد مسح المحطة؟!</v-card-text>
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

import StationsModule from "@/store/modules/Stations";
import UsersModule from "@/store/modules/Users";

@Component({
  components: {}
})
export default class LineActions extends Vue {
  @Prop()
  station: any;
  dialog = false;

  onDeleteClicked() {
    StationsModule.deleteLine({
      id: this.station.id,
      lineId: this.station.line.id
    });
    this.dialog = false;
  }
}
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
