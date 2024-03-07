import axios from "axios";
import { getItem, KEY_ADMIN_TOKEN } from "./localStorageManager";
export const axiosClient = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  const adminToken = getItem(KEY_ADMIN_TOKEN);
  request.headers["Authorization"] = `Bearer ${adminToken}`;
  return request;
});
