<template>
  <div class="train-runs-revisions">
    <v-card>
      <v-card-title>
        سجل جميع الخدمات
        <v-spacer />
        <v-menu
          ref="searchDayDateMenu"
          v-model="searchDayDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
          class="d-print-none"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :value="searchDayDateFormatted"
              v-on="on"
              @click:clear="searchDayDate = ''"
              hide-details
              clearable
              readonly
              label="استعلام بتاريخ الخدمة"
              append-icon="mdi-calendar-search"
              class="d-print-none"
            />
          </template>
          <v-date-picker
            v-model="searchDayDate"
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
          label="استعلام ببيانات أفراد التأمين"
          single-line
          hide-details
          clearable
          class="d-print-none"
        />
        <v-spacer />
        <v-menu
          ref="searchFromDateMenu"
          v-model="searchFromTimeMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
          class="d-print-none"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :value="searchFromTimeFormatted"
              v-on="on"
              @click:clear="searchFromTime = ''"
              hide-details
              clearable
              readonly
              label="استعلام بوقت القيام"
              append-icon="mdi-calendar-search"
              class="d-print-none"
            />
          </template>

          <v-time-picker
            v-model="searchFromTime"
            @change="onFromTimeSearchInput"
            @click:clear="searchFromTime = ''"
            scrollable
            ampm-in-title
            full-width
            class="d-print-none"
          />
        </v-menu>
        <v-spacer />
        <v-text-field
          v-model="searchWhoDunnit"
          @click:clear="searchWhoDunnit = ''"
          append-icon="mdi-table-search"
          label="استعلام بالمستخدم (بواسطة)"
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
              label="استعلام بالمدة (منذ)"
              append-icon="mdi-calendar-search"
              class="d-print-none"
            />
          </template>
          <v-date-picker
            v-model="searchFromDate"
            @input="onFromDateSearchInput"
            scrollable
            no-title
            class="d-print-none"
          />
        </v-menu>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="trainRunsRevisions"
        :footer-props="{
          showFirstLastPage: true
        }"
        :sort-desc="true"
        :custom-sort="customSort"
        :loading="loading"
        sort-by="revisionValidFrom"
        class="elevation-1"
      >
        <template v-slot:item.train="{ item: { train } }">
          <v-chip
            :to="{
              name: `trains.run.details`,
              params: { id: train.id }
            }"
            link
            class="pointer"
            color="info"
          >
            {{ train.number | convertToArabic }}
          </v-chip>
        </template>

        <template v-slot:item.day="{ item: { day } }">
          {{ day | formatDayDate | convertToArabic }}
        </template>

        <template v-slot:item.policePeople="{ item }">
          <div
            v-for="policePerson in item.policePeople"
            :key="policePerson.id"
            class="my-2"
          >
            <v-spacer />
            {{ policePerson.rank.name }}
            /{{ policePerson.name }} -
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

        <template v-slot:item.revisionValidTo="{ item: { revisionValidTo } }">
          <v-chip :color="revisionValidTo ? 'error' : 'success'">
            {{ revisionValidTo ? "حذف" : "اضافة" }}
          </v-chip>
        </template>

        <template
          v-slot:item.revisionValidFrom="{
            item: { revisionValidFrom, revisionValidTo }
          }"
        >
          <div v-if="revisionValidTo">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-list-item-action-text>
                    {{ revisionValidTo | timeFromNow }}
                  </v-list-item-action-text>
                </span>
              </template>
              <span>{{ revisionValidTo | formatDate }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-list-item-action-text>
                    (تم اضافتها منذ
                    {{ revisionValidFrom | timeFromNow }}
                    )
                  </v-list-item-action-text>
                </span>
              </template>
              <span>{{ revisionValidFrom | formatDate }}</span>
            </v-tooltip>
          </div>
          <div v-else>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-list-item-action-text
                    >{{ revisionValidFrom | timeFromNow }}
                  </v-list-item-action-text>
                </span>
              </template>
              <span>{{ revisionValidFrom | formatDate }}</span>
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
import { TrainRunRevision } from "@/store/models";
import { convertToArabic, formatDayDate, moment, formatTime } from "@/utils";

@Component({
  components: {}
})
export default class TrainRunsRevisions extends Vue {
  searchTrainNumber = "";
  searchDayDate = "";
  searchFromDate = "";
  searchTrainPeople = "";
  searchDayDateMenu: boolean = false;
  searchFromDateMenu: boolean = false;
  searchFromTime = "";
  searchFromTimeMenu: boolean = false;
  searchWhoDunnit = "";

  headers: any[] = [
    {
      text: "رقم القطار",
      value: "train",
      sortable: true,
      filterable: true,
      filter: this.filterTrainNumber
    },
    {
      text: "تاريخ الخدمة",
      value: "day",
      sortable: true,
      filterable: true,
      filter: this.filterDay
    },
    {
      text: "أفراد التأمين",
      value: "policePeople",
      sortable: false,
      filterable: true,
      filter: this.filterPolicePeople
    },
    {
      text: "اضافة/حذف",
      value: "revisionValidTo",
      sortable: true,
      filterable: true
    },
    {
      text: "بواسطة",
      value: "whoDunnit",
      sortable: true,
      filterable: true,
      filter: this.filterWhoDunnit
    },
    {
      text: "منذ",
      value: "revisionValidFrom",
      sortable: true,
      filterable: true,
      filter: this.filterFrom
    }
  ];

  timeChipColor(day, time) {
    const isPast = moment().isAfter(
      moment(`${day} ${time}`, "YYYY-MM-DD HH:mm:ss")
    );
    const isToday = moment().isSame(moment(day, "YYYY-MM-DD"), "day");

    return isToday && !isPast ? "success" : isPast ? "error" : "info";
  }

  get trains() {
    return TrainsModule.trains;
  }

  get loading() {
    return TrainsModule.loading;
  }

  get trainRunsRevisions(): any[] {
    const trainRunsRevisions: any[] = TrainsModule.trainRunsRevisions || [];
    return trainRunsRevisions.map(trainRunsRevision => {
      moment.locale("en");
      let dayWithOutTime: any = moment(trainRunsRevision.day).format(
        "YYYY-MM-DD"
      );
      trainRunsRevision.day = dayWithOutTime;
      moment.locale("ar");
      return new TrainRunRevision({
        ...trainRunsRevision,
        trainNumber: trainRunsRevision.train!.number,
        train: { ...trainRunsRevision.train, hide: false }
      });
    });
  }

  get searchDayDateFormatted() {
    return this.searchDayDate
      ? convertToArabic(formatDayDate(this.searchDayDate))
      : "";
  }

  get searchFromDateFormatted() {
    return this.searchFromDate
      ? convertToArabic(formatDayDate(this.searchFromDate))
      : "";
  }

  get searchFromTimeFormatted() {
    return this.searchFromTime
      ? convertToArabic(formatTime(this.searchFromTime))
      : "";
  }

  toggleGroup(train: any, toggle: () => void) {
    train.hide = !train.hide;
    toggle();
  }

  onDaySearchInput(value: any) {
    this.searchDayDateMenu = false;
  }

  onFromDateSearchInput(value: any) {
    this.searchFromDateMenu = false;
  }

  onFromTimeSearchInput(value: any) {
    this.searchFromTimeMenu = false;
  }

  filterTrainNumber(value: any, _, item: any) {
    if (!this.searchTrainNumber) return true;
    return item.train.number === this.searchTrainNumber;
  }

  filterDay(value: any, _, item: any) {
    if (!this.searchDayDate) return true;
    return moment(value).isSame(this.searchDayDate);
  }

  filterFrom(value: any, _, item: any) {
    if (!this.searchFromDate) return true;
    return moment(value).isSameOrAfter(this.searchFromDate);
  }

  filterPolicePeople(value: any, _, item: any) {
    let filters: any[] = [];

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

    if (this.searchFromTime) {
      filters.push((item: any) => {
        const dateFormat = "HH:mm:ss";
        return item.policePeople.some((policePerson: any) => {
          const fromTime =
            policePerson.TrainRunPolicePerson.fromStation.LineTrainStation
              .departureTime ||
            policePerson.TrainRunPolicePerson.fromStation.LineTrainStation
              .arrivalTime;
          return moment(fromTime, dateFormat).isSameOrAfter(
            moment(this.searchFromTime, dateFormat)
          );
        });
      });
    }

    return filters.length > 0 ? filters.every(filter => filter(item)) : true;
  }

  filterWhoDunnit(value: any, _, item: any) {
    if (!this.searchWhoDunnit) return true;
    return value.includes(this.searchWhoDunnit);
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
      const maxDate = moment(8640000000000000);
      const minDate = moment(-8640000000000000);
      if (sortKey == "revisionValidFrom") {
        const sortKeyA = moment.max(
          moment(itemA.revisionValidFrom),
          itemA.revisionValidTo ? moment(itemA.revisionValidTo) : minDate
        );
        const sortKeyB = moment.max(
          moment(itemB.revisionValidFrom),
          itemB.revisionValidTo ? moment(itemB.revisionValidTo) : minDate
        );
        return sortDescValue
          ? sortKeyB.diff(sortKeyA)
          : sortKeyA.diff(sortKeyB);
      } else if (sortKey == "revisionValidTo") {
        const sortKeyA = !!itemA.revisionValidTo;
        const sortKeyB = !!itemB.revisionValidTo;
        return sortDescValue
          ? Number(sortKeyB) - Number(sortKeyA)
          : Number(sortKeyA) - Number(sortKeyB);
      } else if (sortKey == "train") {
        const { number: numberA } = itemA[sortKey];
        const { number: numberB } = itemB[sortKey];
        return sortDescValue ? numberB - numberA : numberA - numberB;
      } else if (sortKey == "whoDunnit") {
        return sortDescValue
          ? itemA.whoDunnit > itemB.whoDunnit
            ? -1
            : itemB.whoDunnit > itemA.whoDunnit
            ? 1
            : 0
          : itemA.whoDunnit < itemB.whoDunnit
          ? -1
          : itemB.whoDunnit < itemA.whoDunnit
          ? 1
          : 0;
      } else if (sortKey == "day") {
        const sortKeyA = moment(itemA.day);
        const sortKeyB = moment(itemB.day);
        return sortDescValue
          ? sortKeyB.diff(sortKeyA)
          : sortKeyA.diff(sortKeyB);
      } else {
        return sortDescValue
          ? itemB[sortKey] - itemA[sortKey]
          : itemA[sortKey] - itemB[sortKey];
      }
    });
  }

  async created() {
    TrainsModule.getAllTrainRunsRevisions();
    await TrainsModule.get();
  }
}
</script>

<style lang="scss">
.created-left-border {
  border-left: 4px solid #3cd1c2;
}
.destroyed-left-border {
  border-left: 4px solid tomato;
}
.pointer {
  cursor: pointer;
}
.v-row-group__header {
  background: white !important;
}
</style>
