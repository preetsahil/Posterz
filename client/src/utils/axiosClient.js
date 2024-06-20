import axios from "axios";
import {
  getItem,
  GOOGLE_ACCESS_TOKEN,
  KEY_ACCESS_TOKEN,
  removeItem,
  setItem,
} from "./localStorageManager";
import { store } from "../redux/store";
import { showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";
import { deleteProfile } from "../redux/slices/profileSlice";

let baseURL = "http://localhost:4000";

export const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  if (request.url.includes("/admin/")) {
    if (getItem(KEY_ACCESS_TOKEN) && getItem(GOOGLE_ACCESS_TOKEN)) {
      request.headers["Authorization"] = `Bearer ${getItem(
        GOOGLE_ACCESS_TOKEN
      )}`;
      return request;
    }
    if (getItem(KEY_ACCESS_TOKEN)) {
      request.headers["Authorization"] = `Bearer ${getItem(KEY_ACCESS_TOKEN)}`;
      return request;
    }
    if (getItem(GOOGLE_ACCESS_TOKEN)) {
      request.headers["Authorization"] = `Bearer ${getItem(
        GOOGLE_ACCESS_TOKEN
      )}`;
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
    const token = getItem(GOOGLE_ACCESS_TOKEN);
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
    if (error.response.status === 404) {
      store.dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Not Registered! Use Google SignIn to Register Yourself",
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
        setItem(GOOGLE_ACCESS_TOKEN, response.data.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (error) {
        if (error.response.status === 400 || error.response.status == 401) {
          store.dispatch(deleteProfile());
          removeItem(GOOGLE_ACCESS_TOKEN);
          store.dispatch(
            showToast({
              type: TOAST_FAILURE,
              message: "Refresh Token Invalid",
            })
          );
          if (
            error.response.config.url === "/api/getKey" ||
            error.response.config.url === "/api/order" ||
            error.response.config.url === "/auth/sendOtp" ||
            error.response.config.url === "/auth/verifyOtp" ||
            error.response.config.url === "/api/payment"
          ) {
            window.location.href = "/login";
            return;
          } else {
            window.location.href = "/adminlogin";
            return;
          }
        }
      }
    }
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
        setItem(KEY_ACCESS_TOKEN, response.data.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (error) {
        if (error.response.status === 400 || error.response.status == 401) {
          store.dispatch(deleteProfile());
          removeItem(KEY_ACCESS_TOKEN);
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
      error.response.data.message === "Both cookies expire" &&
      !originalRequest._retry
    ) {
      removeItem(KEY_ACCESS_TOKEN);
      store.dispatch(deleteProfile());
      removeItem(GOOGLE_ACCESS_TOKEN);
      store.dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "both token expire",
        })
      );
    }
    store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error.response.data,
      })
    );
    // removeItem(KEY_ADMIN_TOKEN);
    // store.dispatch(
    //   showToast({
    //     type: TOAST_FAILURE,
    //     message: error.response.data.message,
    //   })
    // );
    // window.location.href = "/adminlogin";

    return Promise.reject(error);
  }
);
