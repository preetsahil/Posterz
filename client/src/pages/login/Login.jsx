import React, { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { axiosClient } from "../../utils/axiosClient";
import "./Login.scss";
import {
  KEY_ACCESS_TOKEN,
  getItem,
  setItem,
} from "../../utils/localStorageManager";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProfile } from "../../redux/slices/cartSlice";
function Login() {
  const [userDetails, setUserDetails] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUserDetails(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });
  const fetchProfile = async () => {
    try {
      const response = await axiosClient.post("/auth/verify", {
        userDetails,
      });
      setItem(KEY_ACCESS_TOKEN, userDetails.access_token);
      dispatch(setProfile(response.data.user));
      navigate(-1);
    } catch (error) {
      setUserDetails([]);
    }
  };

  useEffect(() => {
    const token = getItem(KEY_ACCESS_TOKEN);
    if (userDetails.length !== 0 && !token) {
      fetchProfile();
    }
  }, [userDetails]);

  return (
    <div className="login">
      <button
        onClick={() => {
          login();
        }}
        className="login-with-google-btn"
      >
        <p style={{paddingLeft:"30px"}}>Sign in with Google</p>
      </button>
    </div>
  );
}

export default Login;
