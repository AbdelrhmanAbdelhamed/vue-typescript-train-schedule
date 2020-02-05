<template>
  <div id="line-actions" class="d-print-none">
    <v-dialog
      v-model="dialog"
      v-if="$can('delete', 'Station')"
      persistent
      max-width="290"
    >
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" class="mr-10" color="error">mdi-delete</v-icon>
      </template>
      <v-card>
        <v-card-title class="headline">
          <span>مسح محطة {{ station.name }}</span>
          <span>الخاصة بخط {{ station.lineName }}</span>
        </v-card-title>
        <v-card-text>هل أنت متأكد انك تريد مسح المحطة؟!</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="onDeleteClicked" color="error" text>مسح</v-btn>
          <v-btn @click="dialog = false" text>الغاء</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="0" top color="error">
      {{ deleteStationErrorMessage }}
      <v-btn @click="closeSnackbar" dark text>اغلاق</v-btn>
    </v-snackbar>
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
export default class StationActions extends Vue {
  @Prop()
  station: any;
  dialog = false;

  get snackbar() {
    return StationsModule.deleteStationErrorMessage !== null;
  }

  set snackbar(value: any) {
    this.snackbar = value;
  }

  get deleteStationErrorMessage() {
    return StationsModule.deleteStationErrorMessage;
  }

  closeSnackbar() {
    StationsModule.updateErrorMessage({
      deleteStationErrorMessage: null
    });
  }

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
