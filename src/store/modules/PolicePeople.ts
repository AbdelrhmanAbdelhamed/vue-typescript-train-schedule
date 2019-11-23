import {
  getModule,
  Module,
  Mutation,
  Action,
  VuexModule
} from "vuex-module-decorators";

import store from "..";
import PolicePeopleAPI from "@/services/api/PolicePeople";
import { IPolicePerson, IPolicePersonState } from "../models";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: PolicePeopleAPI.END_POINT
})
class PolicePeopleModule extends VuexModule implements IPolicePersonState {
  policePeople: IPolicePerson[] = [];
  loading: boolean = false;

  @Mutation
  toggleLoading() {
    this.loading = !this.loading;
  }

  @Mutation
  setPolicePeople(policePeople: IPolicePerson[]) {
    this.policePeople = policePeople;
  }

  @Mutation
  resetPolicePeople() {
    this.policePeople = [];
  }

  @Action
  async getAll() {
    this.toggleLoading();
    const policePeople: IPolicePerson[] = await PolicePeopleAPI.getAll();
    this.setPolicePeople(policePeople);
    this.toggleLoading();
  }
}

export default getModule(PolicePeopleModule);
