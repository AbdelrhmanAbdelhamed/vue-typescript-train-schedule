<template>
  <div class="LineTrainTimeLine">
    <v-skeleton-loader
      class="mx-auto"
      max-width="800"
      type="card@3, article@3"
      v-if="
        loading || !trainTimelineStations || trainTimelineStations.length <= 0
      "
    ></v-skeleton-loader>
    <v-container>
      <v-row no-gutters justify="center">
        <v-card class="elevation-2" color="info" dark>
          <v-card-title class="title">
            <div>خط {{ line.name }}</div>
          </v-card-title>
          <v-card-subtitle v-if="line" class="pt-1">
            <div class="text-center">
              <strong
                >مسار قطار رقم {{ train.number | convertToArabic }}</strong
              >
            </div>
          </v-card-subtitle>
          <v-card-text>
            <v-dialog
              v-model="dialog"
              max-width="1000px"
              v-if="$can('update', 'Line')"
            >
              <template v-slot:activator="{ on }">
                <v-btn color="white" light v-on="on">تعديل</v-btn>
              </template>
              <v-card>
                <v-card-title class="pa-10">
                  <span class="headline"
                    >تعديل مسار قطار رقم {{ train.number }}</span
                  >
                  <span class="headline">بخط {{ line.name }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <EditLineStationsForm
                      :editedLineStations="editedLineStations"
                      :line="line"
                    />
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-card-actions right>
                    <v-btn color="success darken-1" text @click="update"
                      >حفظ</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="close"
                      >الغاء</v-btn
                    >
                  </v-card-actions>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>

    <v-timeline
      v-if="trainTimelineStations && trainTimelineStations.length > 0"
    >
      <v-timeline-item
        v-for="(station, index) in trainTimelineStations"
        :key="station.id"
        :color="index % 2 == 0 ? 'pink' : 'teal'"
        icon="mdi-train"
      >
        <v-card class="elevation-2" color="primary" dark>
          <v-card-title class="headline">
            {{ station.name }}
            <div v-if="index === 0" class="mx-2">(محطة القيام بالخط)</div>
            <div v-if="index === trainTimelineStations.length - 1" class="mx-2">
              (محطة الوصول بالخط)
            </div>
          </v-card-title>
          <v-card-subtitle v-if="line" class="pt-1">
            <v-container>
              <v-row no-gutters>
                <v-col cols="12" v-if="station.LineStationTrain.arrivalTime">
                  <strong
                    >وصول :
                    {{
                      station.LineStationTrain.arrivalTime
                        | formatTime
                        | convertToArabic
                    }}</strong
                  >
                </v-col>
                <v-col cols="12" v-if="station.LineStationTrain.departureTime">
                  <v-icon
                    v-if="
                      station.LineStationTrain.arrivalTime &&
                        station.LineStationTrain.departureTime
                    "
                    >mdi-arrow-left</v-icon
                  >
                  <strong
                    >قيام :
                    {{
                      station.LineStationTrain.departureTime
                        | formatTime
                        | convertToArabic
                    }}</strong
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-card-subtitle>
          <v-card-text>
            ترتيب المحطة بالخط:
            {{ station.LineStation.stationOrder | convertToArabic }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import EditLineStationsForm from "@/components/EditLineStationsForm.vue";

import LinesModule from "@/store/modules/Lines";
import TrainsModule from "@/store/modules/Trains";
import { ITrain, ILine } from "@/store/models";

@Component({
  components: { EditLineStationsForm }
})
export default class LineTrainTimeLine extends Vue {
  dialog = false;

  get loading() {
    return LinesModule.loading || TrainsModule.loading;
  }

  @Prop()
  lineId!: string;

  @Prop()
  id!: string;

  get line() {
    return LinesModule.currentLine;
  }

  get train() {
    return TrainsModule.currentTrain;
  }

  get editedLineStations() {
    if (TrainsModule.currentTrain.stations) {
      return TrainsModule.currentTrain.stations!.map(station => ({
        LineStation: { ...station.LineStation },
        LineStationTrain: { ...station.LineStationTrain },
        createdAt: station.createdAt,
        id: station.id,
        lineStationId: station.lineStationId,
        name: station.name,
        updatedAt: station.updatedAt
      }));
    }
    return [];
  }

  get trainTimelineStations() {
    if (TrainsModule.currentTrain.stations) {
      return TrainsModule.currentTrain.stations.filter(station => {
        return (
          station.LineStationTrain!.arrivalTime !== null ||
          station.LineStationTrain!.departureTime !== null
        );
      });
    }
    return [];
  }

  close() {
    this.dialog = false;
  }

  update() {
    TrainsModule.updateCurrentTrainLineStations({
      id: this.train.id!,
      editedStations: this.editedLineStations
    });
    this.close();
  }

  async created() {
    if (!this.$route.params.line && this.lineId) {
      const line = await LinesModule.getById(this.lineId);
    } else if (this.$route.params.line) {
      const line: any = this.$route.params.line;
      LinesModule.setCurrentLine(line);
    }
    if (!this.$route.params.train && this.id) {
      const train = await TrainsModule.getById(this.id);
    } else if (this.$route.params.train) {
      const train: any = this.$route.params.train;
      TrainsModule.setCurrentTrain(train);
    }
    await TrainsModule.getTrainLineStations({
      id: this.train.id!,
      lineId: this.line.id!
    });
  }
}
</script>
