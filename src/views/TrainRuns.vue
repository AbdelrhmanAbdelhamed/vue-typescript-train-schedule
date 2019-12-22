<template>
  <div class="trainRuns">
    <v-card>
      <v-card-title>
        جميع الخدمات
        <v-spacer></v-spacer>
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
              hide-details
              clearable
              readonly
              label="استعلام بتاريخ الخدمة"
              append-icon="mdi-calendar-search"
              v-on="on"
              @click:clear="search = ''"
              class="d-print-none"
            ></v-text-field>
          </template>
          <v-date-picker
            scrollable
            v-model="searchDate"
            no-title
            @input="onDaySearchInput"
            class="d-print-none"
          ></v-date-picker>
        </v-menu>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-table-search"
          label="  استعلام بأفراد التأمين أو برقم القطار"
          single-line
          hide-details
          clearable
          @click:clear="searchDate = ''"
          class="d-print-none"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="trainRuns"
        group-by="trainNumber"
        class="elevation-1"
        :search="search"
        :custom-filter="filterTrainRuns"
      >
        <template v-slot:top v-if="$can('manage', 'Train')">
          <div class="mx-4 d-print-none">
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              dark
              class="mb-2"
              link
              :to="{
                name: `runs.revisions`
              }"
              >سجل جميع الخدمات</v-btn
            >
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
                link
                :to="{
                  name: `trains.run.details`,
                  params: { id: trainGroup.train.id }
                }"
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
            {{ policePerson.rank.name }}
            / {{ policePerson.name }} -
            {{ policePerson.policeDepartment.name }} -
            {{ policePerson.phoneNumber | convertToArabic }} من محطة:
            {{ policePerson.TrainRunPolicePerson.fromStation.name }} الى محطة:
            {{ policePerson.TrainRunPolicePerson.toStation.name }}
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
import { TrainRun } from "@/store/models";
import { convertToArabic, formatDayDate } from "@/utils";

@Component({
  components: {}
})
export default class TrainRuns extends Vue {
  headers = [
    { text: "تاريخ الخدمة", value: "day", sortable: true },
    { text: "أفراد التأمين", value: "policePeople", sortable: true }
  ];
  dialog: boolean = false;
  isNewLineValid = false;
  searchDate = "";
  search = "";
  searchDateMenu: boolean = false;

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
    this.search = this.searchDate;
  }

  filterTrainRuns(value: any, search: any, item: any) {
    if (value != null && search != null) {
      if (typeof value === "string" || typeof value === "number") {
        return (
          value
            .toString()
            .toLocaleLowerCase()
            .indexOf(search.toLocaleLowerCase()) !== -1
        );
      } else {
        let policePeople = value;
        let indices: any[] = [];
        for (let policePerson of policePeople) {
          indices.push(
            policePerson.name
              .toString()
              .toLocaleLowerCase()
              .indexOf(search.toLocaleLowerCase())
          );
          indices.push(
            policePerson.phoneNumber
              .toString()
              .toLocaleLowerCase()
              .indexOf(search.toLocaleLowerCase())
          );
          indices.push(
            policePerson.policeDepartment.name
              .toString()
              .toLocaleLowerCase()
              .indexOf(search.toLocaleLowerCase())
          );
          indices.push(
            policePerson.rank.name
              .toString()
              .toLocaleLowerCase()
              .indexOf(search.toLocaleLowerCase())
          );
          indices.push(
            policePerson.TrainRunPolicePerson.fromStation.name
              .toString()
              .toLocaleLowerCase()
              .indexOf(search.toLocaleLowerCase())
          );
          indices.push(
            policePerson.TrainRunPolicePerson.toStation.name
              .toString()
              .toLocaleLowerCase()
              .indexOf(search.toLocaleLowerCase())
          );
        }
        indices.push(
          item.trainNumber
            .toString()
            .toLocaleLowerCase()
            .indexOf(search.toLocaleLowerCase())
        );
        return indices.some(index => index !== -1);
      }
    } else {
      return false;
    }
  }

  get searchDateFormatted() {
    return this.searchDate
      ? convertToArabic(formatDayDate(this.searchDate))
      : "";
  }

  get loading() {
    return TrainsModule.loading;
  }

  async beforeCreate() {
    await TrainsModule.getAllTrainRuns();
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
