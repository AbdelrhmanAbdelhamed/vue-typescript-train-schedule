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
      this.newStation.line.LineStation = {
        ...this.newStation.line.LineStation,
        stationOrder: data.stationOrder
      };
    }
  }

  @Mutation
  setCurrentStation(station: IStation) {
    this.currentStation = station;
  }

  @Mutation
  createStation(station: any) {
    const index = this.stations.findIndex(
      stationItem => stationItem.id === station.id
    );
    if (index > -1) this.stations.splice(index, 1);
    this.stations.push(station);
  }

  @Mutation
  updateStation({ id, data }: { id?: string; data?: any } = {}) {
    let station = this.stations.find(station => station.id == id);
    if (station) {
      if (data.name) station.name = data.name;
    }
  }

  @Mutation
  updateLineStationOrder({
    id,
    lineId,
    data
  }: {
    id: string;
    lineId: string;
    data: any;
  }) {
    if (data.stationOrder > 0) {
      let station = this.stations.find(station => station.id == id);
      if (station && station.lines && station.lines.length > 0) {
        let line = station.lines.find(line => line.id == lineId);
        if (line && line.LineStation) {
          line.LineStation.stationOrder = data.stationOrder;
        }
      }
    }
  }

  @Mutation
  removeStation(id: string) {
    const index = this.stations.findIndex(station => station.id === id);
    if (index > -1) this.stations.splice(index, 1);
  }

  @Mutation
  removeLineStation({ id, lineId }: { id: string; lineId: string }) {
    const stationIndex = this.stations.findIndex(station => {
      return station.id === id;
    });
    if (stationIndex > -1) {
      const station: IStation = this.stations[stationIndex];
      if (station.lines && station.lines.length > 0) {
        const lineIndex = station.lines.findIndex(line => line.id == lineId);
        if (lineIndex > -1) {
          station.lines.splice(lineIndex, 1);
        }
      }
      if (!station.lines || station.lines.length < 1) {
        this.stations.splice(stationIndex, 1);
      }
    }
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
      const { station } = await StationsAPI.create(this.newStation);
      const createdStation: IStation = { ...this.newStation, ...station };
      if (!this.newStation.lines) this.newStation.lines = [];
      createdStation.lines = [...this.newStation.lines];
      if (createdStation.line)
        createdStation.lines.push({ ...createdStation.line });
      this.createStation({ ...createdStation });
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
  async updateStationOrder({
    id,
    lineId,
    data
  }: {
    id: string;
    lineId: string;
    data: any;
  }) {
    if (id && data && data.stationOrder > 0) {
      this.toggleLoading();
      await StationsAPI.updateStationOrder(id, lineId, data);
      this.updateStation({ id, data });
      this.updateLineStationOrder({ id, lineId, data });
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

  @Action
  async deleteLine({ id, lineId }: { id: string; lineId: string }) {
    this.toggleLoading();
    await StationsAPI.deleteLine(id, lineId);
    this.removeLineStation({ id, lineId });
    this.toggleLoading();
  }
}

export default getModule(StationsModule);
