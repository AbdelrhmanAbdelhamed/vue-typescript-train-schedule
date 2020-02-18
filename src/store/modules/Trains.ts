import { cloneDeep } from "lodash";
import {
  getModule,
  Module,
  Mutation,
  Action,
  VuexModule
} from "vuex-module-decorators";

import store from "..";
import TrainsAPI from "@/services/api/Trains";
import {
  Train,
  TrainState,
  TrainRun,
  PolicePerson,
  PoliceDepartment,
  Rank,
  TrainRunRevision,
  Station
} from "../models";

import LinesModule from "@/store/modules/Lines";
import UsersModule from "@/store/modules/Users";

import Vue from "vue";

@Module({ dynamic: true, namespaced: true, store, name: TrainsAPI.END_POINT })
class TrainsModule extends VuexModule implements TrainState {
  trains: Train[] = [];
  departureStation: string = "";
  arrivalStation: string = "";
  searchedTrains: Train[] = [];
  showTable: boolean = false;
  newTrain: Train = this.createEmptyTrain();
  currentTrain: Train = {
    number: "",
    trainRuns: [],
    trainRunsRevisions: [],
    stations: LinesModule.currentLine.stations
      ? [...LinesModule.currentLine.stations]
      : []
  };

  newTrainRun: TrainRun = {
    userId: UsersModule.currentUser.id!,
    day: new Date().toLocaleDateString(),
    policePeople: [
      {
        TrainRunPolicePerson: {
          fromStation: {
            name: ""
          },
          toStation: {
            name: ""
          }
        },
        fromStationId: "",
        toStationId: "",
        name: "",
        phoneNumber: "",
        rank: { name: "" },
        policeDepartment: { name: "" }
      }
    ],
    train: this.currentTrain,
    trainId: this.currentTrain ? this.currentTrain.id : ""
  };

  trainRuns: TrainRun[] = [];
  trainRunsRevisions: TrainRunRevision[] = [];
  loading: boolean = false;

  newTrainRunDateErrorMessage = null;
  newTrainNumberErrorMessage = null;

  updateTrainErrorMessage = null;

  @Mutation
  updateErrorMessage(data: any) {
    if (
      data.newTrainRunDateErrorMessage ||
      data.newTrainRunDateErrorMessage === null
    )
      this.newTrainRunDateErrorMessage = data.newTrainRunDateErrorMessage;
    if (
      data.newTrainNumberErrorMessage ||
      data.newTrainNumberErrorMessage === null
    ) {
      this.newTrainNumberErrorMessage = data.newTrainNumberErrorMessage;
    }
    if (data.updateTrainErrorMessage || data.updateTrainErrorMessage === null) {
      this.updateTrainErrorMessage = data.updateTrainErrorMessage;
    }
  }

  @Mutation
  toggleLoading() {
    this.loading = !this.loading;
  }

  createEmptyTrain(): Train {
    return {
      number: "",
      trainRuns: [],
      trainRunsRevisions: []
    };
  }

  createEmptyTrainRun(): TrainRun {
    return {
      day: "",
      policePeople: [],
      userId: UsersModule.currentUser.id!,
      train: this.currentTrain,
      trainId: this.currentTrain ? this.currentTrain.id : ""
    };
  }

  createEmptyPoliceDepartment(): PoliceDepartment {
    return {
      name: "",
      policePeople: []
    };
  }

  createEmptyRank(): Rank {
    return {
      name: "",
      policePeople: []
    };
  }

  createEmptyPolicePerson(): PolicePerson {
    return {
      name: "",
      phoneNumber: "",
      policeDepartment: this.createEmptyPoliceDepartment(),
      rank: this.createEmptyRank()
    };
  }

  @Mutation
  setShowTable(showTable: boolean) {
    this.showTable = showTable;
  }

  @Mutation
  resetNewTrainRun() {
    this.newTrainRun = {
      day: "",
      policePeople: [
        {
          name: "",
          phoneNumber: "",
          rank: { name: "" },
          policeDepartment: { name: "" }
        }
      ],
      userId: UsersModule.currentUser.id!,
      train: this.currentTrain,
      trainId: this.currentTrain ? this.currentTrain.id : ""
    };
  }

  @Mutation
  setArrivalStation(arrivalStation: string) {
    this.arrivalStation = arrivalStation;
  }

  @Mutation
  setDepartureStation(departureStation: string) {
    this.departureStation = departureStation;
  }

  @Mutation
  resetArrivalStation() {
    this.arrivalStation = "";
  }

  @Mutation
  resetDepartureStation() {
    this.departureStation = "";
  }

