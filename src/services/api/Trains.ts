import axios from "axios";
import { ITrain, IStation } from "@/store/models";

export default class TrainsAPI {
  static readonly END_POINT = "trains";

  static get(departureStation?: string, arrivalStation?: string) {
    return departureStation && arrivalStation
      ? TrainsAPI.getByStations(departureStation, arrivalStation)
      : TrainsAPI.getAll();
  }

  static getAll() {
    return axios.get(TrainsAPI.END_POINT).then(response => response.data);
  }

  static getByStations(departureStation: string, arrivalStation: string) {
    return axios
      .get(TrainsAPI.END_POINT, {
        params: {
          departureStation,
          arrivalStation
        }
      })
      .then(Response => Response.data);
  }

  static getById(id: string) {
    return axios
      .get(`${TrainsAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }

  static create(train: ITrain) {
    return axios
      .post(TrainsAPI.END_POINT, train)
      .then(response => response.data);
  }

  static update(id: string, data: any) {
    return axios
      .patch(`${TrainsAPI.END_POINT}/${id}`, data)
      .then(response => response.data);
  }

  static delete(id: string) {
    return axios
      .delete(`${TrainsAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }

  static addRun(id: string, data: any) {
    return axios
      .post(`${TrainsAPI.END_POINT}/${id}/runs`, data)
      .then(response => response.data);
  }

  static deleteRun(id: string, trainId: string) {
    return axios
      .delete(`${TrainsAPI.END_POINT}/${trainId}/runs/${id}`)
      .then(response => response.data);
  }

  static getAllRuns() {
    return axios
      .get(`${TrainsAPI.END_POINT}/runs`)
      .then(response => response.data);
  }

  static addStation(id: string, data: any) {
    return axios
      .post(`${TrainsAPI.END_POINT}/${id}/stations`, data)
      .then(response => response.data);
  }

  static updateStation(id: string, lineStationId: string, data: any) {
    return axios
      .patch(`${TrainsAPI.END_POINT}/${id}/stations/${lineStationId}`, data)
      .then(response => response.data);
  }

  static deleteStation(id: string, lineStationId: string) {
    return axios
      .delete(`${TrainsAPI.END_POINT}/${id}/stations/${lineStationId}`)
      .then(response => response.data);
  }

  static getStations(id: string) {
    return axios
      .get(`${TrainsAPI.END_POINT}/${id}/stations`)
      .then(response => response.data);
  }

  static updateLineStations(id: string, stations: any) {
    return axios
      .put(`${TrainsAPI.END_POINT}/${id}/stations`, stations)
      .then(response => response.data);
  }

  static getTrainLineStation(id: string, lineId: string) {
    return axios
      .get(`${TrainsAPI.END_POINT}/${id}/stations/lines/${lineId}`)
      .then(response => response.data);
  }

  static deleteTrainLine(id: string, lineId: string) {
    return axios
      .delete(`${TrainsAPI.END_POINT}/${id}/lines/${lineId}`)
      .then(response => response.data);
  }
}
