import {
  getModule,
  Module,
  Mutation,
  Action,
  VuexModule
} from "vuex-module-decorators";

import store from "..";
import { PoliceDepartment, PoliceDepartmentState } from "../models";
import PoliceDepartmentsAPI from "@/services/api/PoliceDepartments";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: PoliceDepartmentsAPI.END_POINT
})
class PoliceDepartmentsModule extends VuexModule
  implements PoliceDepartmentState {
  policeDepartments: PoliceDepartment[] = [];
  loading: boolean = false;

  @Mutation
  toggleLoading() {
    this.loading = !this.loading;
  }

  @Mutation
  setPoliceDepartments(policeDepartments: PoliceDepartment[]) {
    this.policeDepartments = policeDepartments;
  }

  @Mutation
  resetPoliceDepartments() {
    this.policeDepartments = [];
  }

  @Action
  async getAll() {
    this.toggleLoading();
    const policeDepartments: PoliceDepartment[] = await PoliceDepartmentsAPI.getAll();
    this.setPoliceDepartments(policeDepartments);
    this.toggleLoading();
  }
}

export default getModule(PoliceDepartmentsModule);
