import Vue from "vue";
import Vuex from "vuex";
import {
  StationState,
  LineState,
  TrainState,
  PolicePersonState,
  UserState,
  AbilityState
} from "./models";

Vue.use(Vuex);

export interface IRootState {
  stations: StationState;
  lines: LineState;
  trains: TrainState;
  policePeople: PolicePersonState;
  users: UserState;
  abilities: AbilityState;
  idleVue: {
    isIdle: boolean;
  };
}

export default new Vuex.Store<IRootState>({});
