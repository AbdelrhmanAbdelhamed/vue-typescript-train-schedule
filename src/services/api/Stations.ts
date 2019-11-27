import axios from "axios";
import { IStation } from "@/store/models";

export default class StationsAPI {
  static readonly END_POINT = "stations";

  static getAll() {
    return axios.get(StationsAPI.END_POINT).then(response => response.data);
  }

  static getById(id: string) {
    return axios
      .get(`${StationsAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }

  static create(station: IStation) {
    return axios
      .post(StationsAPI.END_POINT, station)
      .then(response => response.data);
  }

  static update(id: string, data: any) {
    return axios
      .patch(`${StationsAPI.END_POINT}/${id}`, data)
      .then(response => response.data);
  }

  static delete(id: string) {
    return axios
      .delete(`${StationsAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }

  static deleteLine(id: string, lineId: string) {
    return axios
      .delete(`${StationsAPI.END_POINT}/${id}/${lineId}`)
      .then(response => response.data);
  }
}
