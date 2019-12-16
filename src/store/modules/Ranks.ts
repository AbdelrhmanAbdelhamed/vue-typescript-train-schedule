import {
  getModule,
  Module,
  Mutation,
  Action,
  VuexModule
} from "vuex-module-decorators";

import store from "..";
import { Rank, RankState } from "../models";
import RanksAPI from "@/services/api/Ranks";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: RanksAPI.END_POINT
})
class RanksModule extends VuexModule implements RankState {
  ranks: Rank[] = [];
  loading: boolean = false;

  @Mutation
  toggleLoading() {
    this.loading = !this.loading;
  }

  @Mutation
  setRanks(ranks: Rank[]) {
    this.ranks = ranks;
  }

  @Mutation
  resetRanks() {
    this.ranks = [];
  }

  @Action
  async getAll() {
    this.toggleLoading();
    const ranks: Rank[] = await RanksAPI.getAll();
    this.setRanks(ranks);
    this.toggleLoading();
  }
}

export default getModule(RanksModule);
