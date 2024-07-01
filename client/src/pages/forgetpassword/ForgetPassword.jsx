import React, { useState } from "react";
import { CiLock } from "react-icons/ci";
import "./ForgetPassword.scss";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axiosClient.post("/auth/forget", {
        email,
      });

      localStorage.setItem("RESET_TOKEN", response.data.resetToken);
        navigate("/adminlogin");
    } catch (error){
        navigate("/adminlogin")
    }
  }
  return (
    <div className="ForgetPassword">
      <div className="box10">
        <div className="descForget">
          <CiLock style={{ fontSize: "6rem" }} />
          <div className="text">
            Enter your email address below, and we will send you a link to reset
            your password to your Registered Mail.
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="email"
            id="email"
            placeholder="example@gmail.com"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="submit"
            className="submit10"
            value="Request Password Reset"
          />
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
