import Vue from "vue";
import Vuex from "vuex";
import {
  IStationState,
  ILineState,
  ITrainState,
  IPolicePersonState,
  IUserState
} from "./models";

Vue.use(Vuex);

export interface IRootState {
  stations: IStationState;
  lines: ILineState;
  trains: ITrainState;
  policePeople: IPolicePersonState;
  users: IUserState;
}

export default new Vuex.Store<IRootState>({});
