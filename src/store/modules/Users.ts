import {
  getModule,
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action
} from "vuex-module-decorators";

import store from "..";
import { IUserState, IUser } from "../models";
import UsersAPI from "@/services/api/Users";
import AbilitiesModule from "../modules/Abilities";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: UsersAPI.END_POINT
})
class UsersModule extends VuexModule implements IUserState {
  currentUser: IUser = {
    fullName: localStorage.getItem("fullName") || "",
    username: "",
    password: "",
    token: localStorage.getItem("token") || ""
  };
  newUser: IUser = {
    username: "",
    password: ""
  };
  users: IUser[] = [];

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
    if (data.username) this.currentUser.username = data.username;
    if (data.fullName) this.currentUser.fullName = data.fullName;
    if (data.password) this.currentUser.password = data.password;
    if (data.token) {
      this.currentUser.token = data.token;
      AbilitiesModule.getRulesFromToken(this.currentUser.token);
      AbilitiesModule.updateAbility();
    }
  }

  @Mutation
  updateNewUserData(data: any) {
    if (data.username) this.newUser.username = data.username;
    if (data.fullName) this.newUser.fullName = data.fullName;
    if (data.password) this.newUser.password = data.password;
  }

  @Mutation
  createUser(user: IUser) {
    this.users.push(user);
  }

  @Mutation
  updateUser({ id, data }: { id?: string; data?: any } = {}) {
    let user = this.users.find(user => user.id == id);
    if (user) {
      if (data.username) user.username = data.username;
      if (data.fullName) user.fullName = data.fullName;
    }
  }

  @Mutation
  removeUser(id: string) {
    const index = this.users.findIndex(user => user.id === id);
    if (index > -1) this.users.splice(index, 1);
  }

  @Mutation
  setUsers(users: IUser[]) {
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
      localStorage.setItem("token", token);
      localStorage.setItem("fullName", user.fullName);
      UsersAPI.setAuthorizationHeader(token);
      user.token = token;
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
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    UsersAPI.clearAuthorizationHeader();
    const currentUser: IUser = {
      username: "",
      fullName: "",
      password: "",
      role: { name: "", nameArabic: "", description: "" },
      token: ""
    };
    const usernameErrorMessage = null;
    const passwordErrorMessage = null;
    return { currentUser, usernameErrorMessage, passwordErrorMessage };
  }

  @Action
  async getAll() {
    this.setLoading(true);

    const users: IUser[] = await UsersAPI.getAll();
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
      const user: IUser = await UsersAPI.create(this.newUser);
      this.createUser(user);
    }
    this.setLoading(false);
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
