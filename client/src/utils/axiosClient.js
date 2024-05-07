import axios from "axios";
import { getItem, KEY_ADMIN_TOKEN, removeItem } from "./localStorageManager";
import { store } from "../redux/store";
import { showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";
export const axiosClient = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  const adminToken = getItem(KEY_ADMIN_TOKEN);
  request.headers["Authorization"] = `Bearer ${adminToken}`;
  return request;
});

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      removeItem(KEY_ADMIN_TOKEN);
      window.location.href = "/adminlogin";
      store.dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: error.response.data.message,
        })
      );
    }
    store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error.message,
      })
    );

    return Promise.reject(error);
  }
);
