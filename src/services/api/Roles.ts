import axios from "axios";
import { IRole } from "@/store/models";

export default class RolesAPI {
  static readonly END_POINT = "roles";

  static getAll() {
    return axios.get(RolesAPI.END_POINT).then(response => response.data);
  }

  static getById(id: string) {
    return axios
      .get(`${RolesAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }

  static create(role: IRole) {
    return axios.post(RolesAPI.END_POINT, role).then(response => response.data);
  }

  static update(id: string, data: any) {
    return axios
      .patch(`${RolesAPI.END_POINT}/${id}`, data)
      .then(response => response.data);
  }

  static delete(id: string) {
    return axios
      .delete(`${RolesAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }
}
