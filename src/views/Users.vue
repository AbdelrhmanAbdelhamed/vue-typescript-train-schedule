<template>
  <div class="users">
    <v-card>
      <v-card-title>
        {{ `ادارة الحسابات` }}
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-table-search"
          label="بحث باسم المستخدم"
          single-line
          hide-details
          clearable
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :loading="usersLoading"
        :headers="headers"
        :items="users"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:top v-if="$can('create', 'User')">
          <div class="mx-4">
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on"
                  >اضافة حساب جديد</v-btn
                >
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
                            required
                            @input="onFullNameChange"
                            label="الاسم كامل"
                            prepend-icon="mdi-account-outline"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            :rules="[v => !!v || 'برجاء ادخال اسم المسخدم']"
                            required
                            @input="onUsernameChange"
                            label="اسم المستخدم"
                            prepend-icon="mdi-account"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-combobox
                            :rules="[v => !!v || 'برجاء ادخال الجهة']"
                            required
                            :loading="policeDepartmentsLoading"
                            :return-object="false"
                            label="جهة المستخدم"
                            :items="policeDepartments"
                            item-value="name"
                            item-text="name"
                            hide-no-data
                            @input="onDepartmentChange"
                            prepend-icon="mdi-city"
                          ></v-combobox>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            :rules="[v => !!v || 'برجاء ادخال كلمة المرور']"
                            required
                            id="password"
                            label="كلمة المرور"
                            name="password"
                            prepend-icon="mdi-lock"
                            type="password"
                            @input="onPasswordChange"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            :return-object="true"
                            :loading="rolesLoading"
                            label="وظيفة المستخدم"
                            :items="roles"
                            item-value="name"
                            item-text="nameArabic"
                            prepend-icon="mdi-account-question"
                            @change="onUserRoleChange"
                          ></v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    :disabled="!isNewUserValid"
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

        <template v-slot:item.fullName="props">
          <v-edit-dialog
            :return-value.sync="props.item.fullName"
            @save="onEditFullNameSubmit(props.item.id, props.item.fullName)"
          >
            {{ props.item.fullName }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.fullName"
                label="تعديل الاسم الرباعي"
                single-line
                v-if="$can('update', 'User')"
              ></v-text-field>
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
                label="تعديل اسم المستخدم"
                single-line
                v-if="$can('update', 'User')"
              ></v-text-field>
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
                label="تعديل جهة المستخدم"
                :items="policeDepartments"
                item-value="name"
                item-text="name"
              ></v-combobox>
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
                      label="تعديل وظيفة المستخدم"
                      :items="roles"
                      item-value="name"
                      item-text="nameArabic"
                    ></v-autocomplete>
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
