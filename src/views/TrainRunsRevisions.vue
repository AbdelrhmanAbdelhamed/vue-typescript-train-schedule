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
              @click:clear="search = ''"
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
        <v-text-field
          v-model="search"
          @click:clear="
            searchDayDate = '';
            searchFromDate = '';
          "
          append-icon="mdi-table-search"
          label="استعلام بالمستخدم أو برقم القطار"
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
              @click:clear="search = ''"
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
            @input="onFromSearchInput"
            scrollable
            no-title
            class="d-print-none"
          />
        </v-menu>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="trainRunsRevisions"
        :search="search"
        :custom-filter="filterTrainRunsRevisions"
        :footer-props="{
          showFirstLastPage: true
        }"
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
import { convertToArabic, formatDayDate, moment } from "@/utils";

@Component({
  components: {}
})
export default class TrainRunsRevisions extends Vue {
  headers: any[] = [
    {
      text: "رقم القطار",
      value: "train",
      sortable: false,
      filterable: true
    },
    { text: "تاريخ الخدمة", value: "day", sortable: false, filterable: true },
    {
      text: "اضافة/حذف",
      value: "revisionValidTo",
      sortable: false,
      filterable: false
    },
    { text: "بواسطة", value: "whoDunnit", sortable: false, filterable: true },
    {
      text: "منذ",
      value: "revisionValidFrom",
      sortable: false,
      filterable: true
    }
  ];

  search = "";
  searchDayDate = "";
  searchFromDate = "";
  searchDayDateMenu: boolean = false;
  searchFromDateMenu: boolean = false;

  get loading() {
    return TrainsModule.loading;
  }

  get trainRunsRevisions(): any[] {
    const trainRunsRevisions: any[] = TrainsModule.trainRunsRevisions || [];
    let revisions = [];
    return trainRunsRevisions.map(trainRunsRevision => {
      return {
        ...trainRunsRevision.item,
        trainNumber: trainRunsRevision.train!.number,
        train: { ...trainRunsRevision.train, hide: false }
      };
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

  toggleGroup(train: any, toggle: () => void) {
    train.hide = !train.hide;
    toggle();
  }

  onDaySearchInput(value: any) {
    this.searchDayDateMenu = false;
    this.search = this.searchDayDate;
    this.searchFromDate = "";
  }

  onFromSearchInput(value: any) {
    this.searchFromDateMenu = false;
    this.search = this.searchFromDate;
    this.searchDayDate = "";
  }

  filterTrainRunsRevisions(value: any, search: string, item: any) {
    if (value != null && search != null) {
      const dateFormat = "YYYY-MM-DD";
      const fromDateFormatted = moment(new Date(value)).format(dateFormat);
      const isValidDate = moment(fromDateFormatted, dateFormat, true).isValid();
      if (
        (typeof value === "string" || typeof value === "number") &&
        !isValidDate
      ) {
        return (
          value
            .toString()
            .toLocaleLowerCase()
            .indexOf(search.toLocaleLowerCase()) !== -1 ||
          item.trainNumber
            .toString()
            .toLocaleLowerCase()
            .indexOf(search.toLocaleLowerCase()) !== -1
        );
      } else if (isValidDate && this.searchDayDate && !this.searchFromDate) {
        return moment(item.day).isSame(this.searchDayDate);
      } else if (isValidDate && this.searchFromDate && !this.searchDayDate) {
        const revisionDate = item.revisionValidTo || item.revisionValidFrom;
        return moment(revisionDate).isSameOrAfter(this.searchFromDate);
      }
    } else {
      return false;
    }
  }

  async created() {
    TrainsModule.getAllTrainRunsRevisions();
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
