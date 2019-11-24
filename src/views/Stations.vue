<template>
  <div class="stations">
    <v-card>
      <v-card-title>
        محطات كل خط
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-table-search"
          label="استعلام عن المحطة"
          single-line
          hide-details
          clearable
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="stations"
        item-key="id+line.name"
        group-by="lineName"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:top v-if="isAdmin">
          <div class="mx-4">
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on"
                  >اضافة محطة جديد</v-btn
                >
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
                          <v-text-field
                            :rules="[v => !!v || 'برجاء ادخال الاسم']"
                            required
                            @input="onNameChange"
                            label="اسم المحطة"
                            prepend-icon="mdi-city"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            @input="onLineNameChange"
                            :rules="[v => !!v || 'برجاء اختيار الخط']"
                            required
                            :loading="loading"
                            label="الخط التابعة له المحطة"
                            :items="lines"
                            return-object
                            item-value="name"
                            item-text="name"
                            prepend-icon="mdi-arrow-expand-horizontal"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            :rules="[v => !!v || 'برجاء ادخال ترتيب المحطة']"
                            required
                            @input="onLineStationOrderChange"
                            v-on:keypress="checkIfNotNumber($event)"
                            label="ترتيب المحطة"
                            prepend-icon="mdi-reorder-horizontal"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    :disabled="!isNewStationValid"
                    color="success darken-1"
                    text
                    @click="save"
                    >حفظ</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="close">الغاء</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>

        <template
          v-slot:group.header="{ items: [lineGroup], headers, group, toggle }"
        >
          <thead>
            <th
              ref="groupHeader"
              class="pointer"
              @click="toggleGroup(lineGroup.line, toggle)"
            >
              <span>
                <v-icon>
                  {{ lineGroup.line.hide ? "mdi-plus" : "mdi-minus" }}
                </v-icon>
              </span>
              <v-chip color="info">
                {{ lineGroup.line.name }}
              </v-chip>
            </th>
          </thead>
        </template>

        <template v-slot:item.name="props" v-if="isAdmin">
          <v-edit-dialog
            :return-value.sync="props.item.name"
            @save="onEditSubmit(props.item.id, props.item.name)"
          >
            {{ props.item.name }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.name"
                label="تعديل اسم المحطة"
                single-line
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.line.LineStation.stationOrder="{ item }">
          {{ item.line.LineStation.stationOrder | convertToArabic }}
        </template>

        <template v-slot:item.action="{ item }">
          <StationActions :station="item" />
        </template>
      </v-data-table>
    </v-card>
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

import { ILine } from "@/store/models";

import { convertToArabic, IsNumber } from "@/utils";

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
      sortable: false
    },
    { text: "", value: "action", sortable: false }
  ];
  search = "";
  dialog: boolean = false;
  isNewStationValid = false;

  checkIfNotNumber(event: any) {
    if (!IsNumber(event.key)) return event.preventDefault();
  }

  toggleGroup(line: any, toggle: () => void) {
    line.hide = !line.hide;
    toggle();
  }

  get newStation() {
    return StationsModule.newStation;
  }

  get loading() {
    return StationsModule.loading || LinesModule.loading;
  }

  get isAdmin() {
    return UsersModule.currentUser.isAdmin;
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

  onLineStationOrderChange(value: any) {
    StationsModule.updateNewStation({ stationOrder: value });
  }

  onLineNameChange(value: any) {
    StationsModule.updateNewStation({ line: value });
  }

  close() {
    this.dialog = false;
  }

  save() {
    StationsModule.create();
    this.close();
  }

  onEditSubmit(id: any, name: any) {
    if (name) StationsModule.update({ id, data: { name } });
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