  @Mutation
  resetNewTrain() {
    this.newTrain = this.createEmptyTrain();
  }

  @Mutation
  setNewTrain(train: Train) {
    this.newTrain = train;
  }

  @Mutation
  updateNewTrain(data: any) {
    if (data.number) this.newTrain.number = data.number;
    if (data.stations) {
      Vue.set(TrainsModule.state.newTrain, "stations", data.stations);
    }
  }

  @Mutation
  updateNewTrainStation({ index, data }: { index?: any; data?: any }) {
    if (
      this.newTrain.stations &&
      this.newTrain.stations.length >= 0 &&
      index >= 0
    ) {
      if (data.departureTime === null || data.departureTime) {
        this.newTrain.stations[index].LineTrainStation!.departureTime =
          data.departureTime;
        this.newTrain.stations[index].LineTrainStation!.isDeprature =
          data.departureTime !== null;
      }

      if (data.arrivalTime === null || data.arrivalTime) {
        this.newTrain.stations[index].LineTrainStation!.arrivalTime =
          data.arrivalTime;
        this.newTrain.stations[index].LineTrainStation!.isArrival =
          data.arrivalTime !== null;
      }
    }
  }

  @Mutation
  setCurrentTrain(train: Train) {
    this.currentTrain = train;
  }

  @Mutation
  updateCurrentTrain({ data }: { data: any }) {
    if (data.number) this.currentTrain.number = data.number;
    if (data.stations) {
      Vue.set(TrainsModule.state.currentTrain, "stations", data.stations);
    }
    if (data.trainRuns) {
      if (data.trainRuns instanceof Array && data.trainRuns.length > 0) {
        this.currentTrain = {
          ...data.trainRuns[0].train
        };
        Vue.set(TrainsModule.state.currentTrain, "trainRuns", data.trainRuns);
      } else if (data.trainRuns.train) {
        this.currentTrain = {
          ...data.trainRuns.train
        };
        Vue.set(TrainsModule.state.currentTrain, "trainRuns", []);
      }
    }
    if (data.trainRunsRevisions) {
      if (data.trainRunsRevisions.train) {
        this.currentTrain = {
          ...data.trainRunsRevisions.train
        };
      }
      Vue.set(
        TrainsModule.state.currentTrain,
        "trainRunsRevisions",
        data.trainRunsRevisions.items
      );
    }
  }

  @Mutation
  updateCurrentTrainStation({ index, data }: { index?: any; data?: any }) {
    if (
      this.currentTrain.stations &&
      this.currentTrain.stations.length >= 0 &&
      index >= 0
    ) {
      if (data.departureTime === null || data.departureTime) {
        this.currentTrain.stations[index].LineTrainStation!.departureTime =
          data.departureTime;
        this.currentTrain.stations[index].LineTrainStation!.isDeprature =
          data.departureTime !== null;
      }

      if (data.arrivalTime === null || data.arrivalTime) {
        this.currentTrain.stations[index].LineTrainStation!.arrivalTime =
          data.arrivalTime;
        this.currentTrain.stations[index].LineTrainStation!.isArrival =
          data.arrivalTime !== null;
      }
    }
  }

  @Mutation
  pushTrain(train: Train) {
    this.trains.push(train);
  }

  @Mutation
  updateTrain({ id, data }: { id?: string; data?: any } = {}) {
    let train = this.trains.find(train => train.id == id);
    if (train) train.number = data.number;
  }

  @Mutation
  updateLineTrain({ id, data }: { id?: string; data?: any } = {}) {
    LinesModule.updateLineTrain({ trainId: id, data });
  }

  @Mutation
  removeTrain(id: string) {
    const index = this.trains.findIndex(train => train.id === id);
    if (index > -1) this.trains.splice(index, 1);
  }

  @Mutation
  setTrains(trains: Train[]) {
    this.trains = trains;
  }

  @Mutation
  setSearchedTrains(trains: Train[]) {
    this.searchedTrains = trains;
  }

  @Mutation
  restTrains() {
    this.trains = [];
  }

  @Mutation
  setTrainRuns(trainRuns: TrainRun[]) {
    this.trainRuns = trainRuns;
  }

  @Mutation
  setTrainRunsRevisions(trainRunsRevisions: TrainRunRevision[]) {
    this.trainRunsRevisions = trainRunsRevisions;
  }

  @Mutation
  resetTrainRuns() {
    this.trainRuns = [];
  }

  @Mutation
  resetTrainRunsRevisions() {
    this.trainRunsRevisions = [];
  }

