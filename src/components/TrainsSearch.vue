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
            <v-form
              id="train-search-form"
              @submit.prevent="onSearchClick"
              v-model="validSearch"
            >
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
              />
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
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="!validSearch"
              :loading="loading"
              type="submit"
              form="train-search-form"
              color="primary"
            >
              استعلام
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title v-if="showTable && arrivalStation && departureStation">
            <p>قطارات محطات {{ departureStation }} - {{ arrivalStation }}</p>
            <v-spacer />
            <v-text-field
              v-model="search"
              @click:clear="
                search = '';
                searchFromDate = '';
              "
              append-icon="mdi-table-search"
              label="بحث برقم القطار"
              single-line
              hide-details
              clearable
            />
            <v-menu
              ref="searchFromDateMenu"
              v-model="searchFromDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
              class="d-print-none"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="searchFromDateFormatted"
                  v-on="on"
                  @click:clear="
                    search = '';
                    searchFromDate = '';
                  "
                  hide-details
                  clearable
                  readonly
                  label="استعلام بوقت القيام"
                  append-icon="mdi-calendar-search"
                  class="d-print-none"
                />
              </template>
              <v-time-picker
                v-model="searchFromDate"
                @change="onFromSearchInput"
                @click:clear="search = ''"
                scrollable
                ampm-in-title
                full-width
                class="d-print-none"
              />
            </v-menu>
          </v-card-title>

          <v-data-table
            v-if="showTable"
            :loading="loading"
            :headers="headers"
            :items="trains"
            :search="search"
            :footer-props="{
              showFirstLastPage: true
            }"
            :custom-filter="filterTrains"
            :custom-sort="customSort"
            sort-by="departureStation.departureTime"
            class="elevation-1"
          >
            <template v-slot:item.number="{ item }">
              {{ item.number | convertToArabic }}
            </template>

            <template v-slot:item.departureStation.departureTime="{ item }">
              {{
                item.departureStation.departureTime
                  ? item.departureStation.departureTime
                  : item.departureStation.arrivalTime
                    | formatTime
                    | convertToArabic
              }}
            </template>

            <template v-slot:item.crossedNextDay="{ item }">
              {{ item.crossedNextDay ? "اليوم التالي" : "ذات اليوم" }}
            </template>

            <template v-slot:item.arrivalStation.arrivalTime="{ item }">
              {{
                item.arrivalStation.arrivalTime
                  ? item.arrivalStation.arrivalTime
                  : item.arrivalStation.departureTime
                    | formatTime
                    | convertToArabic
              }}
            </template>

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
import { Line, Train, Station } from "@/store/models";

import { convertToArabic, convertToEnglish, formatTime, moment } from "@/utils";
import orderBy from "lodash";

@Component({
  components: { TrainActions }
})
export default class TrainsSearch extends Vue {
  validSearch = false;
  searchFromDate = "";
  searchFromDateMenu: boolean = false;

  get searchFromDateFormatted() {
    return this.searchFromDate
      ? convertToArabic(formatTime(this.searchFromDate))
      : "";
  }

  onFromSearchInput(value: any) {
    this.searchFromDateMenu = false;
    this.search = value;
  }

  headers = [
    { text: "رقم القطار", value: "number", sortable: true },
    {
      text: "وقت القيام",
      value: "departureStation.departureTime",
      sortable: true
    },
    {
      text: "تاريخ الوصول",
      value: "crossedNextDay",
      sortable: true
    },
    {
      text: "وقت الوصول",
      value: "arrivalStation.arrivalTime",
      sortable: true
    },

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

  filterTrains(value: any, search: string, item: any) {
    if (value != null && search != null) {
      const dateFormat = "HH:mm:ss";
      const fromDateFormatted = moment(new Date(value)).format(dateFormat);
      const isValidDate = moment(fromDateFormatted, dateFormat, true).isValid();
      if (
        (typeof value === "string" || typeof value === "number") &&
        !isValidDate &&
        !this.searchFromDate
      ) {
        return (
          value
            .toString()
            .toLocaleLowerCase()
            .indexOf(search.toLocaleLowerCase()) !== -1 ||
          item.number
            .toString()
            .toLocaleLowerCase()
            .indexOf(search.toLocaleLowerCase()) !== -1
        );
      } else if (isValidDate && this.searchFromDate) {
        const arrivalTime =
          item.departureStation!.departureTime ||
          item.departureStation!.arrivalTime;
        return moment(arrivalTime, dateFormat).isSameOrAfter(
          moment(this.searchFromDate, dateFormat)
        );
      }
    } else {
      return false;
    }
  }

  customSort(
    items: any[],
    sortByKeys: string[],
    sortDescValues: boolean[],
    locale: string
  ): any[] {
    const [sortKey] = sortByKeys;
    const [sortDescValue] = sortDescValues;
    return items.sort((itemA: any, itemB: any) => {
      if (sortKey == "departureStation.departureTime") {
        const sortKeyA =
          itemA.departureStation.departureTime ??
          itemA.departureStation.arrivalTime;

        const sortKeyB =
          itemB.departureStation.departureTime ??
          itemB.departureStation.arrivalTime;

        const timeA = moment.utc(sortKeyA, "HH:mm:ss");
        const timeB = moment.utc(sortKeyB, "HH:mm:ss");

        return sortDescValue ? timeB.diff(timeA) : timeA.diff(timeB);
      } else if (sortKey == "arrivalStation.arrivalTime") {
        const sortKeyA =
          itemA.arrivalStation.arrivalTime ??
          itemA.arrivalStation.departureTime;

        const sortKeyB =
          itemB.arrivalStation.arrivalTime ??
          itemB.arrivalStation.departureTime;

        const timeA = moment.utc(sortKeyA, "HH:mm:ss");
        const timeB = moment.utc(sortKeyB, "HH:mm:ss");

        return sortDescValue
          ? Number(itemB.crossedNextDay) - Number(itemA.crossedNextDay) ||
              timeB.diff(timeA)
          : Number(itemA.crossedNextDay) - Number(itemB.crossedNextDay) ||
              timeA.diff(timeB);
      } else {
        return sortDescValue
          ? itemB[sortKey] - itemA[sortKey]
          : itemA[sortKey] - itemB[sortKey];
      }
    });
  }

  onSearchClick() {
    this.getTrainsByStations();
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
