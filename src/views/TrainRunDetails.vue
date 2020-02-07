<template>
  <div class="train-details">
    <v-card>
      <v-card-title v-if="train">
        خدمات قطار رقم: {{ train.number | convertToArabic }}
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
            v-model="searchDate"
            @input="onDaySearchInput"
            scrollable
            no-title
            class="d-print-none"
          />
        </v-menu>
        <v-spacer />
        <v-text-field
          v-model="search"
          @click:clear="searchDate = ''"
          append-icon="mdi-table-search"
          label="استعلام بأفراد التأمين"
          single-line
          hide-details
          clearable
          class="d-print-none"
        />
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="train.trainRuns"
        :search="search"
        :custom-filter="filterTrainRuns"
        :footer-props="{
          showFirstLastPage: true
        }"
        :sort-desc="true"
        fixed-header
        item-key="id"
        class="elevation-1"
        sort-by="day"
      >
        <template v-slot:top v-if="$can('create', 'TrainRun')">
          <div class="mx-4 d-print-none">
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
            <v-row>
              <v-col v-if="$can('manage', 'Train')" cols="12">
                <v-btn
                  :to="{
                    name: `trains.run.revision.details`,
                    params: { id }
                  }"
                  outlined
                  color="info"
                  dark
                  link
                >
                  سجل الخدمات
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-dialog v-model="dialog" max-width="1000px">
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" color="primary" dark class="mb-2">
                      اضافة خدمة جديد
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">اضافة خدمة جديد</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-form v-model="isNewTrainRunValid">
                          <v-row justify="center" align="center">
                            <v-col cols="12">
                              <v-menu
                                ref="newTrainRunDateMenu"
                                v-model="newTrainRunDateMenu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    :rules="[
                                      v => !!v || 'برجاء اختيار التاريخ'
                                    ]"
                                    :value="newTrainRunDateFormatted"
                                    :error-messages="
                                      newTrainRunDateErrorMessage
                                    "
                                    v-on="on"
                                    required
                                    readonly
                                    label="تاريخ الخدمة"
                                    append-icon="mdi-calendar-search"
                                  />
                                </template>
                                <v-date-picker
                                  v-model="newTrainRunDate"
                                  @input="onNewTrainRunDayChange"
                                  :min="nowDate"
                                  :max="endDate"
                                  scrollable
                                  no-title
                                  first-day-of-week="6"
                                  locale="ar"
                                />
                              </v-menu>
                            </v-col>

                            <v-card-title>أفراد التأمين</v-card-title>
                            <v-container
                              v-for="(policePerson,
                              policePersonIndex) in newTrainRun.policePeople"
                              :key="policePersonIndex"
                            >
                              <v-row>
                                <v-col cols="12" sm="1" md="1">
                                  <v-btn
                                    @click="
                                      removePolicePerson(policePersonIndex)
                                    "
                                    fab
                                    small
                                    dark
                                    color="error"
                                  >
                                    <v-icon>mdi-minus</v-icon>
                                  </v-btn>
                                </v-col>
                                <v-col cols="12" sm="1" md="1">
                                  <v-combobox
                                    :rules="[v => !!v || 'برجاء ادخال الدرجة']"
                                    :loading="loading"
                                    :items="policePeople"
                                    :return-object="false"
                                    @input="
                                      onPolicePersonChange({
                                        policePersonIndex,
                                        data: { rank: { name: $event } }
                                      })
                                    "
                                    required
                                    item-value="rank.name"
                                    item-text="rank.name"
                                    hide-no-data
                                    label="الدرجة"
                                  />
                                </v-col>
                                <v-col>
                                  <v-combobox
                                    :rules="[v => !!v || 'برجاء ادخال الاسم ']"
                                    :loading="loading"
                                    :items="policePeople"
                                    :return-object="false"
                                    @input="
                                      onPolicePersonChange({
                                        policePersonIndex,
                                        data: { name: $event }
                                      })
                                    "
                                    required
                                    item-value="name"
                                    item-text="name"
                                    hide-no-data
                                    label="الاسم"
                                  />
                                </v-col>
                                <v-col>
                                  <v-combobox
                                    :rules="[
                                      v => !!v || 'برجاء ادخال أو اخنيار الجهة'
                                    ]"
                                    :loading="loading"
                                    :items="policePeople"
                                    :return-object="false"
                                    @input="
                                      onPolicePersonChange({
                                        policePersonIndex,
                                        data: {
                                          policeDepartment: { name: $event }
                                        }
                                      })
                                    "
                                    required
                                    item-value="policeDepartment.name"
                                    item-text="policeDepartment.name"
                                    hide-no-data
                                    label="الجهة"
                                  />
                                </v-col>
                                <v-col cols="12" sm="2" md="2">
                                  <v-text-field
                                    :rules="[
                                      v => !!v || 'برجاء ادخال رقم التليفون',
                                      v =>
                                        (v &&
                                          v.length == 11 &&
                                          (v.startsWith('010') ||
                                            v.startsWith('011') ||
                                            v.startsWith('012') ||
                                            v.startsWith('015'))) ||
                                        'برجاء ادخال رقم تليفون صحيح'
                                    ]"
                                    @input="
                                      onPolicePersonChange({
                                        policePersonIndex,
                                        data: { phoneNumber: $event }
                                      })
                                    "
                                    required
                                    label="رقم التليفون"
                                  />
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12" sm="6" md="6">
                                  <v-autocomplete
                                    :rules="[v => !!v || 'برجاء اختيار المحطة']"
                                    :loading="loading"
                                    :return-object="true"
                                    :items="stations"
                                    @input="
                                      onPolicePersonChange({
                                        policePersonIndex,
                                        data: {
                                          fromStationId: $event.id,
                                          fromStation: $event
                                        }
                                      })
                                    "
                                    required
                                    label="من محطة"
                                    item-text="name"
                                    prepend-icon="mdi-city"
                                  />
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-autocomplete
                                    :rules="[v => !!v || 'برجاء اختيار المحطة']"
                                    :loading="loading"
                                    :items="stations"
                                    :return-object="true"
                                    @input="
                                      onPolicePersonChange({
                                        policePersonIndex,
                                        data: {
                                          toStationId: $event.id,
                                          toStation: $event
                                        }
                                      })
                                    "
                                    required
                                    label="الى محطة"
                                    item-text="name"
                                    prepend-icon="mdi-city"
                                  />
                                </v-col>
                              </v-row>
                            </v-container>
                            <v-col>
                              <v-row>
                                <v-col>
                                  <v-btn
                                    @click="addPolicePerson"
                                    fab
                                    small
                                    dark
                                    color="primary"
                                  >
                                    <v-icon>mdi-plus</v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-btn
                        @click="save"
                        :disabled="!isNewTrainRunValid"
                        color="success darken-1"
                        text
                      >
                        حفظ
                      </v-btn>
                      <v-btn @click="close" color="blue darken-1" text>
                        الغاء
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </div>
        </template>

        <template v-slot:item.id="{ item }">
          {{ item.id | convertToArabic }}
        </template>

        <template v-slot:item.day="{ item }">
          {{ item.day | formatDayDate | convertToArabic }}
        </template>

        <template v-slot:item.policePeople="{ item }">
          <div
            v-for="policePerson in item.policePeople"
            :key="policePerson.id + item.day"
          >
            {{ policePerson.rank.name }}
            / {{ policePerson.name }} -
            {{ policePerson.policeDepartment.name }} -
            {{ policePerson.phoneNumber | convertToArabic }} - من محطة:
            {{ policePerson.TrainRunPolicePerson.fromStation.name }} الى محطة:
            {{ policePerson.TrainRunPolicePerson.toStation.name }}
          </div>
        </template>

        <template v-slot:item.action="{ item }">
          <TrainRunsActions :trainRun="item" :train="train" />
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import moment from "moment";

