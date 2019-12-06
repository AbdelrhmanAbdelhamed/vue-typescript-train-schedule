<template>
  <div id="train-actions" class="d-print-none">
    <v-btn
      color="info"
      small
      link
      outlined
      :to="{ name: `trains.run.details`, params: { id: train.id } }"
      >الرحلات</v-btn
    >

    <v-btn
      class="mx-2"
      color="primary"
      small
      link
      v-if="line"
      :to="{
        name: `trains.line.stations`,
        params: { lineId: line.id, id: train.id }
      }"
      >المواعيد</v-btn
    >

    <v-dialog
      v-if="actions.delete && $can('delete', 'Train')"
      v-model="dialog"
      persistent
      max-width="290"
    >
      <template v-slot:activator="{ on }">
        <v-icon class="mr-10" color="error" v-on="on">
          mdi-delete
        </v-icon>
      </template>
      <v-card>
        <v-card-title class="headline"
          >مسح قطار {{ train.number }}</v-card-title
        >
        <v-card-text>هل أنت متأكد انك تريد مسح القطار؟!</v-card-text>
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
import TrainsModule from "@/store/modules/Trains";
import UsersModule from "@/store/modules/Users";
import { ILine, ITrain } from "@/store/models";

@Component({
  components: {}
})
export default class TrainActions extends Vue {
  @Prop()
  train: any;

  @Prop()
  line: any;

  @Prop()
  actions!: { delete: boolean; details: boolean };

  dialog = false;

  async onDeleteClicked() {
    await TrainsModule.deleteTrainLine({
      id: this.train.id,
      lineId: this.line.id
    });
    this.dialog = false;
  }

  beforeCreated() {
    if (this.train && this.line) {
      TrainsModule.setCurrentTrain(this.train);
      TrainsModule.getTrainLineStations({
        id: this.train.id!,
        lineId: this.line.id!
      });
    }
  }
}
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
