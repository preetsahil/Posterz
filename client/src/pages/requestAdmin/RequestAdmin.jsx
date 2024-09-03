import React, { useEffect, useRef, useState } from "react";
import "./RequestAdmin.scss";
import banner from "../../assets/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../../utils/axiosClient";
import { showToast } from "../../redux/slices/appConfigSlice";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import {
  deleteProfile,
  setAdminProfile,
  setProfile,
} from "../../redux/slices/profileSlice";
import {
  KEY_ADMIN_TOKEN,
  OAUTH_ACCESS_TOKEN,
  OAUTH_ADMIN_TOKEN,
  getItem,
  removeItem,
  setItem,
} from "../../utils/localStorageManager";
import axios from "axios"
let timeoutId = null;
let baseURL = "http://localhost:4000";
if (import.meta.env.PROD) {
  baseURL = import.meta.env.VITE_REACT_APP_SERVER_BASE_URL;
}

function RequestAdmin() {
  const profile = useSelector((state) => state.profileReducer.profile);
  const dispatch = useDispatch();
  const [verify, setVerify] = useState(false);
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [counter, setCounter] = useState(300);
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(<IoEyeOffOutline />);
  const [otp, setOtp] = useState();
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  }
  const handleToggle = () => {
    setType(type === "password" ? "text" : "password");
    setIcon(type === "password" ? <IoEyeOutline /> : <IoEyeOffOutline />);
  };
  function timer(remaining) {
    remaining -= 1;

    if (remaining >= 0) {
      setCounter(remaining);
      timeoutId = setTimeout(function () {
        timer(remaining);
      }, 1000);
      return;
    }
    dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: "Timeout for otp",
      })
    );
    setVerify(false);
    setCode("");
    setPassword("");
  }
  const sendOtp = async () => {
    try {
      const response = await axiosClient.post("/auth/sendOtp", {
        email: profile.email,
      });
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: response.data.message,
        })
      );
      setOtp(response.data.otp);
      setVerify(true);
      setCounter(300);
      timer(300);
    } catch (error) {
      if (error.response.status === 400) {
        dispatch(
          showToast({
            type: TOAST_FAILURE,
            message: error.response.data,
          })
        );
        removeItem(OAUTH_ACCESS_TOKEN);
        dispatch(deleteProfile());
        navigate("/login");
      }
    }
  };

  const verifyOtp = async () => {
    if (code !== otp) {
      alert("OTP incorrect");
      setCode("");
      setPassword("");
      return;
    }
    try {
      const response = await axiosClient.post("/auth/verifyOtp", {
        otp: code,
        email: profile.email,
        password: password,
      });
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: response.data.message,
        })
      );
      setCode("");
      setPassword("");
      dispatch(setProfile(response.data.user));
      setItem(OAUTH_ADMIN_TOKEN, getItem(OAUTH_ACCESS_TOKEN));
      dispatch(setAdminProfile(response.data.user));
      if (getItem(KEY_ADMIN_TOKEN)) {
        removeItem(KEY_ADMIN_TOKEN);
        await axios
          .create({
            baseURL,
            withCredentials: true,
          })
          .post("/auth/revoke");
      }
      navigate("/admin");
    } catch (error) {
      if (error.response.status === 400) {
        dispatch(
          showToast({
            type: TOAST_FAILURE,
            message: error.response.data,
          })
        );
        clearTimeout(timeoutId);
        setVerify(false);
        setCode("");
        setPassword("");
        setCounter(300);
      }
      if (error.response.status === 409) {
        dispatch(
          showToast({
            type: TOAST_FAILURE,
            message: error.response.data,
          })
        );
        clearTimeout(timeoutId);
        setCode("");
        setPassword("");
        navigate("/admin");
      }
    }
  };

  const handleChange = (code) => setCode(code);

  return (
    <div className="RequestAdmin">
      <div className="f">
        <img src={banner} width="100" />
        <div className="heading-Container">
          <h2>Hello There!</h2>
          <p className="heading">
            You will receive an OTP on this email. Once received, please use it
            to create a password for your Admin Access.
          </p>
        </div>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={profile.email}
        />
        {!verify && (
          <div onClick={sendOtp} className="bu">
            Send
          </div>
        )}
        {verify && <div className="heading-otp">Enter OTP</div>}
        {verify && (
          <OtpInput
            value={code}
            onChange={handleChange}
            numInputs={6}
            shouldAutoFocus={true}
            renderSeparator={<span style={{ width: "22px" }}></span>}
            skipDefaultStyles={true}
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              width: "35px",
              height: "25px",
              border: "none",
              borderBottom: "2px solid #483d8b",
              background: "transparent",
              fontSize: "18px",
              textAlign: "center",
              marginTop: "4px",
            }}
          />
        )}
        {verify && (
          <div className="timer">Time Left: {formatTime(counter)}</div>
        )}
        {verify && <label htmlFor="password">Password</label>}
        {verify && (
          <input
            type={type}
            id="password"
            value={password}
            name="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        )}
        {verify && (
          <span className="icon" onClick={handleToggle}>
            {icon}
          </span>
        )}
        {verify && (
          <div onClick={verifyOtp} className="bu">
            Confirm
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestAdmin;
