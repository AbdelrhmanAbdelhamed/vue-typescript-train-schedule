<template>
  <div class="lines">
    <v-card>
      <v-card-title>
        الخطوط
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-table-search"
          label="استعلام عن الخط"
          single-line
          hide-details
          clearable
        />
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="lines"
        :search="search"
        :footer-props="{
          showFirstLastPage: true
        }"
        class="elevation-1"
      >
        <template v-slot:top v-if="$can('create', 'Line')">
          <div class="mx-4">
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" color="primary" dark class="mb-2">
                  اضافة خط جديد
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">اضافة خط جديد</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-form v-model="isNewLineValid">
                      <v-row justify="center" align="center">
                        <v-col cols="12">
                          <v-text-field
                            :rules="[v => !!v || 'برجاء ادخال الاسم']"
                            @input="onNameChange"
                            required
                            label="اسم الخط"
                            prepend-icon="mdi-arrow-expand-horizontal"
                          />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    :disabled="!isNewLineValid"
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

        <template v-slot:item.name="props">
          <v-edit-dialog
            :return-value.sync="props.item.name"
            @save="onEditSubmit(props.item.id, props.item.name)"
          >
            {{ props.item.name }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.name"
                v-if="$can('update', 'Line')"
                label="تعديل اسم الخط"
                single-line
              />
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.stationCount="{ item }">
          {{ convertToArabic(item.stationCount | 0) }}
        </template>

        <template v-slot:item.action="{ item }">
          <LineActions :line="item" />
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import LineActions from "@/components/LineActions.vue";

import UsersModule from "@/store/modules/Users";
import LinesModule from "@/store/modules/Lines";

import { Line } from "@/store/models";

import { convertToArabic } from "@/utils";

@Component({
  components: { LineActions }
})
export default class Lines extends Vue {
  headers = [
    { text: "اسم الخط", value: "name", sortable: true },
    { text: "عدد المحطات", value: "stationCount", sortable: true },
    { text: "", value: "action", sortable: false }
  ];
  search = "";
  dialog: boolean = false;
  isNewLineValid = false;

  convertToArabic(value: any) {
    return convertToArabic(value);
  }

  get newLine() {
    return LinesModule.newLine;
  }

  get loading() {
    return LinesModule.loading;
  }

  get lines(): Line[] {
    return LinesModule.lines;
  }

  onNameChange(value: any) {
    LinesModule.updateNewLine({ name: value });
  }

  close() {
    this.dialog = false;
  }

  save() {
    LinesModule.create();
    this.close();
  }

  onEditSubmit(id: any, name: any) {
    if (name) LinesModule.update({ id, data: { name } });
  }

  async beforeCreate() {
    await LinesModule.getAll();
  }
}
</script>
