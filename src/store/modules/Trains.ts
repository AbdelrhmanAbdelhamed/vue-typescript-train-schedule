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
  ITrain,
  ITrainState,
  ITrainRun,
  IPolicePerson,
  IPoliceDepartment,
  IRank
} from "../models";

import LinesModule from "@/store/modules/Lines";
import Vue from "vue";

@Module({ dynamic: true, namespaced: true, store, name: TrainsAPI.END_POINT })
class TrainsModule extends VuexModule implements ITrainState {
  trains: ITrain[] = [];
  searchedTrains: ITrain[] = [];
  newTrain: ITrain = this.createEmptyTrain();
  currentTrain: ITrain = {
    number: "",
    trainRuns: [],
    stations: LinesModule.currentLine.stations
      ? [...LinesModule.currentLine.stations]
      : []
  };

  newTrainRun: ITrainRun = {
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

  trainRuns: ITrainRun[] = [];
  loading: boolean = false;

  newTrainRunDateErrorMessage = null;
  newTrainNumberErrorMessage = null;

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
  }

  @Mutation
  toggleLoading() {
    this.loading = !this.loading;
  }

  createEmptyTrain(): ITrain {
    return {
      number: "",
      trainRuns: []
    };
  }

  createEmptyTrainRun(): ITrainRun {
    return {
      day: "",
      policePeople: [],
      train: this.currentTrain,
      trainId: this.currentTrain ? this.currentTrain.id : ""
    };
  }

  createEmptyPoliceDepartment(): IPoliceDepartment {
    return {
      name: "",
      policePeople: []
    };
  }

  createEmptyRank(): IRank {
    return {
      name: "",
      policePeople: []
    };
  }

  createEmptyPolicePerson(): IPolicePerson {
    return {
      name: "",
      phoneNumber: "",
      policeDepartment: this.createEmptyPoliceDepartment(),
      rank: this.createEmptyRank()
    };
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
      train: this.currentTrain,
      trainId: this.currentTrain ? this.currentTrain.id : ""
    };
  }

  @Mutation
  resetNewTrain() {
    this.newTrain = this.createEmptyTrain();
  }

  @Mutation
  setNewTrain(train: ITrain) {
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
        this.newTrain.stations[index].LineStationTrain!.departureTime =
          data.departureTime;
        this.newTrain.stations[index].LineStationTrain!.isDeprature =
          data.departureTime !== null;
      }

      if (data.arrivalTime === null || data.arrivalTime) {
        this.newTrain.stations[index].LineStationTrain!.arrivalTime =
          data.arrivalTime;
        this.newTrain.stations[index].LineStationTrain!.isArrival =
          data.arrivalTime !== null;
      }
    }
  }

  @Mutation
  setCurrentTrain(train: ITrain) {
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
  }

  @Mutation
  updateCurrentTrainStation({ index, data }: { index?: any; data?: any }) {
    if (
      this.currentTrain.stations &&
      this.currentTrain.stations.length >= 0 &&
      index >= 0
    ) {
      if (data.departureTime === null || data.departureTime) {
        this.currentTrain.stations[index].LineStationTrain!.departureTime =
          data.departureTime;
        this.currentTrain.stations[index].LineStationTrain!.isDeprature =
          data.departureTime !== null;
      }

      if (data.arrivalTime === null || data.arrivalTime) {
        this.currentTrain.stations[index].LineStationTrain!.arrivalTime =
          data.arrivalTime;
        this.currentTrain.stations[index].LineStationTrain!.isArrival =
          data.arrivalTime !== null;
      }
    }
  }

  @Mutation
  pushTrain(train: ITrain) {
    this.trains.push(train);
  }

  @Mutation
  updateTrain({ id, data }: { id?: string; data?: any } = {}) {
    let train = this.trains.find(train => train.id == id);
    if (train) train.number = data.number;
  }

  @Mutation
  removeTrain(id: string) {
    const index = this.trains.findIndex(train => train.id === id);
    if (index > -1) this.trains.splice(index, 1);
  }

  @Mutation
  setTrains(trains: ITrain[]) {
    this.trains = trains;
  }

  @Mutation
  setSearchedTrains(trains: ITrain[]) {
    this.searchedTrains = trains;
  }

  @Mutation
  restTrains() {
    this.trains = [];
  }

  @Mutation
  setTrainRuns(trainRuns: ITrainRun[]) {
    this.trainRuns = trainRuns;
  }

  @Mutation
  resetTrainRuns() {
    this.trainRuns = [];
  }

  @Mutation
  addTrainRun(trainRun: ITrainRun) {
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

  @Action
  async getAllTrainRuns() {
    const trainRuns = await TrainsAPI.getAllRuns();
    this.setTrainRuns(trainRuns);
  }

  @Action
  async get({
    departureStation,
    arrivalStation
  }: { departureStation?: string; arrivalStation?: string } = {}) {
    this.toggleLoading();
    const trains: ITrain[] = await TrainsAPI.get(
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
    const train: ITrain = await TrainsAPI.getById(id);
    this.setCurrentTrain(train);
    this.toggleLoading();
    return train;
  }

  @Action
  async getTrainLineStations({ id, lineId }: { id: string; lineId: string }) {
    const stations = await TrainsAPI.getTrainLineStation(id, lineId);
    this.updateCurrentTrain({
      data: {
        stations
      }
    });
  }

  @Action
  async getRunsByTrainId({ trainId }: { trainId: string }) {
    const trainRuns = await TrainsAPI.getRunsByTrainId(trainId);
    this.updateCurrentTrain({
      data: {
        trainRuns
      }
    });
  }

  @Action
  async create() {
    this.toggleLoading();
    try {
      if (this.newTrain.number && Number(this.newTrain.number) > 0) {
        const train: ITrain = await TrainsAPI.create({
          ...this.newTrain
        });
        if (train.id) {
          this.removeTrain(train.id);
        }
        this.pushTrain({ ...this.newTrain, ...train });
        LinesModule.pushTrainToCurrentLine({ ...this.newTrain, ...train });

        if (LinesModule.currentLine.stations) {
          const stations = [...LinesModule.currentLine.stations].map(
            station => {
              return {
                ...station,
                lineStationId: station.LineStation!.id,
                LineStationTrain: {
                  ...station.LineStationTrain,
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
      await TrainsAPI.update(id, data);
      this.updateTrain({ id, data });
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
    this.toggleLoading();
  }

  @Action
  async createTrainRun({ trainId }: { trainId: string }) {
    this.toggleLoading();
    try {
      if (this.currentTrain.id) {
        this.newTrainRun.trainId = this.currentTrain.id;
        const trainRun: ITrainRun = await TrainsAPI.addRun(
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