import TrainActions from "@/components/TrainActions.vue";
import TrainRunsActions from "@/components/TrainRunsActions.vue";

import StationsModule from "@/store/modules/Stations";
import UsersModule from "@/store/modules/Users";
import TrainsModule from "@/store/modules/Trains";
import PolicePeopleModule from "@/store/modules/PolicePeople";
import PoliceDepartmentsModule from "@/store/modules/PoliceDepartments";
import RanksModule from "@/store/modules/Ranks";

import { Train, PolicePerson, TrainRun } from "@/store/models";

import { formatDayDate, convertToArabic, convertToEnglish } from "@/utils";

@Component({
  components: { TrainActions, TrainRunsActions }
})
export default class TrainDetails extends Vue {
  convertToEnglish = convertToEnglish;

  headers = [
    { text: "تاريخ الخدمة", value: "day", sortable: true },
    { text: "أفراد التأمين", value: "policePeople", sortable: true },
    { text: "", value: "action", sortable: false }
  ];
  search = "";
  searchDateMenu: boolean = false;
  newTrainRunDateMenu: boolean = false;
  searchDate = "";
  newTrainRunDate = "";
  nowDate = new Date().toISOString().slice(0, 10);
  isNewTrainRunValid = false;
  dialog = false;

  @Prop()
  id!: string;

