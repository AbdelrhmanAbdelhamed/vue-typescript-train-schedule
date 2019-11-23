<template>
  <div class="trains">
    <v-card>
      <v-card-title>
        قطارات كل خط
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
        :headers="headers"
        :items="trains"
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
                  >اضافة قطار جديد</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">اضافة قطار جديد</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-form v-model="isNewTrainValid">
                      <v-row justify="center" align="center">
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            :rules="[v => !!v || 'برجاء ادخال الرقم']"
                            required
                            @input="onNumberChange"
                            v-model="newTrainNumber"
                            label="رقم القطار"
                            prepend-icon="mdi-train"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-autocomplete
                            @input="onLineNameChange"
                            :rules="[v => !!v || 'برجاء اختيار الخط']"
                            :loading="loading"
                            label="الخط التابع له"
                            :items="lines"
                            return-object
                            item-value="name"
                            item-text="name"
                            prepend-icon="mdi-arrow-expand-horizontal"
                          ></v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>

                <v-card-actions right>
                  <v-btn
                    :disabled="!isNewTrainValid"
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
            <th class="pointer" @click="toggleGroup(lineGroup.line, toggle)">
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

        <template v-slot:item.number="props" v-if="isAdmin">
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
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.action="{ item }">
          <TrainActions
            :actions="{ delete: true, details: true }"
            :train="item"
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
    return TrainsModule.trains.map(train => {
      return {
        ...train,
        lineName:
          train.line && train.line.name
            ? train.line.name
            : "قطارات بدون خطوط بعد",
        line:
          train.line && train.line.name
            ? { ...train.line, hide: false }
            : { name: "قطارات بدون خطوط بعد", hide: false }
      };
    });
  }

  get lines() {
    return LinesModule.lines;
  }

  get isAdmin() {
    return UsersModule.currentUser.isAdmin;
  }

  onNumberChange(value: any) {
    TrainsModule.updateNewTrain({ number: value });
    this.newTrainNumber = this.newTrainNumber
      ? convertToArabic(this.newTrainNumber)
      : "";
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
