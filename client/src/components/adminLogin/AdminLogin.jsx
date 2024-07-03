import React, { useEffect, useState } from "react";
import "./AdminLogin.scss";
import { axiosClient } from "../../utils/axiosClient";
import {
  OAUTH_ADMIN_TOKEN,
  KEY_ADMIN_TOKEN,
  setItem,
  OAUTH_ACCESS_TOKEN,
} from "../../utils/localStorageManager";
import logo from "../../../src/assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { AiOutlineGoogle } from "react-icons/ai";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { setAdminProfile, setProfile } from "../../redux/slices/profileSlice";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../../App";
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(<IoEyeOffOutline />);
  const [password, setPassword] = useState("");
  const [authCode, setAuthCode] = useState([]);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [placeholderEmail, setPlaceholderEmail] = useState("");
  const [placeholderPassword, setPlaceholderPassword] = useState("");

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
        setItem(OAUTH_ADMIN_TOKEN, response.data.accessToken);
        dispatch(setAdminProfile(response.data.user));
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
      setItem(KEY_ADMIN_TOKEN, response.data.adminToken);
      dispatch(setAdminProfile(response.data.user));
      //delete when logout
      navigate("/admin");
    } catch (error) {}
  }
  const handleToggle = () => {
    setType(type === "password" ? "text" : "password");
    setIcon(type === "password" ? <IoEyeOutline /> : <IoEyeOffOutline />);
  };
  return (
    <div className="AdminLogin">
      <div className="page">
        <div className="img-container">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img"
            alt="Sample image"
          />
        </div>
        <div className="loginform">
          <div className="welcome">
            <img src={logo} alt="" />
            <p className="heading">Welcome to Posterz. DashBoard</p>
          </div>
          <div className="signGoogle">
            <p className="heading">Sign in with Google</p>
            <div className="google-icon" onClick={() => login()}>
              <AiOutlineGoogle className="icon" />
            </div>
          </div>

          <div className="divider">
            <p className="heading">Or</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="email">
              <input
                type="email"
                id="email"
                name="email"
                className={isEmailFocused ? "focused" : "notfocused"}
                placeholder={placeholderEmail}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                onFocus={() => {
                  setIsEmailFocused(true);
                  setPlaceholderEmail("Enter a valid email address");
                }}
                onBlur={() => {
                  setIsEmailFocused(false);
                  setPlaceholderEmail("");
                }}
              />
              <label
                htmlFor="email"
                className={`${
                  isEmailFocused ? "focusemail" : "notfocusemail"
                } ${email.length > 0 && !isEmailFocused ? "has-value" : ""}`}
              >
                Email address
              </label>
            </div>
            <div className="password">
              <input
                type={type}
                id="password"
                name="password"
                className={isPasswordFocused ? "focused" : "notfocused"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder={placeholderPassword}
                onFocus={() => {
                  setIsPasswordFocused(true);
                  setPlaceholderPassword("Enter password");
                }}
                onBlur={() => {
                  setIsPasswordFocused(false);
                  setPlaceholderPassword("");
                }}
              />
              <span className="icon" onClick={handleToggle}>
                {icon}
              </span>
              <label
                htmlFor="password"
                className={`${
                  isPasswordFocused ? "focuspassword" : "notfocuspassword"
                } ${
                  password.length > 0 && !isPasswordFocused ? "has-value" : ""
                }`}
              >
                Password
              </label>
            </div>
            <div
              className="forget"
              onClick={() => {
                navigate("/forget");
              }}
            >
              <p>Forgot password ?</p>
            </div>
            <button className="submit" onClick={handleSubmit}>
              LOGIN
            </button>
          </form>
          <div className="visit" onClick={() => navigate("/")}>
            <p className="heading">
              Visit the website to request admin permissions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
