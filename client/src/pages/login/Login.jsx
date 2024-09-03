import React, { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { axiosClient } from "../../utils/axiosClient";
import axios from "axios";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdminProfile, setProfile } from "../../redux/slices/profileSlice";
import {
  KEY_ADMIN_TOKEN,
  OAUTH_ACCESS_TOKEN,
  OAUTH_ADMIN_TOKEN,
  getItem,
  removeItem,
  setItem,
} from "../../utils/localStorageManager";

let baseURL = "http://localhost:4000";
if (import.meta.env.PROD) {
  baseURL = import.meta.env.VITE_REACT_APP_SERVER_BASE_URL;
}

function Login() {
  const [authCode, setAuthCode] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  let uri = "http://localhost:5173";
  if (import.meta.env.PROD) {
    uri = import.meta.env.VITE_REDIRECT_URI;
  }

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setAuthCode(codeResponse),
    onError: (error) => console.log(error),
    flow: "auth-code",
    redirect_uri: uri,
  });

  const fetchProfile = async () => {
    try {
      const response = await axiosClient.post("/auth/oauth2callback", {
        code: authCode.code,
      });
      setItem(OAUTH_ACCESS_TOKEN, response.data.accessToken);
      dispatch(setProfile(response.data.user));
      if (response.data.user.isAdmin) {
        if (getItem(KEY_ADMIN_TOKEN)) {
          removeItem(KEY_ADMIN_TOKEN);
          await axios
            .create({
              baseURL,
              withCredentials: true,
            })
            .post("/auth/revoke");
        }
        setItem(OAUTH_ADMIN_TOKEN, response.data.accessToken);
        dispatch(setAdminProfile(response.data.user));
      }
      navigate(-1);
    } catch (error) {}
  };

  useEffect(() => {
    if (authCode.length === 0) return;
    fetchProfile();
  }, [authCode]);

  return (
    <div className="login">
      <button
        onClick={() => {
          login();
        }}
        className="login-with-google-btn"
      >
        <p style={{ paddingLeft: "30px" }}>Sign in with Google</p>
      </button>
    </div>
  );
}

export default Login;
