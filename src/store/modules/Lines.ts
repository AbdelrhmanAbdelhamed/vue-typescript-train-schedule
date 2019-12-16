import {
  getModule,
  Module,
  Mutation,
  Action,
  VuexModule
} from "vuex-module-decorators";

import store from "..";
import LinesAPI from "@/services/api/Lines";
import { Line, LineState, Station, Train } from "../models";

@Module({ dynamic: true, namespaced: true, store, name: LinesAPI.END_POINT })
class LinesModule extends VuexModule implements LineState {
  lines: Line[] = [];
  stations: Station[] = [];
  trains: Train[] = [];
  newLine = this.createEmptyLine();
  currentLine: Line = {
    name: "",
    stations: [],
    trains: []
  };
  loading: boolean = false;

  @Mutation
  toggleLoading() {
    this.loading = !this.loading;
  }

  private createEmptyLine(): Line {
    return {
      name: "",
      stations: [],
      trains: []
    };
  }

  @Mutation
  resetNewLine() {
    this.newLine = this.createEmptyLine();
  }

  @Mutation
  setNewLine(line: Line) {
    this.newLine = line;
  }

  @Mutation
  updateNewLine(data: any) {
    if (data.name) this.newLine.name = data.name;
    if (data.stations) this.newLine.stations = data.stations;
  }

  @Mutation
  setCurrentLine(line: Line) {
    this.currentLine = line;
  }

  @Mutation
  setCurrentLineStations(stations: Station[]) {
    if (stations) {
      if (
        stations.length > 0 &&
        stations[0].lines &&
        stations[0].lines.length > 0
      ) {
        this.currentLine = {
          trains: [...this.currentLine.trains!],
          ...stations[0].lines[0]
        };
      } else if ((stations as any).line) {
        this.currentLine = {
          trains: [...this.currentLine.trains!],
          ...(stations as any).line
        };
      }
      this.currentLine.stations = stations.length > 0 ? stations : [];
    }
  }

  @Mutation
  setCurrentLineTrains(trains: Train[]) {
    if (trains) {
      if (trains.length > 0 && trains[0].lines && trains[0].lines.length > 0) {
        this.currentLine = { ...trains[0].lines[0] };
      } else if ((trains as any).line) {
        this.currentLine = (trains as any).line;
      }
      this.currentLine.trains = trains.length > 0 ? trains : [];
    }
  }

  @Mutation
  createLine(line: Line) {
    this.lines.push(line);
  }

  @Mutation
  pushTrainToCurrentLine(train: Train) {
    if (!this.currentLine.trains) this.currentLine.trains = [];
    this.currentLine.trains.push(train);
  }

  @Mutation
  removeTrainFromCurrentLine(trainId: string) {
    if (this.currentLine.trains) {
      const index = this.currentLine.trains!.findIndex(
        train => train.id === trainId
      );
      if (index > -1) {
        this.currentLine.trains.splice(index, 1);
      }
    }
  }

  @Mutation
  updateLineTrain({ trainId, data }: { trainId?: string; data?: any } = {}) {
    if (this.currentLine.trains && data.number) {
      let train = this.currentLine.trains.find(train => train.id == trainId);
      if (train) train.number = data.number;
    }
  }

  @Mutation
  updateLine({ id, data }: { id?: string; data?: any } = {}) {
    let line = this.lines.find(line => line.id == id);
    if (line) line.name = data.name;
  }

  @Mutation
  removeLine(id: string) {
    const index = this.lines.findIndex(line => line.id === id);
    if (index > -1) this.lines.splice(index, 1);
  }

  @Mutation
  setLines(lines: Line[]) {
    this.lines = lines;
  }

  @Mutation
  restLines() {
    this.lines = [];
  }

  @Mutation
  setStations(stations: Station[]) {
    this.stations = stations;
  }

  @Mutation
  restStations() {
    this.stations = [];
  }

  @Mutation
  setTrains(trains: Train[]) {
    this.trains = trains;
  }

  @Mutation
  resetTrains() {
    this.trains = [];
  }

  @Action
  async getAll() {
    this.toggleLoading();
    const lines: Line[] = await LinesAPI.getAll();
    this.setLines(lines);
    this.toggleLoading();
  }

  @Action
  async getById(id: string) {
    this.toggleLoading();
    const line: Line = await LinesAPI.getById(id);
    this.setCurrentLine(line);
    this.toggleLoading();
    return line;
  }

  @Action
  async getStations(id: string) {
    this.toggleLoading();
    const stations: Station[] = await LinesAPI.getStations(id);
    this.setCurrentLineStations(stations);
    this.toggleLoading();
  }

  @Action
  async getTrains(id: string) {
    this.toggleLoading();
    const trains: Train[] = await LinesAPI.getTrains(id);
    this.setCurrentLineTrains(trains);
    this.toggleLoading();
  }

  @Action
  async create() {
    this.toggleLoading();
    if (this.newLine.name !== "") {
      const line: Line = await LinesAPI.create(this.newLine);
      line.trains = [];
      line.stations = [];
      this.createLine({ ...line });
    }
    this.toggleLoading();
  }

  @Action
  async update({ id, data }: { id: string; data: any }) {
    if (id && data && data.name !== "") {
      this.toggleLoading();
      await LinesAPI.update(id, data);
      this.updateLine({ id, data });
      this.toggleLoading();
    }
  }

  @Action
  async delete(id: string) {
    this.toggleLoading();
    await LinesAPI.delete(id);
    this.removeLine(id);
    this.toggleLoading();
  }
}

export default getModule(LinesModule);
