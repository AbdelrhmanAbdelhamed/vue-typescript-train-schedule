<template>
  <div class="stations-timeline">
    <v-timeline v-if="stations && stations.length > 0">
      <v-timeline-item
        v-for="(station, index) in stations"
        :key="station.id"
        :color="index % 2 == 0 ? 'pink' : 'teal'"
        icon="mdi-train"
      >
        <v-card class="elevation-2" color="primary" dark>
          <v-card-title class="headline">{{ station.name }}</v-card-title>
          <v-card-subtitle v-if="line" class="pt-1">
            <v-chip small color="info">
              <strong> خط: {{ line.name }} </strong>
            </v-chip>
          </v-card-subtitle>
          <v-card-text v-if="station.LineStation">
            ترتيب المحطة:
            {{ station.LineStation.stationOrder | convertToArabic }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    <v-row v-else align="center" justify="center">
      <v-card color="primary" dark>
        <v-card-title>
          {{ ` محطات خط: ${line ? line.name : ""}` }}
        </v-card-title>
        <v-card-subtitle> لا توجد بيانات متاحة </v-card-subtitle>
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
import { ILine } from "@/store/models";

@Component({
  components: {}
})
export default class LineStations extends Vue {
  @Prop()
  lineId!: string;

  get line() {
    return (this.$route.params.line || LinesModule.currentLine) as ILine;
  }

  get loading() {
    return LinesModule.loading;
  }

  get stations() {
    return this.line.stations || [];
  }

  created() {
    if (!this.$route.params.line && this.lineId) {
      LinesModule.getById(this.lineId);
    }
  }
}
</script>
