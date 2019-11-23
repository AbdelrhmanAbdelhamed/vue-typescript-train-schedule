<template>
  <v-container id="trains-search">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12" :loading="loading">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>استعلام عن القطارات</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-form v-model="validSearch">
              <v-autocomplete
                :rules="[v => !!v || 'برجاء اختيار المحطة']"
                required
                :loading="loading"
                v-model="fromStation"
                label="من"
                :items="stations"
                item-value="name"
                item-text="name"
                prepend-icon="mdi-city"
              ></v-autocomplete>
              <v-autocomplete
                :rules="[v => !!v || 'برجاء اختيار المحطة']"
                required
                :loading="loading"
                v-model="toStation"
                label="الى"
                :items="stations"
                item-value="name"
                item-text="name"
                prepend-icon="mdi-city"
              ></v-autocomplete>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="!validSearch"
              :loading="loading"
              color="primary"
              @click="getTrainsByStations()"
              >استعلام</v-btn
            >
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title v-if="showTable && toStation && fromStation">
            <p>قطارات محطات {{ toStation }} - {{ fromStation }}</p>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-table-search"
              label="استعلام عن القطار"
              single-line
              hide-details
              clearable
            ></v-text-field>
          </v-card-title>
          <v-data-table
            v-if="showTable"
            item-key="number+line.name"
            class="elevation-1"
            :headers="headers"
            :items="trains"
            :search="search"
          >
            <template v-slot:item.number="{ item }">
              {{ item.number | convertToArabic }}
            </template>

            <template v-slot:item.action="{ item }">
              <TrainActions
                :actions="{ delete: false, details: true }"
                :train="item"
              />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import TrainActions from "@/components/TrainActions.vue";
import StationsModule from "@/store/modules/Stations";
import TrainsModule from "@/store/modules/Trains";
import { ILine, ITrain } from "@/store/models";

@Component({
  components: { TrainActions }
})
export default class TrainsSearch extends Vue {
  fromStation: string = "";
  toStation: string = "";
  showTable = false;
  validSearch = false;

  headers = [
    { text: "رقم القطار", value: "number", sortable: true },
    { text: "الخط التابع له", value: "line.name", sortable: true },
    { text: "", value: "action", sortable: false }
  ];
  search = "";

  get loading() {
    return TrainsModule.loading || StationsModule.loading;
  }

  getTrainsByStations() {
    this.showTable = true;
    TrainsModule.get({
      fromStation: this.fromStation,
      toStation: this.toStation
    });
  }

  get trains() {
    return TrainsModule.trains;
  }

  get stations() {
    return StationsModule.stations;
  }

  beforeCreate() {
    StationsModule.getAll();
  }
}
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
