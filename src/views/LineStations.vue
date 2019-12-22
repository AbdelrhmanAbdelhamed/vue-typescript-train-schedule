<template>
  <div class="stations-timeline">
    <v-skeleton-loader
      class="mx-auto"
      max-width="600"
      type="card@3"
      v-if="loading || !stations"
    ></v-skeleton-loader>
    <v-container v-if="!loading || !stations">
      <v-row no-gutters justify="center">
        <v-card class="elevation-2" color="info" dark>
          <v-card-title v-if="!loading && line" class="title">
            <div>خط {{ line.name }}</div>
          </v-card-title>
          <v-card-subtitle class="pt-1">
            <div class="text-center">
              <strong>المحطات</strong>
            </div>
          </v-card-subtitle>
        </v-card>
      </v-row>
    </v-container>
    <v-timeline v-if="stations && stations.length > 0">
      <v-timeline-item
        v-for="(station, index) in stations"
        :key="station.id"
        :color="index % 2 == 0 ? 'pink' : 'teal'"
        icon="mdi-train"
      >
        <v-card class="elevation-2" color="primary" dark>
          <v-card-title class="headline">{{ station.name }}</v-card-title>
          <v-card-subtitle
            v-if="station.lines && station.lines.length > 0"
            class="pt-1"
          >
          </v-card-subtitle>
          <v-card-subtitle
            v-if="
              station.lines &&
                station.lines.length > 0 &&
                station.lines[0].LineStation
            "
          >
            ترتيب المحطة:
            {{ station.lines[0].LineStation.stationOrder | convertToArabic }}
          </v-card-subtitle>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    <v-row v-else align="center" justify="center">
      <v-card color="primary" dark>
        <v-card-title>{{ ` محطات خط: ${line ? line.name : ""}` }}</v-card-title>
        <v-card-subtitle class="text-center"
          >لا توجد بيانات متاحة</v-card-subtitle
        >
      </v-card>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import StationsModule from "@/store/modules/Stations";
import LinesModule from "@/store/modules/Lines";
import { Line } from "@/store/models";

@Component({
  components: {}
})
export default class LineStations extends Vue {
  @Prop()
  lineId!: string;

  get line() {
    return LinesModule.currentLine;
  }

  get loading() {
    return LinesModule.loading;
  }

  get stations() {
    return this.line.stations || [];
  }

  created() {
    if (this.lineId) {
      LinesModule.getStations(this.lineId);
    }
  }
}
</script>
