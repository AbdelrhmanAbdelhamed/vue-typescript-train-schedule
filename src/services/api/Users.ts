import axios from "axios";
import { User } from "@/store/models";

export default class UsersAPI {
  static readonly END_POINT = "users";

  static setAuthorizationHeader(token: string) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  static clearAuthorizationHeader() {
    delete axios.defaults.headers.common["Authorization"];
  }

  static login(user: User) {
    return axios
      .post(`${UsersAPI.END_POINT}/login`, user)
      .then(response => response.data);
  }

  static register(user: User) {
    return axios
      .post(`${UsersAPI.END_POINT}/register`, user)
      .then(response => response.data);
  }

  static getAll() {
    return axios.get(`${UsersAPI.END_POINT}`).then(response => response.data);
  }

  static create(user: User) {
    return axios.post(UsersAPI.END_POINT, user).then(response => response.data);
  }

  static update(id: string, data: any) {
    return axios
      .patch(`${UsersAPI.END_POINT}/${id}`, data)
      .then(response => response.data);
  }

  static setTrains(id: string, trains: any) {
    return axios
      .put(`${UsersAPI.END_POINT}/${id}/trains`, trains)
      .then(response => response.data);
  }

  static delete(id: string) {
    return axios
      .delete(`${UsersAPI.END_POINT}/${id}`)
      .then(response => response.data);
  }
}
