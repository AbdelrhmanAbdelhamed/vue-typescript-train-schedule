<template>
  <div class="login">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12" :loading="loading">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>تسجيل الدخول</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-form v-model="isUserValid">
                <v-text-field
                  :rules="[v => !!v || 'برجاء ادخال اسم المستخدم']"
                  required
                  id="username"
                  label="اسم المستخدم"
                  name="username"
                  prepend-icon="mdi-account"
                  type="text"
                  :error-messages="usernameErrorMessage"
                  @input="onUsernameChange"
                />

                <v-text-field
                  :rules="[v => !!v || 'برجاء ادخال كلمة المرور']"
                  required
                  id="password"
                  label="كلمة المرور"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  @input="onPasswordChange"
                  :error-messages="passwordErrorMessage"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :loading="loading"
                :disabled="!isUserValid"
                @click="onLoginClick"
                color="primary"
                type="submit"
                >دخول</v-btn
              >
            </v-card-actions>
          </v-card>
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

@Component({
  components: {}
})
export default class Login extends Vue {
  isUserValid = false;

  get loading() {
    return UsersModule.loading;
  }

  get user() {
    return UsersModule.currentUser;
  }

  get usernameErrorMessage() {
    return UsersModule.usernameErrorMessage;
  }

  get passwordErrorMessage() {
    return UsersModule.passwordErrorMessage;
  }

  onUsernameChange(value: any) {
    UsersModule.updateErrorMessage({ usernameErrorMessage: null });
    UsersModule.updateCurrentUserData({ username: value });
  }

  onPasswordChange(value: any) {
    UsersModule.updateErrorMessage({ passwordErrorMessage: null });
    UsersModule.updateCurrentUserData({ password: value });
  }

  async onLoginClick() {
    if (this.user.username && this.user.password) {
      await UsersModule.login({
        username: this.user.username,
        password: this.user.password
      });
      this.$router.replace({ name: "home" });
    }
  }
}
</script>
