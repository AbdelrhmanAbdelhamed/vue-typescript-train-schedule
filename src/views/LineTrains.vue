<template>
  <div class="trains">
    <v-card>
      <v-card-title v-if="line">
        {{ `قطارت خط ${line.name}` }}
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-table-search"
          label="استعلام عن القطار"
          single-line
          hide-details
          clearable
          class="d-print-none"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="trains"
        :search="search"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:top v-if="line && $can('create', 'Train')">
          <NewTrainForm :line="line" />
        </template>

        <template v-slot:item.number="props">
          <v-edit-dialog
            @open="temporaryTrainNumber = props.item.number"
            @save="onEditSubmit(props.item.id, temporaryTrainNumber)"
          >
            {{ props.item.number | convertToArabic }}
            <template v-slot:input>
              <v-text-field
                :value="temporaryTrainNumber"
                v-if="$can('update', 'Train')"
                @change="onEditTrainNumberChange"
                label="تعديل رقم القطار"
                single-line
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.action="{ item }">
          <TrainActions
            :actions="{ delete: true, details: true }"
            :train="item"
            :line="line"
          />
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="0" top color="error">
      {{ updateTrainErrorMessage }}
      <v-btn @click="closeSnackbar" dark text>اغلاق</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import EditLineStationsForm from "@/components/EditLineStationsForm.vue";
import TrainActions from "@/components/TrainActions.vue";
import NewTrainForm from "@/components/NewTrainForm.vue";

import UsersModule from "@/store/modules/Users";
import LinesModule from "@/store/modules/Lines";
import TrainsModule from "@/store/modules/Trains";

import { Line, Train } from "@/store/models";

@Component({
  components: { TrainActions, NewTrainForm, EditLineStationsForm }
})
export default class LineTrains extends Vue {
  headers = [
    { text: "رقم القطار", value: "number", sortable: true },
    { text: "", value: "action", sortable: false }
  ];
  search = "";
  temporaryTrainNumber = "";

  get loading() {
    return LinesModule.loading;
  }

  get snackbar() {
    return TrainsModule.updateTrainErrorMessage !== null;
  }

  set snackbar(value: any) {
    this.snackbar = value;
  }

  get updateTrainErrorMessage() {
    return TrainsModule.updateTrainErrorMessage;
  }

  closeSnackbar() {
    TrainsModule.updateErrorMessage({
      updateTrainErrorMessage: null
    });
  }

  @Prop()
  lineId!: string;

  get line() {
    return LinesModule.currentLine;
  }

  get trains() {
    if (!LinesModule.currentLine.trains) LinesModule.currentLine.trains = [];
    return LinesModule.currentLine.trains.map(
      train =>
        new Train({
          ...train
        })
    );
  }

  onEditTrainNumberChange(value: any) {
    this.temporaryTrainNumber = value;
  }

  onEditSubmit(id: any, number: any) {
    if (number) TrainsModule.update({ id, data: { number } });
  }

  async created() {
    if (this.lineId) {
      await LinesModule.getTrains(this.lineId);
    }
    if (!LinesModule.currentLine.stations) {
      await LinesModule.getStations(this.lineId);
    }
    if (LinesModule.currentLine.stations) {
      const stations = [...LinesModule.currentLine.stations].map(station => {
        if (station && station.lines) {
          return {
            ...station,
            lineStationId: station.lines[0].LineStation!.id,
            LineStationTrain: {
              lineId: this.line.id || this.lineId,
              arrivalTime: null,
              departureTime: null,
              isArrival: false,
              isDeprature: false,
              lineStationId: station.lines[0].LineStation!.id
            }
          };
        }
      });
      TrainsModule.updateNewTrain({
        stations
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
