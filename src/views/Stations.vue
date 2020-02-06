<template>
  <div class="stations">
    <v-card>
      <v-card-title>
        محطات كل خط
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-table-search"
          label="استعلام عن المحطة"
          single-line
          hide-details
          clearable
          class="d-print-none"
        />
      </v-card-title>
      <v-data-table
        :loading="stationsLoading"
        :headers="headers"
        :items="stations"
        :search="search"
        :page.sync="page"
        @page-count="pageCount = $event"
        item-key="id+lineName"
        items-per-page="100"
        group-by="lineName"
        sort-by="line.LineStation.stationOrder"
        class="elevation-1"
        hide-default-footer
      >
        <template v-slot:top v-if="$can('create', 'Station')">
          <div class="mx-4 d-print-none">
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" color="primary" dark class="mb-2">
                  اضافة محطة جديد
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">اضافة محطة جديد</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-form v-model="isNewStationValid">
                      <v-row justify="center" align="center">
                        <v-col cols="12">
                          <v-combobox
                            :rules="[v => !!v || 'برجاء ادخال أو اختيار الاسم']"
                            :loading="stationsLoading"
                            @input="onNameChange"
                            :items="stations"
                            :return-object="false"
                            required
                            label="اسم المحطة"
                            item-value="name"
                            item-text="name"
                            prepend-icon="mdi-city"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            @input="onLineNameChange"
                            :rules="[v => !!v || 'برجاء اختيار الخط']"
                            :loading="linesLoading"
                            :items="lines"
                            required
                            label="الخط التابعة له المحطة"
                            return-object
                            item-value="name"
                            item-text="name"
                            prepend-icon="mdi-arrow-expand-horizontal"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            :rules="[
                              v => (!!v && v > 0) || 'برجاء ادخال ترتيب المحطة'
                            ]"
                            @input="onLineStationOrderChange"
                            v-on:keypress="checkIfNotNumber($event)"
                            :error-messages="newStationOrderErrorMessage"
                            required
                            label="ترتيب المحطة"
                            prepend-icon="mdi-reorder-horizontal"
                          />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    :disabled="!isNewStationValid"
                    @click="save"
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
          </div>
        </template>

        <template
          v-slot:group.header="{ items: [lineGroup], headers, group, toggle }"
        >
          <thead>
            <th class="pointer">
              <span @click="toggleGroup(lineGroup.line, toggle)">
                <v-icon>
                  {{ lineGroup.line.hide ? "mdi-plus" : "mdi-minus" }}
                </v-icon>
              </span>
              <v-chip
                :to="{
                  name: `lines.stations`,
                  params: { lineId: lineGroup.line.id }
                }"
                link
                class="pointer"
                color="info"
              >
                {{ lineGroup.line.name }}
              </v-chip>
            </th>
          </thead>
        </template>

        <template v-slot:item.name="props">
          <v-edit-dialog
            :return-value.sync="props.item.name"
            @save="onEditNameSubmit(props.item.id, props.item.name)"
          >
            {{ props.item.name }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.name"
                v-if="$can('update', 'Station')"
                label="تعديل اسم المحطة"
                single-line
              />
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.line.LineStation.stationOrder="{ item }">
          <v-edit-dialog
            @open="temporaryStationOrder = item.line.LineStation.stationOrder"
            @save="
              onEditOrderSubmit(item.id, item.line.id, temporaryStationOrder)
            "
          >
            {{ item.line.LineStation.stationOrder | convertToArabic }}
            <template v-slot:input>
              <v-text-field
                :value="temporaryStationOrder"
                v-if="$can('update', 'Station')"
                @change="onEditLineStationOrderChange"
                label="تعديل ترتيب المحطة بالخط"
                single-line
              />
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.action="{ item }">
          <StationActions :station="item" />
        </template>
      </v-data-table>
      <v-card-actions>
        <v-pagination
          v-model="page"
          :length="pageCount"
          circle
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        />
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="0" top color="error">
      {{ updateStationErrorMessage }}
      <v-btn @click="closeSnackbar" dark text>
        اغلاق
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import StationActions from "@/components/StationActions.vue";

import StationsModule from "@/store/modules/Stations";
import LinesModule from "@/store/modules/Lines";
import UsersModule from "@/store/modules/Users";

import { Line } from "@/store/models";

import { convertToArabic, isNumber } from "@/utils";

@Component({
  components: {
    StationActions
  }
})
export default class Stations extends Vue {
  headers = [
    { text: "اسم المحطة", value: "name", sortable: true },
    {
      text: "ترتيب المحطة",
      value: "line.LineStation.stationOrder",
      sortable: true
    },
    { text: "", value: "action", sortable: false }
  ];
  search = "";
  dialog: boolean = false;
  isNewStationValid = false;
  temporaryStationOrder = "";
  page = 1;
  pageCount = 0;

  get snackbar() {
    return StationsModule.updateStationErrorMessage !== null;
  }

  set snackbar(value: any) {
    this.snackbar = value;
  }

  get updateStationErrorMessage() {
    return StationsModule.updateStationErrorMessage;
  }

  closeSnackbar() {
    StationsModule.updateErrorMessage({
      updateStationErrorMessage: null
    });
  }

  checkIfNotNumber(event: any) {
    if (!isNumber(event.key)) return event.preventDefault();
  }

  toggleGroup(line: any, toggle: () => void) {
    line.hide = !line.hide;
    toggle();
  }

  get newStation() {
    return StationsModule.newStation;
  }

  get stationsLoading() {
    return StationsModule.loading;
  }

  get linesLoading() {
    return LinesModule.loading;
  }

  get newStationOrderErrorMessage() {
    return StationsModule.newStationOrderErrorMessage;
  }

  get lines() {
    return LinesModule.lines;
  }

  get stations() {
    const stations: any = [];
    StationsModule.stations.forEach(station => {
      if (station.lines && station.lines.length > 0) {
        station.lines.forEach((line: any) => {
          let stationItem = {
            ...station,
            lineName: line.name,
            line: { ...line, hide: false }
          };
          stations.push(stationItem);
        });
      } else {
        let stationItem = {
          ...station,
          lineName: "محطات بدون خطوط بعد",
          line: {
            name: "محطات بدون خطوط بعد",
            hide: false,
            LineStation: { stationOrder: "---" }
          }
        };
        stations.push(stationItem);
      }
    });
    return stations;
  }

  onNameChange(value: any) {
    StationsModule.updateNewStation({ name: value });
  }

  onEditLineStationOrderChange(value: any) {
    this.temporaryStationOrder = value;
  }

  onLineStationOrderChange(value: any) {
    StationsModule.updateErrorMessage({
      newStationOrderErrorMessage: null
    });
    StationsModule.updateNewStation({ stationOrder: value });
  }

  onLineNameChange(value: any) {
    StationsModule.updateNewStation({ line: value });
  }

  close() {
    this.dialog = false;
  }

  async save() {
    await StationsModule.create();
    if (this.newStationOrderErrorMessage === null) {
      this.close();
    }
  }

  onEditNameSubmit(id: any, name: any) {
    if (name) StationsModule.update({ id, data: { name } });
  }

  onEditOrderSubmit(id: any, lineId: any, stationOrder: any) {
    if (stationOrder)
      StationsModule.updateStationOrder({ id, lineId, data: { stationOrder } });
  }

  async beforeCreate() {
    await StationsModule.getAll();
    await LinesModule.getAll();
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
