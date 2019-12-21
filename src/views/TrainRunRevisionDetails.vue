<template>
  <div class="train-run-revision-details">
    <v-card :loading="loading">
      <v-card-title>سجل خدمات تأمين قطار رقم: {{ train.number }}</v-card-title>
      <v-list
        three-line
        v-if="train.trainRunsRevisions && train.trainRunsRevisions.length > 0"
      >
        <template
          v-for="(trainRunsRevision, index) in train.trainRunsRevisions || []"
        >
          <v-list-item
            :key="trainRunsRevision.revisionId + trainRunsRevision.id"
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

              <v-list-item-subtitle
                class="text--primary"
                v-if="trainRunsRevision.revisionValidTo"
              >
                تم اضافتها منذ:
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">
                      {{ trainRunsRevision.revisionValidFrom | timeFromNow }}
                    </span>
                  </template>
                  <span>{{
                    trainRunsRevision.revisionValidFrom | formatDate
                  }}</span>
                </v-tooltip>
              </v-list-item-subtitle>

              <v-list-item-subtitle class="text--primary">
                {{
                  trainRunsRevision.revisionValidTo
                    ? "تم مسحها بواسطة: "
                    : "تم اضافتها بواسطة: "
                }}
                {{ trainRunsRevision.whoDunnit }}
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
            v-if="index + 1 < (train.trainRunsRevisions || []).length"
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
import { Prop } from "vue-property-decorator";

import TrainsModule from "@/store/modules/Trains";
import { Train } from "@/store/models";

@Component({
  components: {}
})
export default class TrainRunRevisionDetails extends Vue {
  @Prop()
  id!: string;

  get loading() {
    return TrainsModule.loading;
  }

  get train(): Train {
    return TrainsModule.currentTrain;
  }

  async created() {
    if (this.id) {
      await TrainsModule.getRunsRevisionsByTrainId({ trainId: this.id });
    }
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
