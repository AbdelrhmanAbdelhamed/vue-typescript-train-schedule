<template>
  <div class="trainRuns">
    <v-card>
      <v-card-title>
        جميع الرحلات
        <v-spacer></v-spacer>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="trainRuns"
        group-by="trainNumber"
        class="elevation-1"
        disable-pagination
        hide-default-footer
      >
        <template
          v-slot:group.header="{ items: [trainGroup], headers, group, toggle }"
        >
          <thead>
            <th class="pointer" @click="toggleGroup(trainGroup.train, toggle)">
              <span>
                <v-icon>
                  {{ trainGroup.train.hide ? "mdi-plus" : "mdi-minus" }}
                </v-icon>
              </span>
              <v-chip class="pointer" color="info">
                قطار رقم: {{ trainGroup.train.number | convertToArabic }}
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

            / {{ policePerson.name }}

            - {{ policePerson.policeDepartment.name }}

            - {{ policePerson.phoneNumber }}
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
import { ITrainRun } from "@/store/models";

@Component({
  components: {}
})
export default class TrainRuns extends Vue {
  headers = [
    { text: "تاريخ الرحلة", value: "day", sortable: true },
    { text: "أفراد التأمين", value: "policePeople", sortable: true }
  ];
  dialog: boolean = false;
  isNewLineValid = false;

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
