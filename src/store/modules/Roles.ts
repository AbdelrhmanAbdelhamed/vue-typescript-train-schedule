import {
  getModule,
  Module,
  Mutation,
  Action,
  VuexModule
} from "vuex-module-decorators";

import store from "..";
import { IRole, IRoleState } from "../models";
import RolesAPI from "@/services/api/Roles";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: RolesAPI.END_POINT
})
class RolesModule extends VuexModule implements IRoleState {
  roles: IRole[] = [];
  loading: boolean = false;

  @Mutation
  toggleLoading() {
    this.loading = !this.loading;
  }

  @Mutation
  setRoles(roles: IRole[]) {
    this.roles = roles;
  }

  @Mutation
  resetRoles() {
    this.roles = [];
  }

  @Action
  async getAll() {
    this.toggleLoading();
    const roles: IRole[] = await RolesAPI.getAll();
    this.setRoles(roles);
    this.toggleLoading();
  }
}

export default getModule(RolesModule);
