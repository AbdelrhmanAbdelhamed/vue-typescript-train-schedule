import {
  getModule,
  Module,
  Mutation,
  Action,
  VuexModule
} from "vuex-module-decorators";

import store from "..";
import StationsAPI from "@/services/api/Stations";
import { IStation, IStationState, ILine } from "../models";
import Trains from "./Trains";

@Module({ dynamic: true, namespaced: true, store, name: StationsAPI.END_POINT })
class StationsModule extends VuexModule implements IStationState {
  stations: IStation[] = [];
  newStation = this.createEmptyStation();
  currentStation = this.createEmptyStation();
  loading: boolean = false;

  @Mutation
  toggleLoading() {
    this.loading = !this.loading;
  }

  createEmptyStation(): IStation {
    return {
      name: "",
      lines: [],
      line: {
        name: "",
        LineStation: {
          stationOrder: 0
        }
      }
    };
  }

  @Mutation
  resetNewStation() {
    this.newStation = this.createEmptyStation();
  }

  @Mutation
  setNewStation(station: ILine) {
    this.newStation = station;
  }

  @Mutation
  updateNewStation(data: any) {
    if (data.name) this.newStation.name = data.name;
    if (data.line && this.newStation.line) {
      this.newStation.line = {
        ...data.line,
        LineStation: this.newStation.line.LineStation
      };
    }
    if (
      data.stationOrder &&
      this.newStation.line &&
      this.newStation.line.LineStation
    ) {
      this.newStation.line.LineStation.stationOrder = data.stationOrder;
    }
  }

  @Mutation
  setCurrentStation(station: IStation) {
    this.currentStation = station;
  }

  @Mutation
  createStation(station: IStation) {
    this.stations.push(station);
  }

  @Mutation
  updateStation({ id, data }: { id?: string; data?: any } = {}) {
    let station = this.stations.find(station => station.id == id);
    if (station) station.name = data.name;
  }

  @Mutation
  removeStation(id: string) {
    const index = this.stations.findIndex(station => station.id === id);
    if (index > -1) this.stations.splice(index, 1);
  }

  @Mutation
  setStations(stations: IStation[]) {
    this.stations = stations;
  }

  @Mutation
  restStations() {
    this.stations = [];
  }

  @Action
  async getAll() {
    this.toggleLoading();
    const stations: IStation[] = await StationsAPI.getAll();
    this.setStations(stations);
    this.toggleLoading();
  }

  @Action
  async getById(id: string) {
    this.toggleLoading();
    const station: IStation = await StationsAPI.getById(id);
    this.setCurrentStation(station);
    this.toggleLoading();
  }

  @Action
  async create() {
    this.toggleLoading();

    if (this.newStation.name !== "") {
      const station: IStation = await StationsAPI.create(this.newStation);

      this.newStation.id = station.id;
      this.newStation.createdAt = station.createdAt;
      this.newStation.UpdatedAt = station.UpdatedAt;

      if (this.newStation.lines && this.newStation.line) {
        this.newStation.lines.push(this.newStation.line);
      }
      this.createStation(this.newStation);
    }
    this.toggleLoading();
  }

  @Action
  async update({ id, data }: { id: string; data: any }) {
    if (id && data && data.name !== "") {
      this.toggleLoading();
      await StationsAPI.update(id, data);
      this.updateStation({ id, data });
      this.toggleLoading();
    }
  }

  @Action
  async delete(id: string) {
    this.toggleLoading();
    await StationsAPI.delete(id);
    this.removeStation(id);
    this.toggleLoading();
  }
}

export default getModule(StationsModule);
