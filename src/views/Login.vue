<template>
  <div class="login">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card :loading="loading" class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>تسجيل الدخول</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-form
                id="loginForm"
                @submit.prevent="onLoginClick"
                v-model="isUserValid"
              >
                <v-text-field
                  id="username"
                  :rules="[v => !!v || 'برجاء ادخال اسم المستخدم']"
                  @input="onUsernameChange"
                  :error-messages="usernameErrorMessage"
                  required
                  label="اسم المستخدم"
                  name="username"
                  prepend-icon="mdi-account"
                  type="text"
                />

                <v-text-field
                  id="password"
                  :rules="[v => !!v || 'برجاء ادخال كلمة المرور']"
                  @input="onPasswordChange"
                  :error-messages="passwordErrorMessage"
                  required
                  label="كلمة المرور"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :loading="loading"
                :disabled="!isUserValid"
                color="primary"
                type="submit"
                form="loginForm"
              >
                دخول
              </v-btn>
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
      if (UsersModule.loggedIn) this.$router.replace({ name: "home" });
    }
  }
}
</script>
