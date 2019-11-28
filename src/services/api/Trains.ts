import axios from "axios";
import { ITrain } from "@/store/models";

export default class TrainsAPI {
  static readonly END_POINT = "trains";

  static get(fromStation?: string, toStation?: string) {
    return fromStation && toStation
      ? TrainsAPI.getByStations(fromStation, toStation)
      : TrainsAPI.getAll();
  }

  static getAll() {
    return axios.get(TrainsAPI.END_POINT).then(response => response.data);
  }

  static getByStations(fromStation: string, toStation: string) {
    return axios
      .get(
        `${TrainsAPI.END_POINT}?fromStation=${fromStation}&toStation=${toStation}`
      )
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

  static deleteLine(id: string, lineId: string) {
    return axios
      .delete(`${TrainsAPI.END_POINT}/${id}/lines/${lineId}`)
      .then(response => response.data);
  }
}
