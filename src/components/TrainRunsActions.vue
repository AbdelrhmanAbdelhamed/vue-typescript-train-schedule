<template>
  <div>
    <div
      id="train-run-actions"
      v-if="$can('delete', trainRun)"
      class="d-print-none"
    >
      <v-dialog v-model="dialog" persistent max-width="500">
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" class="mr-10" color="error">
            mdi-delete
          </v-icon>
        </template>
        <v-card>
          <v-card-title class="headline">
            <span>
              مسح خدمة {{ trainRun.day | formatDayDate | convertToArabic }}
            </span>
            <v-chip color="error" class="ma-2">
              {{ ` الخاصة بقطار رقم:   ${train.number}` }}
            </v-chip>
          </v-card-title>
          <v-card-text>هل أنت متأكد انك تريد مسح الخدمة؟!</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="onDeleteClicked" color="error" text>
              مسح
            </v-btn>
            <v-btn @click="dialog = false" text>
              الغاء
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import StationsModule from "@/store/modules/Stations";
import TrainsModule from "@/store/modules/Trains";
import UsersModule from "@/store/modules/Users";
import { Line, Train } from "@/store/models";

@Component({
  components: {}
})
export default class TrainRunsActions extends Vue {
  @Prop()
  train: any;

  @Prop()
  trainRun: any;

  dialog = false;

  onDeleteClicked() {
    TrainsModule.deleteTrainRun({
      id: this.trainRun.id,
      trainId: this.train.id
    });
    this.dialog = false;
  }
}
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
