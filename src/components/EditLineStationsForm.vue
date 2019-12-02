<template>
  <v-form>
    <v-row justify="center" align="center">
      <v-expansion-panels inset focusable>
        <v-expansion-panel
          v-for="(station, index) in editedLineStations"
          :key="station.id"
        >
          <v-expansion-panel-header>
            <span class="subtitle-2">محطة {{ station.name }}</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row>
                <v-col>
                  <v-menu
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        :value="station.LineStationTrain.arrivalTime"
                        @click:clear="onArrivalTimeChange(index, null)"
                        label="وقت الوصول"
                        prepend-icon="mdi-clock"
                        readonly
                        clearable
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      format="24hr"
                      scrollable
                      ampm-in-title
                      full-width
                      @change="onArrivalTimeChange(index, $event)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>

                <v-divider vertical class="mr-2"></v-divider>

                <v-col>
                  <v-menu
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        :value="station.LineStationTrain.departureTime"
                        @click:clear="onDepartureTimeChange(index, null)"
                        label="وقت القيام"
                        prepend-icon="mdi-clock"
                        readonly
                        v-on="on"
                        clearable
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      format="24hr"
                      scrollable
                      ampm-in-title
                      full-width
                      @change="onDepartureTimeChange(index, $event)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-form>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import TrainsModule from "@/store/modules/Trains";
import { ITrain, ILine } from "../store/models";

@Component({
  components: {}
})
export default class EditLineStationsForm extends Vue {
  @Prop()
  line!: ILine;

  @Prop()
  editedLineStations: any;

  get loading() {
    return TrainsModule.loading;
  }

  updateEditedLineStations({ index, data }: { index?: any; data?: any }) {
    if (
      this.editedLineStations &&
      this.editedLineStations.length >= 0 &&
      index >= 0
    ) {
      if (data.departureTime === null || data.departureTime) {
        this.editedLineStations[index].LineStationTrain.departureTime =
          data.departureTime;
        this.editedLineStations[index].LineStationTrain.isDeprature =
          data.departureTime !== null;
      }

      if (data.arrivalTime === null || data.arrivalTime) {
        this.editedLineStations[index].LineStationTrain.arrivalTime =
          data.arrivalTime;
        this.editedLineStations[index].LineStationTrain.isArrival =
          data.arrivalTime !== null;
      }
    }
  }

  onDepartureTimeChange(index: any, value: any) {
    this.updateEditedLineStations({
      index,
      data: { departureTime: value }
    });
  }

  onArrivalTimeChange(index: any, value: any) {
    this.updateEditedLineStations({
      index,
      data: { arrivalTime: value }
    });
  }
}
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
