<template>
  <div class="trainRuns">
    <v-card>
      <v-card-title>
        جميع الخدمات
        <v-spacer />
        <v-menu
          ref="searchDateMenu"
          v-model="searchDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
          class="d-print-none"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :value="searchDateFormatted"
              v-on="on"
              @click:clear="searchDate = ''"
              hide-details
              clearable
              readonly
              label="استعلام بتاريخ الخدمة"
              append-icon="mdi-calendar-search"
              class="d-print-none"
            />
          </template>
          <v-date-picker
            v-model="searchDate"
            @click:clear="searchDate = ''"
            @input="onDaySearchInput"
            scrollable
            no-title
            class="d-print-none"
          />
        </v-menu>
        <v-spacer />
        <v-autocomplete
          :loading="loading"
          v-model="searchTrainNumber"
          :items="trains"
          item-value="number"
          item-text="number"
          prepend-icon="mdi-table-search"
          label="استعلام برقم القطار"
          single-line
          hide-details
          clearable
          class="d-print-none"
        >
          <template v-slot:item="{ item }">
            {{ item.number | convertToArabic }}
          </template>
        </v-autocomplete>

        <v-spacer />

        <v-text-field
          v-model="searchTrainPeople"
          @click:clear="searchTrainPeople = ''"
          append-icon="mdi-table-search"
          label="استعلام بأفراد التأمين"
          single-line
          hide-details
          clearable
          class="d-print-none"
        />

        <v-spacer />
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
              @click:clear="searchFromDate = ''"
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
            @click:clear="searchFromDate = ''"
            scrollable
            ampm-in-title
            full-width
            class="d-print-none"
          />
        </v-menu>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="trainRuns"
        :footer-props="{
          showFirstLastPage: true
        }"
        :sort-desc="true"
        :group-desc="true"
        group-by="trainNumber"
        sort-by="day"
        class="elevation-1"
      >
        <template v-slot:top v-if="$can('read', 'TrainRunRevision')">
          <div class="mx-4 d-print-none">
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
            <v-btn
              :to="{
                name: `runs.revisions`
              }"
              color="primary"
              dark
              class="mb-2"
              link
            >
              سجل جميع الخدمات
            </v-btn>
          </div>
        </template>

        <template
          v-slot:group.header="{ items: [trainGroup], headers, group, toggle }"
        >
          <thead>
            <th class="pointer">
              <span @click="toggleGroup(trainGroup.train, toggle)">
                <v-icon>
                  {{ trainGroup.train.hide ? "mdi-plus" : "mdi-minus" }}
                </v-icon>
              </span>
              <v-chip
                :to="{
                  name: `trains.run.details`,
                  params: { id: trainGroup.train.id }
                }"
                link
                class="pointer"
                color="info"
              >
                قطار رقم:
                {{ trainGroup.train.number | convertToArabic }}
              </v-chip>
            </th>
          </thead>
        </template>

        <template v-slot:item.day="{ item }">
          {{ item.day | formatDayDate | convertToArabic }}
        </template>

        <template v-slot:item.policePeople="{ item }">
          <div v-for="policePerson in item.policePeople" :key="policePerson.id">
            <v-spacer />
            {{ policePerson.rank.name }}
            / {{ policePerson.name }} -
            {{ policePerson.policeDepartment.name }} -
            {{ policePerson.phoneNumber | convertToArabic }} من محطة:
            {{ policePerson.TrainRunPolicePerson.fromStation.name }}
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-chip
                    :color="
                      timeChipColor(
                        item.day,
                        policePerson.TrainRunPolicePerson.fromStation
                          .LineTrainStation.departureTime ||
                          policePerson.TrainRunPolicePerson.fromStation
                            .LineTrainStation.arrivalTime
                      )
                    "
                  >
                    قيام:
                    {{
                      policePerson.TrainRunPolicePerson.fromStation
                        .LineTrainStation.departureTime
                        ? policePerson.TrainRunPolicePerson.fromStation
                            .LineTrainStation.departureTime
                        : policePerson.TrainRunPolicePerson.fromStation
                            .LineTrainStation.arrivalTime
                          | formatTime
                          | convertToArabic
                    }}
                  </v-chip>
                </span>
              </template>
              {{
                `${item.day} 
                ${
                  policePerson.TrainRunPolicePerson.fromStation.LineTrainStation
                    .departureTime
                    ? policePerson.TrainRunPolicePerson.fromStation
                        .LineTrainStation.departureTime
                    : policePerson.TrainRunPolicePerson.fromStation
                        .LineTrainStation.arrivalTime
                }` | timeFromNow(false)
              }}
            </v-tooltip>
            الى محطة:
            {{ policePerson.TrainRunPolicePerson.toStation.name }}
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-chip
                    :color="
                      timeChipColor(
                        item.day,
                        policePerson.TrainRunPolicePerson.toStation
                          .LineTrainStation.arrivalTime ||
                          policePerson.TrainRunPolicePerson.toStation
                            .LineTrainStation.departureTime
                      )
                    "
                  >
                    وصول:
                    {{
                      policePerson.TrainRunPolicePerson.toStation
                        .LineTrainStation.arrivalTime
                        ? policePerson.TrainRunPolicePerson.toStation
                            .LineTrainStation.arrivalTime
                        : policePerson.TrainRunPolicePerson.toStation
                            .LineTrainStation.departureTime
                          | formatTime
                          | convertToArabic
                    }}
                  </v-chip>
                </span>
              </template>
              {{
                `${item.day} 
                ${
                  policePerson.TrainRunPolicePerson.toStation.LineTrainStation
                    .arrivalTime
                    ? policePerson.TrainRunPolicePerson.toStation
                        .LineTrainStation.arrivalTime
                    : policePerson.TrainRunPolicePerson.toStation
                        .LineTrainStation.departureTime
                }` | timeFromNow(false)
              }}
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import TrainsModule from "@/store/modules/Trains";
import { TrainRun, PolicePerson } from "@/store/models";
import { convertToArabic, formatDayDate, formatTime, moment } from "@/utils";

