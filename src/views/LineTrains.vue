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
        class="elevation-1"
        :search="search"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:top v-if="$can('create', 'Train')">
          <NewTrainForm :line="line" />
        </template>

        <template v-slot:item.number="{ item }">{{
          item.number | convertToArabic
        }}</template>

        <template v-slot:item.action="{ item }">
          <TrainActions
            :actions="{ delete: true, details: true }"
            :train="item"
            :line="line"
          />
        </template>
      </v-data-table>
    </v-card>
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

import { ILine } from "@/store/models";

@Component({
  components: { TrainActions, NewTrainForm, EditLineStationsForm }
})
export default class Trains extends Vue {
  headers = [
    { text: "رقم القطار", value: "number", sortable: true },
    { text: "", value: "action", sortable: false }
  ];
  search = "";

  get loading() {
    return LinesModule.loading;
  }

  @Prop()
  lineId!: string;

  get line() {
    return (this.$route.params.line || LinesModule.currentLine) as ILine;
  }

  get trains() {
    return this.line.trains || [];
  }

  async created() {
    if (!this.$route.params.line && this.lineId) {
      const line = await LinesModule.getById(this.lineId);
    } else if (this.$route.params.line) {
      const line: any = this.$route.params.line;
      LinesModule.setCurrentLine(line);
    }
    if (LinesModule.currentLine.stations) {
      const stations = [...LinesModule.currentLine.stations].map(station => {
        return {
          ...station,
          lineStationId: station.LineStation!.id,
          LineStationTrain: {
            lineId: this.line.id || this.lineId,
            arrivalTime: null,
            departureTime: null,
            isArrival: false,
            isDeprature: false,
            createdAt: null,
            updatedAt: null
          }
        };
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
