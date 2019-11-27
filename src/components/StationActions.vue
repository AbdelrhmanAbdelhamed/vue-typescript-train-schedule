<template>
  <div id="line-actions">
    <v-dialog v-model="dialog" persistent max-width="290" v-if="isAdmin">
      <template v-slot:activator="{ on }">
        <v-icon class="mr-10" color="error" v-on="on">
          mdi-delete
        </v-icon>
      </template>
      <v-card>
        <v-card-title class="headline"
          >مسح محطة {{ station.name }}</v-card-title
        >
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

  get isAdmin() {
    return UsersModule.currentUser.isAdmin;
  }

  onDeleteClicked() {
    const preStations = [...StationsModule.stations];
    if (preStations.filter(s => s.id === this.station.id).length > 1) {
      StationsModule.deleteLine({
        id: this.station.id,
        lineId: this.station.line.id
      });
    } else {
      StationsModule.delete(this.station.id);
    }
    this.dialog = false;
  }
}
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