@Component({
  components: {}
})
export default class TrainRuns extends Vue {
  searchFromDate = "";
  searchFromDateMenu: boolean = false;

  get searchFromDateFormatted() {
    return this.searchFromDate
      ? convertToArabic(formatTime(this.searchFromDate))
      : "";
  }

  onFromSearchInput(value: any) {
    this.searchFromDateMenu = false;
  }

  get headers() {
    return [
      {
        text: "تاريخ الخدمة",
        value: "day",
        sortable: true,
        filter: this.filterDay
      },
      {
        text: "أفراد التأمين",
        value: "policePeople",
        sortable: true,
        filter: this.filterTrainRuns
      }
    ];
  }
  dialog: boolean = false;
  isNewLineValid = false;
  searchDate = "";
  searchTrainPeople = "";
  searchDateMenu: boolean = false;
  searchTrainNumber = "";

  timeChipColor(day, time) {
    const isPast = moment().isAfter(
      moment(`${day} ${time}`, "YYYY-MM-DD HH:mm:ss")
    );
    const isToday = moment().isSame(moment(day, "YYYY-MM-DD"), "day");

    return isToday && !isPast ? "success" : isPast ? "error" : "info";
  }

  get trainRuns() {
    return TrainsModule.trainRuns.map(trainRun => {
      return {
        ...trainRun,
        trainNumber: trainRun.train!.number,
        train: { ...trainRun.train, hide: false }
      };
    });
  }

  toggleGroup(train: any, toggle: () => void) {
    train.hide = !train.hide;
    toggle();
  }

  onDaySearchInput(value: any) {
    this.searchDateMenu = false;
  }

  onTrainNumberSearchInput(value: any) {
    this.searchTrainPeople = this.searchTrainNumber;
  }

  filterDay(value: any, _, item: any) {
    if (!this.searchDate) return true;
    return moment(value).isSame(this.searchDate);
  }

  filterTrainRuns(value: any, _, item: any) {
    let filters: any[] = [];

    if (this.searchTrainNumber) {
      filters.push((item: any) => item.trainNumber === this.searchTrainNumber);
    }

    if (this.searchTrainPeople) {
      filters.push((item: any) => {
        return item.policePeople.some((policePerson: any) => {
          return (
            policePerson.name.includes(this.searchTrainPeople) ||
            policePerson.phoneNumber.includes(this.searchTrainPeople) ||
            policePerson.policeDepartment.name.includes(
              this.searchTrainPeople
            ) ||
            policePerson.rank.name.includes(this.searchTrainPeople) ||
            policePerson.TrainRunPolicePerson.fromStation.name.includes(
              this.searchTrainPeople
            ) ||
            policePerson.TrainRunPolicePerson.toStation.name.includes(
              this.searchTrainPeople
            )
          );
        });
      });
    }

    if (this.searchFromDate) {
      filters.push((item: any) => {
        const dateFormat = "HH:mm:ss";
        return item.policePeople.some((policePerson: any) => {
          const fromTime =
            policePerson.TrainRunPolicePerson.fromStation.LineTrainStation
              .departureTime ||
            policePerson.TrainRunPolicePerson.fromStation.LineTrainStation
              .arrivalTime;
          return moment(fromTime, dateFormat).isSameOrAfter(
            moment(this.searchFromDate, dateFormat)
          );
        });
      });
    }

    return filters.length > 0 ? filters.every(filter => filter(item)) : true;
  }

  get searchDateFormatted() {
    return this.searchDate
      ? convertToArabic(formatDayDate(this.searchDate))
      : "";
  }

  get loading() {
    return TrainsModule.loading;
  }

  get trains() {
    return TrainsModule.trains;
  }

  async beforeCreate() {
    await TrainsModule.getAllTrainRuns();
    await TrainsModule.get();
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
