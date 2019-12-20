<template>
  <div class="train-details">
    <v-card>
      <v-card-title v-if="train">
        رحلات قطار رقم: {{ train.number | convertToArabic }}
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
          label="استعلام بأفراد التأمين"
          single-line
          hide-details
          clearable
          @click:clear="searchDate = ''"
          class="d-print-none"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        fixed-header
        :loading="loading"
        :headers="headers"
        :items="train.trainRuns"
        item-key="id"
        class="elevation-1"
        :search="search"
        :custom-filter="filterTrainRuns"
      >
        <template v-slot:top v-if="$can('create', 'TrainRun')">
          <div class="mx-4 d-print-none">
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-row>
              <v-col cols="12" v-if="$can('manage', 'Train')">
                <v-btn
                  outlined
                  color="info"
                  dark
                  link
                  :to="{
                    name: `trains.run.revision.details`,
                    params: { id }
                  }"
                  >سجل الخدمات</v-btn
                ></v-col
              >
              <v-col cols="12">
                <v-dialog v-model="dialog" max-width="1000px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on"
                      >اضافة خدمة جديد</v-btn
                    >
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
                                    required
                                    :value="newTrainRunDateFormatted"
                                    readonly
                                    :error-messages="
                                      newTrainRunDateErrorMessage
                                    "
                                    label="تاريخ الخدمة"
                                    append-icon="mdi-calendar-search"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  scrollable
                                  v-model="newTrainRunDate"
                                  no-title
                                  @input="onNewTrainRunDayChange"
                                ></v-date-picker>
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
                                    fab
                                    small
                                    dark
                                    color="error"
                                    @click="
                                      removePolicePerson(policePersonIndex)
                                    "
                                  >
                                    <v-icon>mdi-minus</v-icon>
                                  </v-btn>
                                </v-col>
                                <v-col cols="12" sm="1" md="1">
                                  <v-combobox
                                    :rules="[v => !!v || 'برجاء ادخال الدرجة']"
                                    required
                                    :loading="loading"
                                    :items="policePeople"
                                    item-value="rank.name"
                                    item-text="rank.name"
                                    hide-no-data
                                    :return-object="false"
                                    label="الدرجة"
                                    @input="
                                      onPolicePersonChange({
                                        policePersonIndex,
                                        data: { rank: { name: $event } }
                                      })
                                    "
                                  ></v-combobox>
                                </v-col>
                                <v-col>
                                  <v-combobox
                                    :rules="[v => !!v || 'برجاء ادخال الاسم ']"
                                    required
                                    :loading="loading"
                                    :items="policePeople"
                                    item-value="name"
                                    item-text="name"
                                    :return-object="false"
                                    hide-no-data
                                    label="الاسم"
                                    @input="
                                      onPolicePersonChange({
                                        policePersonIndex,
                                        data: { name: $event }
                                      })
                                    "
                                  ></v-combobox>
                                </v-col>
                                <v-col>
                                  <v-combobox
                                    :rules="[
                                      v => !!v || 'برجاء ادخال أو اخنيار الجهة'
                                    ]"
                                    required
                                    :loading="loading"
                                    :items="policePeople"
                                    item-value="policeDepartment.name"
                                    item-text="policeDepartment.name"
                                    hide-no-data
                                    :return-object="false"
                                    label="الجهة"
                                    @input="
                                      onPolicePersonChange({
                                        policePersonIndex,
                                        data: {
                                          policeDepartment: { name: $event }
                                        }
                                      })
                                    "
                                  ></v-combobox>
                                </v-col>
                                <v-col cols="12" sm="2" md="2">
                                  <v-combobox
                                    :rules="[
                                      v => !!v || 'برجاء ادخال رقم التليفون'
                                    ]"
                                    required
                                    :loading="loading"
                                    :items="policePeople"
                                    item-value="phoneNumber"
                                    item-text="phoneNumber"
                                    hide-no-data
                                    :return-object="false"
                                    label="رقم التليفون"
                                    @input="
                                      onPolicePersonChange({
                                        policePersonIndex,
                                        data: { phoneNumber: $event }
                                      })
                                    "
                                  ></v-combobox>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12" sm="6" md="6">
                                  <v-autocomplete
                                    :rules="[v => !!v || 'برجاء اختيار المحطة']"
                                    required
                                    :loading="loading"
                                    v-model="fromStation"
                                    :return-object="true"
                                    label="من محطة"
                                    :items="stations"
                                    item-value="name"
                                    item-text="name"
                                    prepend-icon="mdi-city"
                                    @input="
                                      onPolicePersonChange({
                                        policePersonIndex,
                                        data: {
                                          fromStationId: $event.id,
                                          fromStation: $event
                                        }
                                      })
                                    "
                                  ></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-autocomplete
                                    :rules="[v => !!v || 'برجاء اختيار المحطة']"
                                    required
                                    :loading="loading"
                                    v-model="toStation"
                                    label="الى محطة"
                                    :items="stations"
                                    item-value="name"
                                    item-text="name"
                                    prepend-icon="mdi-city"
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
                                  ></v-autocomplete>
                                </v-col>
                              </v-row>
                            </v-container>
                            <v-col>
                              <v-row>
                                <v-col>
                                  <v-btn
                                    fab
                                    small
                                    dark
                                    color="primary"
                                    @click="addPolicePerson"
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
                        color="success darken-1"
                        text
                        @click="save"
                        :disabled="!isNewTrainRunValid"
                        >حفظ</v-btn
                      >
                      <v-btn color="blue darken-1" text @click="close"
                        >الغاء</v-btn
                      >
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
          <div v-for="policePerson in item.policePeople" :key="policePerson.id">
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

import { Train, PolicePerson } from "@/store/models";

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
  isNewTrainRunValid = false;
  dialog = false;
  fromStation: string = "";
  toStation: string = "";

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
    return TrainsModule.currentTrain;
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
        return value.toString().indexOf(search) > -1;
      } else {
        let policePeople = value;
        let indices: any[] = [];
        for (let policePerson of policePeople) {
          indices.push(policePerson.name.indexOf(search));
          indices.push(policePerson.phoneNumber.indexOf(search));
          indices.push(policePerson.policeDepartment.name.indexOf(search));
          indices.push(policePerson.rank.name.indexOf(search));
          indices.push(
            policePerson.TrainRunPolicePerson.fromStation.name.indexOf(search)
          );
          indices.push(
            policePerson.TrainRunPolicePerson.toStation.name.indexOf(search)
          );
        }
        return indices.some(index => index > -1);
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
