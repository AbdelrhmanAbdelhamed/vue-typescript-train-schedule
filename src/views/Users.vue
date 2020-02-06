<template>
  <div class="users">
    <v-card>
      <v-card-title>
        {{ `ادارة الحسابات` }}
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-table-search"
          label="بحث باسم المستخدم"
          single-line
          hide-details
          clearable
        />
      </v-card-title>
      <v-data-table
        :loading="usersLoading"
        :headers="headers"
        :items="users"
        :search="search"
        :footer-props="{
          showFirstLastPage: true
        }"
        class="elevation-1"
      >
        <template v-slot:top v-if="$can('create', 'User')">
          <div class="mx-4">
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" color="primary" dark class="mb-2">
                  اضافة حساب جديد
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">اضافة حساب جديد</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-form v-model="isNewUserValid">
                      <v-row justify="center" align="center">
                        <v-col cols="12">
                          <v-text-field
                            :rules="[v => !!v || 'برجاء ادخال الاسم كامل']"
                            @input="onFullNameChange"
                            required
                            label="الاسم كامل"
                            prepend-icon="mdi-account-outline"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            :rules="[v => !!v || 'برجاء ادخال اسم المسخدم']"
                            @input="onUsernameChange"
                            required
                            label="اسم المستخدم"
                            prepend-icon="mdi-account"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-combobox
                            :rules="[v => !!v || 'برجاء ادخال الجهة']"
                            :loading="policeDepartmentsLoading"
                            :return-object="false"
                            :items="policeDepartments"
                            @input="onDepartmentChange"
                            required
                            label="جهة المستخدم"
                            item-value="name"
                            item-text="name"
                            hide-no-data
                            prepend-icon="mdi-city"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            id="password"
                            :rules="[
                              v => !!v || 'برجاء ادخال كلمة المرور',
                              passwordConfirmationRule
                            ]"
                            @input="onPasswordChange"
                            required
                            label="كلمة المرور"
                            name="password"
                            prepend-icon="mdi-lock"
                            type="password"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            id="re-password"
                            :rules="[
                              v => !!v || 'برجاء ادخال تأكيد كلمة المرور',
                              passwordConfirmationRule
                            ]"
                            v-model="rePassword"
                            required
                            label="تأكيد كلمة المرور"
                            name="re-password"
                            prepend-icon="mdi-lock"
                            type="password"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            :return-object="true"
                            :loading="rolesLoading"
                            :items="roles"
                            @change="onUserRoleChange"
                            label="وظيفة المستخدم"
                            item-value="name"
                            item-text="nameArabic"
                            prepend-icon="mdi-account-question"
                          />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    :disabled="!isNewUserValid"
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

        <template v-slot:item.fullName="props">
          <v-edit-dialog
            :return-value.sync="props.item.fullName"
            @save="onEditFullNameSubmit(props.item.id, props.item.fullName)"
          >
            {{ props.item.fullName }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.fullName"
                v-if="$can('update', 'User')"
                label="تعديل الاسم الرباعي"
                single-line
              />
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.username="props">
          <v-edit-dialog
            :return-value.sync="props.item.username"
            @save="onEditUsernameSubmit(props.item.id, props.item.username)"
          >
            {{ props.item.username }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.username"
                v-if="$can('update', 'User')"
                label="تعديل اسم المستخدم"
                single-line
              />
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.policeDepartment.name="props">
          <v-edit-dialog
            :return-value.sync="props.item.policeDepartment.name"
            @save="
              onPoliceDepartmentEditSubmit(
                props.item.id,
                props.item.policeDepartment.name
              )
            "
          >
            {{ props.item.policeDepartment.name }}
            <template v-slot:input>
              <v-combobox
                v-model="props.item.policeDepartment.name"
                :return-object="false"
                :loading="policeDepartmentsLoading"
                :items="policeDepartments"
                label="تعديل جهة المستخدم"
                item-value="name"
                item-text="name"
              />
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.role="props">
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-edit-dialog
                  :return-value.sync="props.item.role.nameArabic"
                  @save="onRoleEditSubmit(props.item.id, props.item.role.id)"
                >
                  {{ props.item.role.nameArabic }}
                  <template v-slot:input>
                    <v-autocomplete
                      v-model="props.item.role"
                      :return-object="true"
                      :loading="rolesLoading"
                      :items="roles"
                      label="تعديل وظيفة المستخدم"
                      item-value="name"
                      item-text="nameArabic"
                    />
                  </template>
                </v-edit-dialog>
              </span>
            </template>
            <span>{{ props.item.role.description }}</span>
          </v-tooltip>
        </template>

        <template v-slot:item.action="{ item }">
          <UserActions :user="item" />
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import UserActions from "@/components/UsersActions.vue";

import PoliceDepartmentsModule from "@/store/modules/PoliceDepartments";
import UsersModule from "@/store/modules/Users";
import RolesModule from "@/store/modules/Roles";
import { User, Role, PoliceDepartment } from "@/store/models";

@Component({
  components: { UserActions }
})
export default class Users extends Vue {
  headers = [
    { text: "الاسم رباعي", value: "fullName", sortable: true },
    { text: "اسم المستخدم", value: "username", sortable: true },
    { text: "جهة المستخدم", value: "policeDepartment.name", sortable: true },
    { text: "وظيفة المستخدم", value: "role", sortable: true },
    { text: "", value: "action", sortable: false }
  ];
  search = "";
  dialog = false;
  isNewUserValid = false;
  rePassword = "";

  get passwordConfirmationRule() {
    return (
      this.newUser.password === this.rePassword || "كلمة المرور غير متطابقة"
    );
  }

  get usersLoading() {
    return UsersModule.loading;
  }

  get rolesLoading() {
    return RolesModule.loading;
  }

  get policeDepartmentsLoading() {
    return PoliceDepartmentsModule.loading;
  }

  get newUser(): User {
    return UsersModule.newUser;
  }

  get users(): User[] {
    return UsersModule.users;
  }

  get roles(): Role[] {
    return RolesModule.roles;
  }

  get policeDepartments(): PoliceDepartment[] {
    return PoliceDepartmentsModule.policeDepartments;
  }

  onUsernameChange(value: any) {
    UsersModule.updateNewUserData({ username: value });
  }

  onFullNameChange(value: any) {
    UsersModule.updateNewUserData({ fullName: value });
  }

  onDepartmentChange(value: any) {
    UsersModule.updateNewUserData({
      policeDepartmentName: value,
      policeDepartmentId: value.id
    });
  }

  onPasswordChange(value: any) {
    UsersModule.updateNewUserData({ password: value });
  }

  onUserRoleChange(value: any) {
    UsersModule.updateNewUserData({ role: value });
  }

  onEditFullNameSubmit(id: any, fullName: any) {
    if (fullName) UsersModule.update({ id, data: { fullName } });
  }

  onEditUsernameSubmit(id: any, username: any) {
    if (username) UsersModule.update({ id, data: { username } });
  }

  onRoleEditSubmit(id: any, roleId: any) {
    if (roleId) UsersModule.update({ id, data: { roleId } });
  }

  onPoliceDepartmentEditSubmit(id: any, policeDepartmentName: any) {
    if (policeDepartmentName)
      UsersModule.update({ id, data: { policeDepartmentName } });
  }

  close() {
    this.dialog = false;
  }

  save() {
    if (this.newUser.username && this.newUser.password) {
      UsersModule.create();
      this.close();
    }
  }

  created() {
    UsersModule.getAll();
    RolesModule.getAll();
    PoliceDepartmentsModule.getAll();
  }
}
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>
