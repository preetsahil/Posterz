import React, { useState } from "react";
import "./AdminLogin.scss";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ADMIN_TOKEN, setItem } from "../../utils/localStorageManager";
import { useNavigate } from "react-router-dom";
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axiosClient.post("/admin", {
        email,
        password,
      });
      setItem(KEY_ADMIN_TOKEN, response.data.adminToken);
      navigate("/admin");
    } catch (error) {
      console.log("this error", error);
    }
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
      </div>
    </div>
  );
}

export default AdminLogin;
