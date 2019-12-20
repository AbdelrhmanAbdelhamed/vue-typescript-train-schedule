<template>
  <div class="train-runs-revisions">
    <v-card :loading="loading">
      <v-card-title>سجل جميع الخدمات</v-card-title>
      <v-list
        three-line
        v-if="trainRunsRevisions && trainRunsRevisions.length > 0"
      >
        <template
          v-for="({ train, item: trainRunsRevision },
          index) in trainRunsRevisions || []"
        >
          <v-list-item
            :key="trainRunsRevision.revisionId"
            :class="
              `${
                trainRunsRevision.revisionValidTo ? 'destroyed' : 'created'
              }-left-border`
            "
          >
            <v-list-item-content>
              <v-list-item-title>
                تاريخ الخدمة:
                {{ trainRunsRevision.day | formatDayDate | convertToArabic }}
              </v-list-item-title>
              <v-list-item-subtitle class="text--primary">
                {{
                  trainRunsRevision.revisionValidTo
                    ? "تم مسحها بواسطة: "
                    : "تمت اضافتها بواسطة: "
                }}
                {{ trainRunsRevision.whoDunnit }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text--primary">
                رقم القطار:
                {{ train.number }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-tooltip bottom v-if="trainRunsRevision.revisionValidTo">
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-list-item-action-text>
                      {{ trainRunsRevision.revisionValidTo | timeFromNow }}
                    </v-list-item-action-text>
                  </span>
                </template>
                <span>{{
                  trainRunsRevision.revisionValidTo | formatDate
                }}</span>
              </v-tooltip>

              <v-tooltip bottom v-else>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-list-item-action-text
                      >{{ trainRunsRevision.revisionValidFrom | timeFromNow }}
                    </v-list-item-action-text>
                  </span>
                </template>
                <span>{{
                  trainRunsRevision.revisionValidFrom | formatDate
                }}</span>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>

          <v-divider
            v-if="index + 1 < (trainRunsRevisions || []).length"
            :key="index"
          ></v-divider>
        </template>
      </v-list>
      <v-card-text v-else>
        لا توجد بيانات متاحة
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import TrainsModule from "@/store/modules/Trains";
import { TrainRunRevision } from "@/store/models";

@Component({
  components: {}
})
export default class TrainRunsRevisions extends Vue {
  get loading() {
    return TrainsModule.loading;
  }

  get trainRunsRevisions(): any {
    return TrainsModule.trainRunsRevisions;
  }

  async created() {
    TrainsModule.getAllTrainRunsRevisions();
  }
}
</script>

<style lang="scss">
.created-left-border {
  border-left: 4px solid #3cd1c2;
}
.destroyed-left-border {
  border-left: 4px solid tomato;
}
</style>
