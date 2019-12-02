<template>
  <div class="trains">
    <v-card>
      <v-card-title>
        جميع القطارات
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-table-search"
          label="استعلام عن القطار"
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
        disable-pagination
        hide-default-footer
      >
        <template
          v-slot:group.header="{ items: [lineGroup], headers, group, toggle }"
        >
          <thead>
            <th class="pointer" @click="toggleGroup(lineGroup.line, toggle)">
              <span>
                <v-icon>{{
                  lineGroup.line.hide ? "mdi-plus" : "mdi-minus"
                }}</v-icon>
              </span>
              <v-chip class="pointer" color="info">{{
                lineGroup.line.name
              }}</v-chip>
            </th>
          </thead>
        </template>

        <template v-slot:item.number="props">
          <v-edit-dialog
            :return-value.sync="props.item.number"
            @save="onEditSubmit(props.item.id, props.item.number)"
          >
            {{ props.item.number | convertToArabic }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.number"
                label="تعديل رقم القطار"
                single-line
                v-if="$can('update', 'Train')"
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import TrainActions from "@/components/TrainActions.vue";

import TrainsModule from "@/store/modules/Trains";
import UsersModule from "@/store/modules/Users";
import LinesModule from "@/store/modules/Lines";

import { ILine } from "@/store/models";

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

  newTrainNumber = "";

  toggleGroup(line: any, toggle: () => void) {
    line.hide = !line.hide;
    toggle();
  }

  get newTrain() {
    return TrainsModule.newTrain;
  }

  get loading() {
    return TrainsModule.loading || LinesModule.loading;
  }

  @Prop()
  lineId!: string;

  get trains() {
    const trains: any = [];
    TrainsModule.trains.forEach(train => {
      if (train.lines && train.lines.length > 0) {
        train.lines.forEach((line: any) => {
          let trainItem = {
            ...train,
            lineName: line.name,
            line: { ...line, hide: false }
          };
          trains.push(trainItem);
        });
      } else {
        let trainItem = {
          ...train,
          lineName: "قطارات بدون خطوط بعد",
          line: {
            name: "قطارات بدون خطوط بعد",
            hide: false
          }
        };
        trains.push(trainItem);
      }
    });
    return trains;
  }

  get lines() {
    return LinesModule.lines;
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

  onEditSubmit(id: any, number: any) {
    if (number) TrainsModule.update({ id, data: { number } });
  }

  async beforeCreate() {
    TrainsModule.get();
    LinesModule.getAll();
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