  @Mutation
  addTrainRun(trainRun: TrainRun) {
    if (!this.currentTrain.trainRuns) this.currentTrain.trainRuns = [];
    this.currentTrain.trainRuns.push(trainRun);
  }

  @Mutation
  removeTrainRun(id: string) {
    if (!this.currentTrain.trainRuns) this.currentTrain.trainRuns = [];
    const index = this.currentTrain.trainRuns.findIndex(
      trainRun => trainRun.id === id
    );
    if (index > -1) this.currentTrain.trainRuns.splice(index, 1);
  }

  @Mutation
  updateNewTrainRun(data: any) {
    if (data.day) this.newTrainRun.day = data.day;
    if (data.trainId) this.newTrainRun.trainId = data.trainId;
    if (data.train) this.newTrainRun.train = data.train;
  }

  @Mutation
  updatePolicePerson({
    policePersonIndex,
    data
  }: {
    policePersonIndex: number;
    data: any;
  }) {
    if (policePersonIndex >= 0 && this.newTrainRun.policePeople) {
      const policePerson = this.newTrainRun.policePeople[policePersonIndex];
      if (data.name) policePerson.name = data.name;
      if (data.phoneNumber) policePerson.phoneNumber = data.phoneNumber;
      if (data.policeDepartment)
        policePerson.policeDepartment.name = data.policeDepartment.name;
      if (data.rank) policePerson.rank.name = data.rank.name;
      if (data.fromStationId) policePerson.fromStationId = data.fromStationId;
      if (data.toStationId) policePerson.toStationId = data.toStationId;

      if (data.fromStation)
        policePerson.TrainRunPolicePerson!.fromStation = data.fromStation;
      if (data.toStation)
        policePerson.TrainRunPolicePerson!.toStation = data.toStation;
    }
  }

  @Mutation
  addPolicePerson() {
    if (!this.newTrainRun.policePeople) this.newTrainRun.policePeople = [];
    this.newTrainRun.policePeople.push({
      TrainRunPolicePerson: {
        fromStation: {
          name: ""
        },
        toStation: {
          name: ""
        }
      },
      fromStationId: "",
      toStationId: "",
      name: "",
      phoneNumber: "",
      policeDepartment: {
        name: "",
        policePeople: []
      },
      rank: {
        name: "",
        policePeople: []
      }
    });
  }

  @Mutation
  removePolicePerson(policePersonIndex: number) {
    if (policePersonIndex >= 0 && this.newTrainRun.policePeople)
      this.newTrainRun.policePeople.splice(policePersonIndex, 1);
  }

  @Mutation
  removeLineTrain({ id, lineId }: { id: string; lineId: string }) {
    const trainIndex = this.trains.findIndex(train => {
      return train.id === id;
    });
    if (trainIndex > -1) {
      const train: Train = this.trains[trainIndex];
      if (train.lines && train.lines.length > 0) {
        const lineIndex = train.lines.findIndex(line => line.id == lineId);
        if (lineIndex > -1) {
          train.lines.splice(lineIndex, 1);
        }
      }
      if (!train.lines || train.lines.length < 1) {
        this.trains.splice(trainIndex, 1);
      }
    }
  }

  @Action
  async getAllTrainRuns() {
    this.toggleLoading();
    const trainRuns = await TrainsAPI.getAllRuns();
    this.setTrainRuns(trainRuns);
    this.toggleLoading();
  }

  @Action
  async getAllTrainRunsRevisions() {
    this.toggleLoading();
    const trainRunsRevisions: TrainRunRevision[] = await TrainsAPI.getAllRunsRevisions();
    this.setTrainRunsRevisions(trainRunsRevisions);
    this.toggleLoading();
  }

  @Action
  async get({
    departureStation,
    arrivalStation
  }: { departureStation?: string; arrivalStation?: string } = {}) {
    this.toggleLoading();
    const trains: Train[] = await TrainsAPI.get(
      departureStation,
      arrivalStation
    );
    if (departureStation && arrivalStation) {
      this.setSearchedTrains(trains);
    } else {
      this.setTrains(trains);
    }
    this.toggleLoading();
  }

  @Action
  async getById(id: string) {
    this.toggleLoading();
    const train: Train = await TrainsAPI.getById(id);
    this.setCurrentTrain(train);
    this.toggleLoading();
    return train;
  }

  @Action
  async getCurrentTrainStations() {
    this.toggleLoading();
    const stations: Station[] = await TrainsAPI.getStations(
      this.currentTrain.id!
    );
    this.updateCurrentTrain({ data: { stations } });
    this.toggleLoading();
    return stations;
  }

