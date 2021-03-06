import {
  getModule,
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action
} from "vuex-module-decorators";

import store from "..";
import { UserState, User } from "../models";
import UsersAPI from "@/services/api/Users";
import AbilitiesModule from "../modules/Abilities";
import Vue from "vue";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: UsersAPI.END_POINT
})
class UsersModule extends VuexModule implements UserState {
  currentUser: User = {
    id: sessionStorage.getItem("userId") || "",
    fullName: sessionStorage.getItem("fullName") || "",
    username: "",
    password: "",
    token: sessionStorage.getItem("token") || "",
    trains: [],
    policeDepartment: {
      name: ""
    }
  };
  newUser: User = {
    username: "",
    password: "",
    trains: [],
    policeDepartment: {
      name: ""
    }
  };
  users: User[] = [];

  usernameErrorMessage = null;
  passwordErrorMessage = null;

  loading: boolean = false;

  get loggedIn() {
    return !!this.currentUser.token;
  }

  @Mutation
  setLoading(state: boolean) {
    this.loading = state;
  }

  @Mutation
  updateErrorMessage(data: any) {
    if (data.usernameErrorMessage || data.usernameErrorMessage === null)
      this.usernameErrorMessage = data.usernameErrorMessage;
    if (data.passwordErrorMessage || data.passwordErrorMessage === null)
      this.passwordErrorMessage = data.passwordErrorMessage;
  }

  @Mutation
  updateCurrentUserData(data: any) {
    if (data.id) this.currentUser.id = data.id;
    if (data.username) this.currentUser.username = data.username;
    if (data.fullName) this.currentUser.fullName = data.fullName;
    if (data.password) this.currentUser.password = data.password;
    if (data.token) {
      this.currentUser.token = data.token;
    }
    if (data.policeDepartmentName)
      this.newUser.policeDepartment!.name = data.policeDepartmentName;
    if (data.policeDepartmentId)
      this.newUser.policeDepartmentId = data.policeDepartmentId;
  }

  @Mutation
  updateNewUserData(data: any) {
    if (data.username) this.newUser.username = data.username;
    if (data.fullName) this.newUser.fullName = data.fullName;
    if (data.password) this.newUser.password = data.password;
    if (data.role) this.newUser.role = data.role;
    if (data.policeDepartmentName)
      this.newUser.policeDepartment!.name = data.policeDepartmentName;
    if (data.policeDepartmentId)
      this.newUser.policeDepartmentId = data.policeDepartmentId;
  }

  @Mutation
  createUser(user: User) {
    this.users.push(user);
  }

  @Mutation
  updateUser({ id, data }: { id?: string; data?: any } = {}) {
    let userIndex = this.users.findIndex(user => user.id == id);
    if (userIndex > -1) {
      if (data.username) this.users[userIndex].username = data.username;
      if (data.fullName) this.users[userIndex].fullName = data.fullName;
      if (data.policeDepartmentName)
        this.users[userIndex].policeDepartment!.name =
          data.policeDepartmentName;
      if (data.policeDepartmentId)
        this.users[userIndex].policeDepartmentId = data.policeDepartmentId;
      if (data.trains) {
        Vue.set(UsersModule.state.users[userIndex], "trains", data.trains);
      }
    }
  }

  @Mutation
  removeUser(id: string) {
    const index = this.users.findIndex(user => user.id === id);
    if (index > -1) this.users.splice(index, 1);
  }

  @Mutation
  setUsers(users: User[]) {
    this.users = users;
  }

  @Mutation
  resetUsers() {
    this.users = [];
  }

  @Action
  async login({ username, password }: { username: string; password: string }) {
    this.setLoading(true);
    try {
      const { user, token } = await UsersAPI.login({ username, password });
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("fullName", user.fullName);
      sessionStorage.setItem("userId", user.id);
      UsersAPI.setAuthorizationHeader(token);
      user.token = token;
      AbilitiesModule.getRulesFromToken(token);
      AbilitiesModule.updateAbility();
      this.updateCurrentUserData({ ...user });
    } catch (err) {
      if (err.response && err.response.status === 404)
        this.updateErrorMessage({
          usernameErrorMessage: "اسم المستخدم غير موجود"
        });
      else if (err.response && err.response.status === 401)
        this.updateErrorMessage({
          passwordErrorMessage: "كلمة المرور غير صحيحة"
        });
    }
    this.setLoading(false);
  }

  @MutationAction
  async logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("fullName");
    UsersAPI.clearAuthorizationHeader();
    const currentUser: User = {
      username: "",
      fullName: "",
      password: "",
      role: { name: "", nameArabic: "", description: "" },
      token: "",
      trains: []
    };
    AbilitiesModule.setRules([]);
    AbilitiesModule.updateAbility();
    const usernameErrorMessage = null;
    const passwordErrorMessage = null;
    return { currentUser, usernameErrorMessage, passwordErrorMessage };
  }

  @Action
  async getAll() {
    this.setLoading(true);

    const users: User[] = await UsersAPI.getAll();
    this.setUsers(users);

    this.setLoading(false);
  }

  @Action
  async create() {
    this.setLoading(true);

    if (
      this.newUser &&
      this.newUser.username !== "" &&
      this.newUser.password !== "" &&
      this.newUser.fullName !== ""
    ) {
      const user = await UsersAPI.create(this.newUser);
      this.createUser({ ...this.newUser, ...user });
    }
    this.setLoading(false);
  }

  @Action
  async setTrains({ id, data }: { id: string; data: any }) {
    if (id && data && data.trains && data.trains.length >= 0) {
      this.setLoading(true);
      await UsersAPI.setTrains(id, data.trains);
      this.updateUser({ id, data });

      this.setLoading(false);
    }
  }

  @Action
  async deleteTrain({ id, trainId }: { id: string; trainId: any }) {
    if (id && trainId) {
      this.setLoading(true);
      await UsersAPI.deleteTrain(id, trainId);
      let userIndex = this.users.findIndex(user => user.id == id);
      let trains = UsersModule.state.users[userIndex].trains.filter(
        train => train.id !== trainId
      );
      this.updateUser({ id, data: { trains } });
      this.setLoading(false);
    }
  }

  @Action
  async update({ id, data }: { id: string; data: any }) {
    if (id && data && (data.username !== "" || data.fullName !== "")) {
      this.setLoading(true);

      await UsersAPI.update(id, data);
      this.updateUser({ id, data });

      this.setLoading(false);
    }
  }

  @Action
  async delete(id: string) {
    this.setLoading(true);

    await UsersAPI.delete(id);
    this.removeUser(id);

    this.setLoading(false);
  }
}

export default getModule(UsersModule);