  get loading() {
    return (
      TrainsModule.loading ||
      PolicePeopleModule.loading ||
      RanksModule.loading ||
      PoliceDepartmentsModule.loading ||
      UsersModule.loading ||
      StationsModule.loading
    );
  }

  get endDate() {
    return moment(this.nowDate)
      .add(1, "month")
      .toISOString()
      .slice(0, 10);
  }

  get stations() {
    return StationsModule.stations;
  }

  get newTrainRun() {
    return TrainsModule.newTrainRun;
  }

  get policePeople() {
    return PolicePeopleModule.policePeople;
  }

  get train() {
    let currentTrain = TrainsModule.currentTrain;
    currentTrain.trainRuns = currentTrain.trainRuns ?? [];
    currentTrain.trainRuns = [
      ...currentTrain.trainRuns.map(trainRun => {
        return new TrainRun({ ...trainRun });
      })
    ];
    return currentTrain;
  }

  get searchDateFormatted() {
    return this.searchDate
      ? convertToArabic(formatDayDate(this.searchDate))
      : "";
  }

  get newTrainRunDateFormatted() {
    return this.newTrainRunDate
      ? convertToArabic(formatDayDate(this.newTrainRunDate))
      : "";
  }

  get newTrainRunDateErrorMessage() {
    return TrainsModule.newTrainRunDateErrorMessage;
  }

  addPolicePerson() {
    TrainsModule.addPolicePerson();
  }
  removePolicePerson(policePersonIndex: any) {
    TrainsModule.removePolicePerson(policePersonIndex);
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
        return indices.some(index => index !== -1);
      }
    } else {
      return false;
    }
  }

  onPolicePersonChange({
    policePersonIndex,
    data
  }: {
    policePersonIndex: number;
    data: any;
  }) {
    TrainsModule.updatePolicePerson({ policePersonIndex, data });
  }

  onDaySearchInput(value: any) {
    this.searchDateMenu = false;
    this.search = this.searchDate;
  }

  onNewTrainRunDayChange(value: any) {
    TrainsModule.updateErrorMessage({
      newTrainRunDateErrorMessage: null
    });
    TrainsModule.updateNewTrainRun({ day: value });
  }

  close() {
    this.dialog = false;
  }

  async save() {
    if (this.train.id && this.newTrainRunDateErrorMessage === null) {
      await TrainsModule.createTrainRun({
        trainId: this.train.id
      });
    }
    if (this.newTrainRunDateErrorMessage === null) {
      this.close();
    }
  }

  async created() {
    if (this.id) {
      await TrainsModule.getRunsByTrainId({ trainId: this.id });
    }
    PolicePeopleModule.getAll();
    RanksModule.getAll();
    PoliceDepartmentsModule.getAll();
    StationsModule.getAll();
  }
}
</script>
