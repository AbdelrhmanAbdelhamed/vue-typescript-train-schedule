import {
  getModule,
  Module,
  Mutation,
  Action,
  VuexModule
} from "vuex-module-decorators";

import store from "..";
import { IPoliceDepartment, IPoliceDepartmentState } from "../models";
import PoliceDepartmentsAPI from "@/services/api/PoliceDepartments";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: PoliceDepartmentsAPI.END_POINT
})
class PoliceDepartmentsModule extends VuexModule
  implements IPoliceDepartmentState {
  policeDepartments: IPoliceDepartment[] = [];
  loading: boolean = false;

  @Mutation
  toggleLoading() {
    this.loading = !this.loading;
  }

  @Mutation
  setPoliceDepartments(policeDepartments: IPoliceDepartment[]) {
    this.policeDepartments = policeDepartments;
  }

  @Mutation
  resetPoliceDepartments() {
    this.policeDepartments = [];
  }

  @Action
  async getAll() {
    this.toggleLoading();
    const policeDepartments: IPoliceDepartment[] = await PoliceDepartmentsAPI.getAll();
    this.setPoliceDepartments(policeDepartments);
    this.toggleLoading();
  }
}

export default getModule(PoliceDepartmentsModule);
