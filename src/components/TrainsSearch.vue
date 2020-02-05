<template>
  <v-container id="trains-search">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card :loading="loading" class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>استعلام عن القطارات</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-form v-model="validSearch">
              <v-autocomplete
                :rules="[v => !!v || 'برجاء اختيار المحطة']"
                :loading="loading"
                v-model="departureStation"
                :items="stations"
                required
                label="محطة القيام"
                item-value="name"
                item-text="name"
                prepend-icon="mdi-city"
              ></v-autocomplete>
              <div class="text-center">
                <v-btn @click="swapFormStations" text icon>
                  <v-icon>mdi-swap-vertical-bold</v-icon>
                </v-btn>
              </div>

              <v-autocomplete
                :rules="[v => !!v || 'برجاء اختيار المحطة']"
                :loading="loading"
                v-model="arrivalStation"
                :items="stations"
                required
                label="محطة الوصول"
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
              @click="getTrainsByStations()"
              color="primary"
              >استعلام</v-btn
            >
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title v-if="showTable && arrivalStation && departureStation">
            <p>قطارات محطات {{ departureStation }} - {{ arrivalStation }}</p>
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
            :loading="loading"
            :headers="headers"
            :items="trains"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:item.number="{ item }">{{
              item.number | convertToArabic
            }}</template>

            <template v-slot:item.action="{ item }">
              <TrainActions
                :actions="{ delete: false, details: true }"
                :train="item"
                :line="item.line"
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
import { Line, Train } from "@/store/models";

@Component({
  components: { TrainActions }
})
export default class TrainsSearch extends Vue {
  validSearch = false;

  headers = [
    { text: "رقم القطار", value: "number", sortable: true },
    { text: "", value: "action", sortable: false }
  ];
  search = "";

  get loading() {
    return TrainsModule.loading || StationsModule.loading;
  }

  toggleGroup(line: any, toggle: () => void) {
    line.hide = !line.hide;
    toggle();
  }

  swapFormStations() {
    if (this.departureStation && this.arrivalStation) {
      let temp = this.departureStation;
      this.departureStation = this.arrivalStation;
      this.arrivalStation = temp;
    }
  }

  getTrainsByStations() {
    this.showTable = true;
    TrainsModule.get({
      departureStation: this.departureStation,
      arrivalStation: this.arrivalStation
    });
  }

  get departureStation() {
    return TrainsModule.departureStation;
  }

  get arrivalStation() {
    return TrainsModule.arrivalStation;
  }

  set departureStation(departureStation: string) {
    TrainsModule.setDepartureStation(departureStation);
  }

  set arrivalStation(arrivalStation: string) {
    TrainsModule.setArrivalStation(arrivalStation);
  }

  get showTable() {
    return TrainsModule.showTable;
  }

  set showTable(showTable: boolean) {
    TrainsModule.setShowTable(showTable);
  }

  get trains(): Train[] {
    const trains: Train[] = [];
    TrainsModule.searchedTrains.forEach(train => {
      let trainItem: Train = new Train({
        ...train,
        lineName: "قطارات بدون خطوط بعد",
        line: {
          name: "قطارات بدون خطوط بعد",
          hide: false
        }
      });
      if (train.lines && train.lines.length > 0) {
        train.lines.forEach((line: any) => {
          if (
            line &&
            line.id &&
            line.name &&
            typeof line.name === "string" &&
            line.name.trim()
          ) {
            trainItem = new Train({
              ...train,
              lineName: line.name,
              line: { ...line, hide: false }
            });
          }
          trainItem.departureStation = this.departureStation;
          trainItem.arrivalStation = this.arrivalStation;
          trains.push(trainItem);
        });
      }
    });
    return trains;
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
.v-row-group__header {
  background: white !important;
}
</style>
