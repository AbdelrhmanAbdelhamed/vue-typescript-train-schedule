<template>
  <div
    id="train-run-actions"
    v-if="$can('delete', 'TrainRun')"
    class="d-print-none"
  >
    <v-dialog v-model="dialog" persistent max-width="500">
      <template v-slot:activator="{ on }">
        <v-icon class="mr-10" color="error" v-on="on">
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
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="onDeleteClicked">مسح</v-btn>
          <v-btn text @click="dialog = false">الغاء</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import StationsModule from "@/store/modules/Stations";
import TrainsModule from "@/store/modules/Trains";
import UsersModule from "@/store/modules/Users";
import { ILine, ITrain } from "@/store/models";

@Component({
  components: {}
})
export default class TrainActions extends Vue {
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
