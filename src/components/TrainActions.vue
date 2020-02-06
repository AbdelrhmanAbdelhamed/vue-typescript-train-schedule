<template>
  <div id="train-actions" class="d-print-none">
    <v-btn
      v-if="line && $can('read', 'Station')"
      :to="{
        name: `trains.line.stations`,
        params: {
          lineId: line.id,
          id: train.id,
          departureStation: train.departureStation,
          arrivalStation: train.arrivalStation
        }
      }"
      class="mx-2"
      color="primary"
      small
      link
    >
      المواعيد
    </v-btn>

    <v-btn
      v-if="$can('read', train)"
      :to="{ name: `trains.run.details`, params: { id: train.id } }"
      color="info"
      small
      link
      outlined
    >
      الخدمات
    </v-btn>

    <v-dialog
      v-if="actions.delete && $can('delete', 'Train')"
      v-model="dialog"
      persistent
      max-width="290"
    >
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" class="mr-10" color="error">
          mdi-delete
        </v-icon>
      </template>
      <v-card>
        <v-card-title class="headline">
          مسح قطار {{ train.number }}
        </v-card-title>
        <v-card-text>هل أنت متأكد انك تريد مسح القطار؟!</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="onDeleteClicked" color="error" text>
            مسح
          </v-btn>
          <v-btn @click="dialog = false" text>
            الغاء
          </v-btn>
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
import TrainsModule from "@/store/modules/Trains";
import UsersModule from "@/store/modules/Users";
import { Line, Train } from "@/store/models";

@Component({
  components: {}
})
export default class TrainActions extends Vue {
  @Prop()
  train!: Train;

  @Prop()
  line: any;

  @Prop()
  actions!: { delete: boolean; details: boolean };

  dialog = false;

  async onDeleteClicked() {
    if (this.train.id && this.line.id) {
      await TrainsModule.deleteTrainLine({
        id: this.train.id,
        lineId: this.line.id
      });
      this.dialog = false;
    }
  }
}
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
