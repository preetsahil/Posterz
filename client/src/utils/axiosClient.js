import axios from "axios";
import {
  getItem,
  KEY_ACCESS_TOKEN,
  KEY_ADMIN_TOKEN,
  removeItem,
} from "./localStorageManager";
import { store } from "../redux/store";
import { showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";
import { deleteProfile } from "../redux/slices/cartSlice";
export const axiosClient = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  if (
    request.url === "/api/order" ||
    request.url === "/api/getKey" ||
    request.url === "/api/payment" ||
    request.url === "/auth/sendOtp" ||
    request.url === "/auth/verifyOtp"
  ) {
    const token = getItem(KEY_ACCESS_TOKEN);
    request.headers["Authorization"] = `Bearer ${token}`;
    return request;
  }
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
      if (
        error.response.config.url === "/api/getKey" ||
        error.response.config.url === "/api/order" ||
        error.response.config.url === "/auth/sendOtp" ||
        error.response.config.url === "/auth/verify"
      ) {
        removeItem(KEY_ACCESS_TOKEN);
        store.dispatch(
          showToast({
            type: TOAST_FAILURE,
            message: error.response.data.message,
          })
        );
        store.dispatch(deleteProfile());
        window.location.href = "/login";
        return;
      }
      removeItem(KEY_ADMIN_TOKEN);
      store.dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: error.response.data.message,
        })
      );
      window.location.href = "/adminlogin";
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
