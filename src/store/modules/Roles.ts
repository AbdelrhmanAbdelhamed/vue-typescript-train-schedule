import {
  getModule,
  Module,
  Mutation,
  Action,
  VuexModule
} from "vuex-module-decorators";

import store from "..";
import { Role, RoleState } from "../models";
import RolesAPI from "@/services/api/Roles";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: RolesAPI.END_POINT
})
class RolesModule extends VuexModule implements RoleState {
  roles: Role[] = [];
  loading: boolean = false;

  @Mutation
  toggleLoading() {
    this.loading = !this.loading;
  }

  @Mutation
  setRoles(roles: Role[]) {
    this.roles = roles;
  }

  @Mutation
  resetRoles() {
    this.roles = [];
  }

  @Action
  async getAll() {
    this.toggleLoading();
    const roles: Role[] = await RolesAPI.getAll();
    this.setRoles(roles);
    this.toggleLoading();
  }
}

export default getModule(RolesModule);
