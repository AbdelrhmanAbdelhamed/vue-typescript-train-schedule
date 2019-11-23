import axios from "axios";
import { ILine } from "@/store/models";

export default class LinesAPI {
  static readonly END_POINT = "lines";

  static getAll() {
    return axios.get(LinesAPI.END_POINT).then(response => response.data);
  }

  static getById(id: string) {
    return axios
      .get(`${LinesAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }

  static getStations(id: string) {
    return axios
      .get(`${LinesAPI.END_POINT}/${id}/stations`)
      .then(response => response.data);
  }

  static getTrains(id: string) {
    return axios
      .get(`${LinesAPI.END_POINT}/${id}/trains`)
      .then(response => response.data);
  }

  static create(line: ILine) {
    return axios.post(LinesAPI.END_POINT, line).then(response => response.data);
  }

  static update(id: string, data: any) {
    return axios
      .patch(`${LinesAPI.END_POINT}/${id}`, data)
      .then(response => response.data);
  }

  static delete(id: string) {
    return axios
      .delete(`${LinesAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }
}
