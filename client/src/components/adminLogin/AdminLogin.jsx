import React, { useEffect, useState } from "react";
import "./AdminLogin.scss";
import { axiosClient } from "../../utils/axiosClient";
import {
  GOOGLE_ACCESS_TOKEN,
  KEY_ACCESS_TOKEN,
  setItem,
} from "../../utils/localStorageManager";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { setAdminProfile, setProfile } from "../../redux/slices/profileSlice";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../../App";
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authCode, setAuthCode] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setAuthCode(codeResponse),
    onError: (error) => console.log(error),
    flow: "auth-code",
    redirect_uri: "http://localhost:5173",
  });

  const fetchProfile = async () => {
    try {
      const response = await axiosClient.post("/auth/oauth2callback", {
        code: authCode.code,
      });
      setItem(GOOGLE_ACCESS_TOKEN, response.data.accessToken);
      dispatch(setProfile(response.data.user));
      if (response.data.user.isAdmin) {
        navigate("/admin");
      } else {
        dispatch(
          showToast({
            type: TOAST_FAILURE,
            message:
              "Access Denied! Request for the Admin Permissions. (Visit the Website)",
          })
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (authCode.length === 0) return;
    fetchProfile();
  }, [authCode]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axiosClient.post("/admin", {
        email,
        password,
      });
      setItem(KEY_ACCESS_TOKEN, response.data.adminToken);
      dispatch(setAdminProfile(response.data.user));
      //delete when logout
      navigate("/admin");
    } catch (error) {}
  }
  return (
    <div className="AdminLogin">
      <div className="page">
        <h1 className="title">Log In</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="me@example.com"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••••"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            type="submit"
            className="submit btn-primary"
            value="log in"
            onClick={handleSubmit}
          />
        </form>
        <button
          onClick={() => {
            login();
          }}
          className="login-with-google-btn"
        >
          <p style={{ paddingLeft: "30px" }}>Sign in with Google</p>
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
