import axios from "axios";
import { IRank } from "@/store/models";

export default class RanksAPI {
  static readonly END_POINT = "ranks";

  static getAll() {
    return axios.get(RanksAPI.END_POINT).then(response => response.data);
  }

  static getById(id: string) {
    return axios
      .get(`${RanksAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }

  static create(rank: IRank) {
    return axios.post(RanksAPI.END_POINT, rank).then(response => response.data);
  }

  static update(id: string, data: any) {
    return axios
      .patch(`${RanksAPI.END_POINT}/${id}`, data)
      .then(response => response.data);
  }

  static delete(id: string) {
    return axios
      .delete(`${RanksAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }
}
