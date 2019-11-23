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

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: UsersAPI.END_POINT
})
class UsersModule extends VuexModule implements IUserState {
  currentUser: IUser = {
    username: "",
    password: "",
    token: localStorage.getItem("token") || "",
    isAdmin: localStorage.getItem("isAdmin") === "true"
  };
  newUser: IUser = {
    username: "",
    password: "",
    isAdmin: false
  };
  users: IUser[] = [];

  usernameErrorMessage = null;
  passwordErrorMessage = null;

  loading: boolean = false;

  get isAdmin() {
    return this.currentUser.isAdmin;
  }

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
    if (data.password) this.currentUser.password = data.password;
    if (data.token) this.currentUser.token = data.token;
    if (typeof data.isAdmin !== "undefined")
      this.currentUser.isAdmin = data.isAdmin;
  }

  @Mutation
  updateNewUserData(data: any) {
    if (data.username) this.newUser.username = data.username;
    if (data.password) this.newUser.password = data.password;
    if (typeof data.isAdmin !== "undefined")
      this.newUser.isAdmin = data.isAdmin;
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
      if (
        typeof data.isAdmin !== "undefined" &&
        user.id !== this.currentUser.id
      )
        user.isAdmin = data.isAdmin;
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
      localStorage.setItem("isAdmin", user.isAdmin);
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
    localStorage.removeItem("isAdmin");
    UsersAPI.clearAuthorizationHeader();
    const currentUser: IUser = {
      username: "",
      password: "",
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
      typeof this.newUser.isAdmin !== "undefined"
    ) {
      const user: IUser = await UsersAPI.create(this.newUser);
      this.createUser(user);
    }
    this.setLoading(false);
  }

  @Action
  async update({ id, data }: { id: string; data: any }) {
    if (
      id &&
      data &&
      (data.username !== "" ||
        (typeof data.isAdmin !== "undefined" &&
          data.id !== this.currentUser.id))
    ) {
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