  @Action
  async getTrainLineStations({ id, lineId }: { id: string; lineId: string }) {
    this.toggleLoading();
    const stations = await TrainsAPI.getTrainLineStation(id, lineId);
    if (stations && stations.length > 0 && stations[0].train) {
      this.setCurrentTrain(stations[0].train);
    }
    this.updateCurrentTrain({
      data: {
        stations
      }
    });
    this.toggleLoading();
  }

  @Action
  async getRunsByTrainId({ trainId }: { trainId: string }) {
    this.toggleLoading();
    const trainRuns = await TrainsAPI.getRunsByTrainId(trainId);
    this.updateCurrentTrain({
      data: {
        trainRuns
      }
    });
    this.toggleLoading();
  }

  @Action
  async getRunsRevisionsByTrainId({ trainId }: { trainId: string }) {
    this.toggleLoading();
    const trainRunsRevisions = await TrainsAPI.getRunsRevisionsByTrainId(
      trainId
    );
    this.updateCurrentTrain({
      data: {
        trainRunsRevisions
      }
    });
    this.toggleLoading();
  }

  @Action
  async create() {
    this.toggleLoading();
    try {
      if (this.newTrain.number) {
        const train: Train = await TrainsAPI.create({
          ...this.newTrain
        });
        if (train.id) {
          LinesModule.removeTrainFromCurrentLine(train.id);
        }
        this.pushTrain({ ...this.newTrain, ...train });
        LinesModule.pushTrainToCurrentLine({ ...this.newTrain, ...train });

        if (LinesModule.currentLine.stations) {
          const stations = [...LinesModule.currentLine.stations].map(
            station => {
              return {
                ...station,
                lineStationId: station.LineStation!.id,
                LineTrainStation: {
                  ...station.LineTrainStation,
                  arrivalTime: null,
                  departureTime: null,
                  isArrival: false,
                  isDeprature: false,
                  lineStationId: station.LineStation!.id
                }
              };
            }
          );
          this.updateNewTrain({
            stations
          });
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        this.updateErrorMessage({
          newTrainNumberErrorMessage: "رقم القطار موجود بالفعل في هذا الخط"
        });
      }
    }
    this.toggleLoading();
  }

  @Action
  async update({ id, data }: { id: string; data: any }) {
    if (id && data) {
      this.toggleLoading();
      try {
        await TrainsAPI.update(id, data);
        this.updateTrain({ id, data });
        this.updateLineTrain({ id, data });
      } catch (err) {
        if (err.response && err.response.status === 409) {
          this.updateErrorMessage({
            updateTrainErrorMessage: "رقم القطار موجود بالفعل في هذا الخط"
          });
        }
      }
      this.toggleLoading();
    }
  }

  @Action
  async updateCurrentTrainLineStations({
    id,
    editedStations
  }: {
    id: string;
    editedStations: any;
  }) {
    this.toggleLoading();
    await TrainsAPI.updateLineStations(id, editedStations);
    this.updateCurrentTrain({
      data: { stations: editedStations }
    });
    this.toggleLoading();
  }

  @Action
  async delete(id: string) {
    this.toggleLoading();
    await TrainsAPI.delete(id);
    this.removeTrain(id);
    this.toggleLoading();
  }

  @Action
  async deleteTrainLine({ id, lineId }: { id: string; lineId: string }) {
    this.toggleLoading();
    await TrainsAPI.deleteTrainLine(id, lineId);
    LinesModule.removeTrainFromCurrentLine(id);
    this.removeLineTrain({ id, lineId });
    this.toggleLoading();
  }

  @Action
  async createTrainRun({ trainId }: { trainId: string }) {
    this.toggleLoading();
    try {
      if (this.currentTrain.id) {
        this.newTrainRun.trainId = this.currentTrain.id;
        const trainRun: TrainRun = await TrainsAPI.addRun(
          trainId,
          this.newTrainRun
        );
        if (trainRun) {
          this.addTrainRun({ ...cloneDeep(this.newTrainRun), ...trainRun });
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        this.updateErrorMessage({
          newTrainRunDateErrorMessage:
            "يوجد خدمة بنفس التاريخ لهذا القطار بالفعل"
        });
      }
    }
    this.toggleLoading();
  }

  @Action
  async deleteTrainRun({ id, trainId }: { id: string; trainId: string }) {
    this.toggleLoading();
    await TrainsAPI.deleteRun(id, trainId);
    this.removeTrainRun(id);
    this.toggleLoading();
  }
}

export default getModule(TrainsModule);
