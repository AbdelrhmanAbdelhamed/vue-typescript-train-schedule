import axios from "axios";
import { IPoliceDepartment } from "@/store/models";

export default class PoliceDepartmentsAPI {
  static readonly END_POINT = "policedepartments";

  static getAll() {
    return axios
      .get(PoliceDepartmentsAPI.END_POINT)
      .then(response => response.data);
  }

  static getById(id: string) {
    return axios
      .get(`${PoliceDepartmentsAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }

  static create(policeDepartment: IPoliceDepartment) {
    return axios
      .post(PoliceDepartmentsAPI.END_POINT, policeDepartment)
      .then(response => response.data);
  }

  static update(id: string, data: any) {
    return axios
      .patch(`${PoliceDepartmentsAPI.END_POINT}/${id}`, data)
      .then(response => response.data);
  }

  static delete(id: string) {
    return axios
      .delete(`${PoliceDepartmentsAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }
}
