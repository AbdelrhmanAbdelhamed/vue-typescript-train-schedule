import axios from "axios";
import { IPolicePerson } from "@/store/models";

export default class PolicePeopleAPI {
  static readonly END_POINT = "policepeople";

  static getAll() {
    return axios.get(PolicePeopleAPI.END_POINT).then(response => response.data);
  }

  static getById(id: string) {
    return axios
      .get(`${PolicePeopleAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }

  static create(policePerson: IPolicePerson) {
    return axios
      .post(PolicePeopleAPI.END_POINT, policePerson)
      .then(response => response.data);
  }

  static update(id: string, data: any) {
    return axios
      .patch(`${PolicePeopleAPI.END_POINT}/${id}`, data)
      .then(response => response.data);
  }

  static delete(id: string) {
    return axios
      .delete(`${PolicePeopleAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }
}
