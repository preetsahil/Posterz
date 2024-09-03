import React, { useState } from "react";
import "./ResetPassword.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";


function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmpassword) {
      alert("Passwords Don't Match");
      setConfirmPassword("");
      setPassword("");
    } else {
      let url = "http://localhost:4000";
      if (import.meta.env.PROD) {
        url = import.meta.env.VITE_REACT_APP_SERVER_BASE_URL;
      }
      const token = localStorage.getItem("RESET_TOKEN");
      try {
        await axios.post(
          `${url}/auth/reset`,
          {
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(
          showToast({
            type: TOAST_SUCCESS,
            message: "Password Reset Successfully!",
          })
        );
        navigate("/adminlogin");
        localStorage.removeItem("RESET_TOKEN");
      } catch (error) {
        if (error.response.status === 401) {
          dispatch(
            showToast({
              type: TOAST_FAILURE,
              message: error.response.data,
            })
          );
          navigate("/forget");
        }
      }
    }
  }

  return (
    <div className="ResetPassword">
      <div className="box">
        <form onSubmit={handleSubmit}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            id="confirmpassword"
            value={confirmpassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            required
          />
          <input type="submit" className="submit" value="Reset Password" />
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
