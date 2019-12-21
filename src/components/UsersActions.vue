<template>
  <div id="user-actions">
    <v-container>
      <v-row>
        <v-col>
          <v-dialog
            v-model="newPasswordDialog"
            max-width="500px"
            v-if="$can('update', user)"
          >
            <template v-slot:activator="{ on }">
              <v-btn small color="primary" dark v-on="on"
                >تغيير كلمة المرور</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline"
                  >تغيير كلمة مرور {{ user.username }}</span
                >
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form v-model="isNewPasswordValid">
                    <v-row justify="center" align="center">
                      <v-col cols="12">
                        <v-text-field
                          :rules="[
                            v => !!v || 'برجاء ادخال كلمة المرور الجديدة',
                            passwordConfirmationRule
                          ]"
                          required
                          id="password"
                          label="كلمة المرور الجديدة"
                          name="password"
                          prepend-icon="mdi-lock"
                          type="password"
                          v-model="newPassword"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          :rules="[
                            v =>
                              !!v || ' برجاء ادخال تأكيد كلمة المرور الجديدة',
                            passwordConfirmationRule
                          ]"
                          required
                          id="re-password"
                          label="تأكيد كلمة المرور الجديدة"
                          name="re-password"
                          prepend-icon="mdi-lock"
                          type="password"
                          v-model="reNewPassword"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  :disabled="!isNewPasswordValid"
                  color="success darken-1"
                  text
                  @click="onPasswordChangeClick"
                  >تغيير</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  text
                  @click="newPasswordDialog = false"
                  >الغاء</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col>
          <v-dialog
            v-model="deleteUserDialog"
            persistent
            max-width="290"
            v-if="$can('delete', 'User')"
          >
            <template v-slot:activator="{ on }">
              <v-icon color="error" v-on="on">mdi-delete</v-icon>
            </template>
            <v-card>
              <v-card-title class="headline"
                >مسح حساب {{ user.username }}</v-card-title
              >
              <v-card-text>هل أنت متأكد انك تريد مسح الحساب؟!</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="onDeleteClicked">مسح</v-btn>
                <v-btn text @click="deleteUserDialog = false">الغاء</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col>
          <v-autocomplete
            v-if="user.role.name === 'editor'"
            :value="user.trains"
            :return-object="true"
            :loading="loading"
            multiple
            small-chips
            deletable-chips
            dense
            hide-details
            label="قطارات المستخدم"
            :items="trains"
            item-value="number"
            item-text="number"
            @change="onTrainsChange(user.id, $event)"
          >
            <template v-slot:activator="{ on }">{{
              user.item.description
            }}</template>
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import UsersModule from "@/store/modules/Users";
import TrainsModule from "@/store/modules/Trains";

@Component({
  components: {}
})
export default class UserActions extends Vue {
  @Prop()
  user: any;
  deleteUserDialog = false;
  newPasswordDialog = false;
  isNewPasswordValid = false;
  newPassword = null;
  reNewPassword = null;

  get passwordConfirmationRule() {
    return (
      this.newPassword === this.reNewPassword ||
      "كلمة المرور الجديدة غير متطابقة"
    );
  }

  get loading() {
    return TrainsModule.loading || UsersModule.loading;
  }

  get trains() {
    return TrainsModule.trains;
  }

  onTrainsChange(id: string, value: any) {
    UsersModule.setTrains({ id, data: { trains: value } });
  }

  onPasswordChangeClick() {
    UsersModule.update({
      id: this.user.id,
      data: { password: this.newPassword }
    });
    this.newPasswordDialog = false;
  }

  onDeleteClicked() {
    UsersModule.delete(this.user.id);
    this.deleteUserDialog = false;
  }

  created() {
    TrainsModule.get();
  }
}
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
