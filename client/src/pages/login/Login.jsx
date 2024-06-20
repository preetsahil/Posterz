import React, { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { axiosClient } from "../../utils/axiosClient";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProfile } from "../../redux/slices/profileSlice";
import { GOOGLE_ACCESS_TOKEN, setItem } from "../../utils/localStorageManager";

function Login() {
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
      navigate(-1);
    } catch (error) {
      console.log(error.message);
    }
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
