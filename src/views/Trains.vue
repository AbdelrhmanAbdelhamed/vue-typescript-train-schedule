<template>
  <div class="trains">
    <v-card>
      <v-card-title>
        جميع القطارات
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-table-search"
          label=" استعلام عن القطار أو الخط"
          single-line
          hide-details
          clearable
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="trains"
        item-key="number+lineName"
        group-by="lineName"
        class="elevation-1"
        :search="search"
        :custom-filter="filterTrains"
      >
        <template
          v-slot:group.header="{ items: [lineGroup], headers, group, toggle }"
        >
          <thead>
            <th class="pointer">
              <span @click="toggleGroup(lineGroup.line, toggle)">
                <v-icon>{{
                  lineGroup.line.hide ? "mdi-plus" : "mdi-minus"
                }}</v-icon>
              </span>
              <v-chip
                link
                :to="{
                  name: `lines.trains`,
                  params: { lineId: lineGroup.line.id }
                }"
                class="pointer"
                color="info"
                >{{ lineGroup.line.name }}</v-chip
              >
            </th>
          </thead>
        </template>

        <template v-slot:item.number="props">
          <v-edit-dialog
            @open="temporaryTrainNumber = props.item.number"
            @save="onEditSubmit(props.item.id, temporaryTrainNumber)"
          >
            {{ props.item.number | convertToArabic }}
            <template v-slot:input>
              <v-text-field
                :value="temporaryTrainNumber"
                label="تعديل رقم القطار"
                single-line
                v-if="$can('update', 'Train')"
                @change="onEditTrainNumberChange"
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.action="{ item }">
          <TrainActions
            :actions="{ delete: true, details: true }"
            :train="item"
            :line="item.line"
          />
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar v-model="snackbar" top color="error" :timeout="0">
      {{ updateTrainErrorMessage }}
      <v-btn dark text @click="closeSnackbar">اغلاق</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import TrainActions from "@/components/TrainActions.vue";

import TrainsModule from "@/store/modules/Trains";
import UsersModule from "@/store/modules/Users";

import { Line, Train } from "@/store/models";

import { validationRules, convertToArabic } from "@/utils";
import TrainsAPI from "@/services/api/Trains";

@Component({
  components: { TrainActions }
})
export default class Trains extends Vue {
  headers = [
    { text: "رقم القطار", value: "number", sortable: true },
    { text: "", value: "action", sortable: false }
  ];
  search = "";
  dialog: boolean = false;
  isNewTrainValid = false;
  temporaryTrainNumber = "";
  newTrainNumber = "";

  get snackbar() {
    return TrainsModule.updateTrainErrorMessage !== null;
  }

  set snackbar(value: any) {
    this.snackbar = value;
  }

  get updateTrainErrorMessage() {
    return TrainsModule.updateTrainErrorMessage;
  }

  closeSnackbar() {
    TrainsModule.updateErrorMessage({
      updateTrainErrorMessage: null
    });
  }

  toggleGroup(line: any, toggle: () => void) {
    line.hide = !line.hide;
    toggle();
  }

  get newTrain() {
    return TrainsModule.newTrain;
  }

  get loading() {
    return TrainsModule.loading;
  }

  @Prop()
  lineId!: string;

  get trains() {
    const trains: any = [];
    TrainsModule.trains.forEach(train => {
      if (train.lines && train.lines.length > 0) {
        train.lines.forEach((line: any) => {
          let trainItem: Train = new Train({
            ...train,
            lineName: line.name,
            line: { ...line, hide: false }
          });
          trains.push(trainItem);
        });
      } else {
        let trainItem: Train = new Train({
          ...train,
          lineName: "قطارات بدون خطوط بعد",
          line: {
            name: "قطارات بدون خطوط بعد",
            hide: false
          }
        });
        trains.push(trainItem);
      }
    });
    return trains;
  }

  onNumberChange(value: any) {
    TrainsModule.updateNewTrain({ number: value });
  }

  onLineNameChange(value: any) {
    TrainsModule.updateNewTrain({ line: value });
  }

  close() {
    this.dialog = false;
  }

  save() {
    TrainsModule.create();
    this.close();
  }

  onEditTrainNumberChange(value: any) {
    this.temporaryTrainNumber = value;
  }

  onEditSubmit(id: any, number: any) {
    if (number) TrainsModule.update({ id, data: { number } });
  }

  filterTrains(value: any, search: any, item: any) {
    if (
      (value != null && search != null && typeof value === "string") ||
      typeof value === "number"
    ) {
      return (
        value
          .toString()
          .toLocaleLowerCase()
          .indexOf(search.toLocaleLowerCase()) !== -1 ||
        item.lineName
          .toString()
          .toLocaleLowerCase()
          .indexOf(search.toLocaleLowerCase()) !== -1
      );
    } else {
      return false;
    }
  }

  async beforeCreate() {
    TrainsModule.get();
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
