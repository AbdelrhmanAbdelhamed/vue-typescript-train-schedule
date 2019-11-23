import {
  getModule,
  Module,
  Mutation,
  Action,
  VuexModule
} from "vuex-module-decorators";

import store from "..";
import { IRank, IRankState } from "../models";
import RanksAPI from "@/services/api/Ranks";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: RanksAPI.END_POINT
})
class RanksModule extends VuexModule implements IRankState {
  ranks: IRank[] = [];
  loading: boolean = false;

  @Mutation
  toggleLoading() {
    this.loading = !this.loading;
  }

  @Mutation
  setRanks(ranks: IRank[]) {
    this.ranks = ranks;
  }

  @Mutation
  resetRanks() {
    this.ranks = [];
  }

  @Action
  async getAll() {
    this.toggleLoading();
    const ranks: IRank[] = await RanksAPI.getAll();
    this.setRanks(ranks);
    this.toggleLoading();
  }
}

export default getModule(RanksModule);
