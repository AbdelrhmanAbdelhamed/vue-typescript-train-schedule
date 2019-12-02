import axios from "axios";
import nprogress from "nprogress";

import router from "@/router";

import UsersModule from "@/store/modules/Users";
import AbilitiesModule from "@/store/modules/Abilities";
import UsersAPI from "./Users";

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

const token = localStorage.getItem("token");
if (token) {
  AbilitiesModule.getRulesFromToken(token);
  AbilitiesModule.updateAbility();
  UsersAPI.setAuthorizationHeader(token);
}

nprogress.configure({ showSpinner: false });

// before a request is made start the nprogress
axios.interceptors.request.use(config => {
  nprogress.start();
  return config;
});

// before a response is returned stop nprogress
axios.interceptors.response.use(
  response => {
    nprogress.done();
    return response;
  },
  async error => {
    if (error.response.status === 401 || error.response.status === 403) {
      await UsersModule.logout();
      if (router.currentRoute.name !== "login")
        router.replace({ name: "login" });
    }
    nprogress.done();
    throw error;
  }
);
