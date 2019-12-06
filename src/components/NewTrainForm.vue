<template>
  <div class="mx-4 d-print-none" v-if="$can('create', 'Train')">
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>
    <v-dialog v-model="dialog" max-width="1000px">
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
              <v-row no-gutters>
                <v-col cols="12" class="title"
                  >- أدخل رقم القطار ثم قم بتحديد وقت قيام ووقت وصول القطار
                  بمحطات خط
                  <span class="indigo--text"> {{ line.name }} </span></v-col
                >
                <v-col cols="12" class="subtitle-1"
                  >- اترك خانة وقت القيام فارغة اذا كان القطار لا يقوم من
                  المحطة</v-col
                >
                <v-col cols="12" class="mb-2 subtitle-1"
                  >- اترك خانة وقت الوصول فارغة اذا كان القطار لا يصل الى
                  المحطة</v-col
                >
              </v-row>
              <v-row justify="center" align="center">
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    :rules="[v => !!v || 'برجاء ادخال الرقم']"
                    required
                    @input="onNumberChange"
                    label="رقم القطار"
                    placeholder="قم بإدخال رقم القطار المراد اضافته"
                    outlined
                    prepend-icon="mdi-train"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center" align="center">
                <v-expansion-panels inset focusable>
                  <v-expansion-panel
                    v-for="(station, index) in newTrain.stations"
                    :key="station.id"
                  >
                    <v-expansion-panel-header>
                      <span class="subtitle-2">محطة {{ station.name }}</span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-container>
                        <v-row>
                          <v-col>
                            <v-menu
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  :value="station.LineStationTrain.arrivalTime"
                                  @input="onArrivalTimeChange(index, $event)"
                                  @click:clear="
                                    onArrivalTimeChange(index, null)
                                  "
                                  label="وقت الوصول"
                                  prepend-icon="mdi-clock"
                                  clearable
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                format="24hr"
                                scrollable
                                ampm-in-title
                                full-width
                                @change="onArrivalTimeChange(index, $event)"
                              ></v-time-picker>
                            </v-menu>
                          </v-col>

                          <v-divider vertical class="mr-2"></v-divider>

                          <v-col>
                            <v-menu
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  :value="
                                    station.LineStationTrain.departureTime
                                  "
                                  @input="onDepartureTimeChange(index, $event)"
                                  @click:clear="
                                    onDepartureTimeChange(index, null)
                                  "
                                  label="وقت القيام"
                                  prepend-icon="mdi-clock"
                                  v-on="on"
                                  clearable
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                format="24hr"
                                scrollable
                                ampm-in-title
                                full-width
                                @change="onDepartureTimeChange(index, $event)"
                              ></v-time-picker>
                            </v-menu>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
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
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import TrainsModule from "@/store/modules/Trains";

@Component({
  components: {}
})
export default class NewTrainForm extends Vue {
  dialog = false;
  isNewTrainValid = false;
  newTrainNumber = "";

  get loading() {
    return TrainsModule.loading;
  }

  get newTrain() {
    return TrainsModule.newTrain;
  }

  @Prop()
  line!: string;

  onDepartureTimeChange(index: any, value: any) {
    TrainsModule.updateNewTrainStation({
      index,
      data: { departureTime: value }
    });
  }

  onArrivalTimeChange(index: any, value: any) {
    TrainsModule.updateNewTrainStation({
      index,
      data: { arrivalTime: value }
    });
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
}
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
