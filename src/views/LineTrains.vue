<template>
  <div class="trains">
    <v-card>
      <v-card-title v-if="line">
        {{ `قطارت خط ${line.name}` }}
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
        class="elevation-1"
        :search="search"
      >
        <template v-slot:item.number="{ item }">
          {{ item.number | convertToArabic }}
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

import LinesModule from "@/store/modules/Lines";

import { ILine } from "@/store/models";

@Component({
  components: { TrainActions }
})
export default class Trains extends Vue {
  headers = [
    { text: "رقم القطار", value: "number", sortable: true },
    { text: "", value: "action", sortable: false }
  ];
  search = "";

  get loading() {
    return LinesModule.loading;
  }

  @Prop()
  lineId!: string;

  get line() {
    return (this.$route.params.line || LinesModule.currentLine) as ILine;
  }

  get trains() {
    return this.line.trains || [];
  }

  created() {
    if (!this.$route.params.line && this.lineId) {
      LinesModule.getById(this.lineId);
    }
  }
}
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
