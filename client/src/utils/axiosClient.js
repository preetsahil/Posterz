import axios from "axios";
import {
  getItem,
  OAUTH_ADMIN_TOKEN,
  KEY_ADMIN_TOKEN,
  OAUTH_ACCESS_TOKEN,
  removeItem,
  setItem,
} from "./localStorageManager";
import { store } from "../redux/store";
import { showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";
import {
  deleteAdminProfile,
  deleteProfile,
} from "../redux/slices/profileSlice";

let baseURL = "http://localhost:4000";

export const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  if (request.url.includes("/admin/")) {
    if (getItem(KEY_ADMIN_TOKEN)) {
      request.headers["Authorization"] = `Bearer ${getItem(KEY_ADMIN_TOKEN)}`;
      return request;
    }
    if (getItem(OAUTH_ADMIN_TOKEN)) {
      request.headers["Authorization"] = `Bearer ${getItem(OAUTH_ADMIN_TOKEN)}`;
      return request;
    }
  }
  if (
    request.url === "/api/order" ||
    request.url === "/api/getKey" ||
    request.url === "/auth/sendOtp" ||
    request.url === "/auth/verifyOtp" ||
    request.url === "/api/payment"
  ) {
    const token = getItem(OAUTH_ACCESS_TOKEN);
    request.headers["Authorization"] = `Bearer ${token}`;
    return request;
  }
  return request;
});

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (
      error.response.config.url === "/api/getKey" ||
      error.response.config.url === "/api/order" ||
      error.response.config.url === "/auth/sendOtp" ||
      error.response.config.url === "/auth/verifyOtp" ||
      error.response.config.url === "/api/payment"
    ) {
      if (
        error.response.status === 401 &&
        error.response &&
        error.response.data.message === "Invalid Oauth Token" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const response = await axios
            .create({ withCredentials: true })
            .get(`${baseURL}/auth/refreshoauth`);
          setItem(OAUTH_ACCESS_TOKEN, response.data.accessToken);
          if (getItem(OAUTH_ADMIN_TOKEN)) {
            setItem(OAUTH_ADMIN_TOKEN, response.data.accessToken);
          }
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          return axiosClient(originalRequest);
        } catch (error) {
          if (error.response.status === 400 || error.response.status == 401) {
            store.dispatch(deleteProfile());
            store.dispatch(deleteAdminProfile());
            removeItem(OAUTH_ADMIN_TOKEN);
            removeItem(OAUTH_ACCESS_TOKEN);
            store.dispatch(
              showToast({
                type: TOAST_FAILURE,
                message: "Refresh Token Invalid",
              })
            );
            window.location.href = "/login";
            return;
          }
        }
      }
    }
    if (error.response.config.url.includes("/admin/")) {
      if (
        error.response.status === 401 &&
        error.response &&
        error.response.data.message === "Invalid JWT Token" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const response = await axios
            .create({ withCredentials: true })
            .get(`${baseURL}/auth/refreshjwt`);
          setItem(KEY_ADMIN_TOKEN, response.data.accessToken);
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          return axiosClient(originalRequest);
        } catch (error) {
          if (error.response.status === 400 || error.response.status == 401) {
            store.dispatch(deleteAdminProfile());
            removeItem(KEY_ADMIN_TOKEN);
            store.dispatch(
              showToast({
                type: TOAST_FAILURE,
                message: "Refresh Token Invalid",
              })
            );
            window.location.href = "/adminlogin";
            return;
          }
        }
      }
      if (
        error.response.status === 401 &&
        error.response &&
        error.response.data.message === "Invalid Oauth Token" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const response = await axios
            .create({ withCredentials: true })
            .get(`${baseURL}/auth/refreshoauth`);
          setItem(OAUTH_ADMIN_TOKEN, response.data.accessToken);
          setItem(OAUTH_ACCESS_TOKEN, response.data.accessToken);
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          return axiosClient(originalRequest);
        } catch (error) {
          if (error.response.status === 400 || error.response.status == 401) {
            store.dispatch(deleteProfile());
            store.dispatch(deleteAdminProfile());
            removeItem(OAUTH_ADMIN_TOKEN);
            removeItem(OAUTH_ACCESS_TOKEN);
            store.dispatch(
              showToast({
                type: TOAST_FAILURE,
                message: "Refresh Token Invalid",
              })
            );
            window.location.href = "/login";
            return;
          }
        }
      }
    }
    if (error.response.status === 404) {
      store.dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: error.response.data,
        })
      );
      return;
    }
    if (error.response.status === 403) {
      store.dispatch(
        showToast({
          type: TOAST_FAILURE,
          message:
            "Access Denied! Request for the Admin Permissions. (Visit the Website)",
        })
      );
      return;
    }
    store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error.response.data,
      })
    );
    return Promise.reject(error);
  }
);
