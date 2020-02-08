<template>
  <div class="train-run-revision-details">
    <v-card :loading="loading">
      <v-card-title>
        سجل خدمات تأمين قطار رقم:
        {{ train.number | convertToArabic }}
      </v-card-title>
      <v-list
        v-if="trainRunsRevisions && trainRunsRevisions.length > 0"
        three-line
      >
        <template
          v-for="(trainRunsRevision, index) in trainRunsRevisions || []"
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
                v-if="trainRunsRevision.revisionValidTo"
                class="text--primary"
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
              <v-tooltip v-if="trainRunsRevision.revisionValidTo" bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-list-item-action-text>
                      منذ
                      {{ trainRunsRevision.revisionValidTo | timeFromNow }}
                    </v-list-item-action-text>
                  </span>
                </template>
                <span>{{
                  trainRunsRevision.revisionValidTo | formatDate
                }}</span>
              </v-tooltip>

              <v-tooltip v-else bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-list-item-action-text>
                      منذ
                      {{ trainRunsRevision.revisionValidFrom | timeFromNow }}
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
          />
        </template>
      </v-list>
      <v-card-text v-else>
        {{ loading ? "تحميل العنصر..." : "لا توجد بيانات متاحة" }}
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
import { moment } from "@/utils";

@Component({
  components: {}
})
export default class TrainRunRevisionDetails extends Vue {
  @Prop()
  id!: string;

  get loading() {
    return TrainsModule.loading;
  }

  get trainRunsRevisions(): any[] {
    TrainsModule.currentTrain.trainRunsRevisions =
      TrainsModule.currentTrain.trainRunsRevisions ?? [];
    return TrainsModule.currentTrain.trainRunsRevisions!.sort(
      (itemA: any, itemB: any) => {
        const maxDate = moment(8640000000000000);
        const minDate = moment(-8640000000000000);
        const sortKeyA = moment.max(
          moment(itemA.revisionValidFrom),
          itemA.revisionValidTo ? moment(itemA.revisionValidTo) : minDate
        );
        const sortKeyB = moment.max(
          moment(itemB.revisionValidFrom),
          itemB.revisionValidTo ? moment(itemB.revisionValidTo) : minDate
        );
        return sortKeyB.diff(sortKeyA);
      }
    );
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
