<template>
  <div class="LineTrainTimeLine">
    <v-skeleton-loader
      class="mx-auto"
      max-width="600"
      type="card@3"
      v-if="trainsLoading || !trainTimelineStations"
    ></v-skeleton-loader>
    <v-container v-if="!trainsLoading && !!trainTimelineStations">
      <v-row no-gutters justify="center">
        <v-card
          :loading="linesLoading ? 'secondary' : false"
          class="elevation-2"
          color="info"
          dark
        >
          <v-card-title v-if="!linesLoading && line" class="title">
            <div>خط {{ line.name }}</div>
          </v-card-title>
          <v-card-subtitle class="pt-1">
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
                  <span class="headline">
                    تعديل مسار قطار رقم
                    <span class="ma-2">{{ train.number }}</span>
                  </span>
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
      v-if="
        !trainsLoading &&
          !!trainTimelineStations &&
          trainTimelineStations.length > 0
      "
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
            <div
              v-if="station.LineStationTrain.departureTime && index === 0"
              class="mx-2"
            >
              (محطة القيام بالخط)
            </div>
            <div
              v-if="
                station.LineStationTrain.arrivalTime &&
                  index === trainTimelineStations.length - 1
              "
              class="mx-2"
            >
              (محطة الوصول بالخط)
            </div>
          </v-card-title>
          <v-card-subtitle v-if="line" class="pt-1">
            <v-container>
              <v-row no-gutters>
                <v-col cols="12" v-if="station.LineStationTrain.arrivalTime">
                  <strong>
                    وصول :
                    {{
                      station.LineStationTrain.arrivalTime
                        | formatTime
                        | convertToArabic
                    }}
                  </strong>
                </v-col>
                <v-col cols="12" v-if="station.LineStationTrain.departureTime">
                  <v-icon
                    v-if="
                      station.LineStationTrain.arrivalTime &&
                        station.LineStationTrain.departureTime
                    "
                    >mdi-arrow-left</v-icon
                  >
                  <strong>
                    قيام :
                    {{
                      station.LineStationTrain.departureTime
                        | formatTime
                        | convertToArabic
                    }}
                  </strong>
                </v-col>
              </v-row>
            </v-container>
          </v-card-subtitle>
          <v-card-text v-if="station.LineStation">
            ترتيب المحطة بالخط:
            {{ station.LineStation.stationOrder | convertToArabic }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    <v-row
      v-if="
        !trainsLoading &&
          (!trainTimelineStations ||
            (!!trainTimelineStations && trainTimelineStations.length <= 0))
      "
      align="center"
      justify="center"
    >
      <v-card color="info" dark>
        <v-card-title class="title dark">لا توجد بيانات متاحة</v-card-title>
      </v-card>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import EditLineStationsForm from "@/components/EditLineStationsForm.vue";

import LinesModule from "@/store/modules/Lines";
import TrainsModule from "@/store/modules/Trains";
import { ITrain, ILine, IStation } from "@/store/models";

@Component({
  components: { EditLineStationsForm }
})
export default class LineTrainTimeLine extends Vue {
  dialog = false;

  get trainsLoading() {
    return TrainsModule.loading;
  }

  get linesLoading() {
    return LinesModule.loading;
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
    if (LinesModule.currentLine.stations) {
      const stations: any = [...LinesModule.currentLine.stations].map(
        station => {
          if (TrainsModule.currentTrain.stations) {
            const trainStation: any = TrainsModule.currentTrain.stations.find(
              trainStation => trainStation.id === station.id
            );
            if (trainStation) {
              return {
                LineStation: { ...trainStation.LineStation },
                LineStationTrain: { ...trainStation.LineStationTrain },
                createdAt: trainStation.createdAt,
                id: trainStation.id,
                lineStationId: trainStation.lineStationId,
                name: trainStation.name,
                updatedAt: trainStation.updatedAt
              };
            } else {
              return {
                ...station,
                LineStation: station.lines![0].LineStation,
                lineStationId: station.lines![0].LineStation!.id,
                LineStationTrain: {
                  lineId: this.line.id || this.lineId,
                  arrivalTime: null,
                  departureTime: null,
                  isArrival: false,
                  isDeprature: false,
                  lineStationId: station.lines![0].LineStation!.id
                }
              };
            }
          }
        }
      );
      return stations;
    }
    return [];
  }

  get trainTimelineStations() {
    if (TrainsModule.currentTrain.stations) {
      return TrainsModule.currentTrain.stations
        .filter(station => {
          return (
            station.LineStationTrain!.arrivalTime !== null ||
            station.LineStationTrain!.departureTime !== null
          );
        })
        .sort((stationA: IStation, stationB: IStation) => {
          return (
            stationA.LineStation!.stationOrder -
            stationB.LineStation!.stationOrder
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
    if (this.id && this.lineId) {
      await TrainsModule.getById(this.id);
      await TrainsModule.getTrainLineStations({
        id: this.id!,
        lineId: this.lineId!
      });
      await LinesModule.getStations(this.lineId);
    }
  }
}
</script>
