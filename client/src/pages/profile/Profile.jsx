import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { axiosClient } from "../../utils/axiosClient";
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";
import {
  deleteAdminProfile,
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
} from "../../utils/localStorageManager";
import axios from "axios";
function Profile() {
  const adminProfile = useSelector(
    (state) => state.profileReducer.adminProfile
  );
  const [isAdmin, setIsAdmin] = useState(adminProfile?.isAdmin);
  const [change, setChange] = useState(false);
  const [name, setName] = useState(adminProfile?.name);
  const [reqName, setNameReq] = useState(false);
  const [reqNameLen, setReqNameLen] = useState(false);
  const [borderTopPick, setBorderTopPick] = useState(false);
  const handleClickOutside = (event) => {
    if (borderTopPick && !event.target.closest(".admin")) {
      setBorderTopPick(false);
    }
  };
  const dispatch = useDispatch();
  const [typeforCurrent, setTypeForCurrent] = useState("password");
  const [typeforPassword, setTypeForPassword] = useState("password");
  const [typeforConfirm, setTypeForConfirm] = useState("password");
  const [iconCurrent, setIconCurrent] = useState(<IoEyeOffOutline />);
  const [iconPassword, setIconPassword] = useState(<IoEyeOffOutline />);
  const [iconConfirm, setIconConfirm] = useState(<IoEyeOffOutline />);
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const profile = useSelector((state) => state.profileReducer.profile);

  const updateUser = async () => {
    if (name === "") {
      setNameReq(true);
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: This attribute is required!",
        })
      );
      return;
    }
    if (name.length > 20) {
      setReqNameLen(true);
      dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: "Warning: Name should have length less than 20!",
        })
      );
      return;
    }
    if (
      currentPassword.length > 0 ||
      password.length > 0 ||
      confirmPassword.length > 0
    ) {
      if (
        currentPassword.length === 0 ||
        password.length === 0 ||
        confirmPassword.length === 0
      ) {
        dispatch(
          showToast({
            type: TOAST_FAILURE,
            message: "Warning: Please fill all fields of Change Password",
          })
        );
        return;
      }
      if (password !== confirmPassword) {
        dispatch(
          showToast({
            type: TOAST_FAILURE,
            message: "Warning: Password and Confirm Password should be same!",
          })
        );
        return;
      }
    }
    try {
      const response = await axiosClient.put("/admin/profile", {
        name,
        isAdmin,
        currentPassword,
        password,
        confirmPassword,
      });

      setPassword("");
      setCurrentPassword("");
      setConfirmPassword("");
      setChange(false);
      if (getItem(OAUTH_ADMIN_TOKEN) && response.data.user.isAdmin) {
        dispatch(setAdminProfile(response.data.user));
        dispatch(setProfile(response.data.user));
      } else if (getItem(KEY_ADMIN_TOKEN) && response.data.user.isAdmin) {
        dispatch(setAdminProfile(response.data.user));
      }
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: "Profile Updated Successfully",
        })
      );
      if (!response.data.user.isAdmin) {
        if (getItem(OAUTH_ADMIN_TOKEN)) {
          removeItem(OAUTH_ADMIN_TOKEN);
          removeItem(OAUTH_ACCESS_TOKEN);
          await axiosClient.post("/auth/logout", { profile });
          dispatch(deleteAdminProfile());
          dispatch(deleteProfile());
        } else if (getItem(KEY_ADMIN_TOKEN)) {
          removeItem(KEY_ADMIN_TOKEN);
          dispatch(deleteAdminProfile());
          await axios
            .create({
              baseURL: "http://localhost:4000",
              withCredentials: true,
            })
            .post("/auth/revoke");
        }
        navigate("/adminlogin");
      }
    } catch (error) {
      if (error.response.status === 400) {
        dispatch(
          showToast({
            type: TOAST_FAILURE,
            message: "Warning: Current Password is incorrect!",
          })
        );
      }
    }
  };
  const handleToggle1 = () => {
    setTypeForCurrent(typeforCurrent === "password" ? "text" : "password");
    setIconCurrent(
      typeforCurrent === "password" ? <IoEyeOutline /> : <IoEyeOffOutline />
    );
  };

  const handleToggle2 = () => {
    setTypeForPassword(typeforPassword === "password" ? "text" : "password");
    setIconPassword(
      typeforPassword === "password" ? <IoEyeOutline /> : <IoEyeOffOutline />
    );
  };

  const handleToggle3 = () => {
    setTypeForConfirm(typeforConfirm === "password" ? "text" : "password");
    setIconConfirm(
      typeforConfirm === "password" ? <IoEyeOutline /> : <IoEyeOffOutline />
    );
  };

  useEffect(() => {
    const hasChanges =
      currentPassword !== "" || password !== "" || confirmPassword !== "";
    setChange(hasChanges);
  }, [currentPassword, password, confirmPassword]);

  return (
    <div
      className="Profile"
      onClick={(e) => {
        handleClickOutside(e);
      }}
    >
      <div className="top-box">
        <p className="text">{adminProfile?.name}</p>
        <div
          className={change ? "ctr-btn" : "no-ctr-btn"}
          onClick={() => {
            if (change) {
              updateUser();
            }
          }}
        >
          <TiTick />
          <p>Save</p>
        </div>
      </div>
      <div className="inputbox">
        <div className="inputcontainer">
          <p className="heading">Profile</p>
          <div className="row1">
            <div className="emailinput">
              <label htmlFor="email">
                Email<span>*</span>
              </label>
              <input
                type="text"
                id="email"
                className="inputmail"
                defaultValue={adminProfile?.email}
              />
            </div>
            <div className="nameinput">
              <label htmlFor="name">
                Name<span>*</span>
              </label>
              <input
                type="text"
                id="name"
                className={reqName ? "input-req" : "input-cont1"}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value !== adminProfile?.name) {
                    setChange(true);
                  } else {
                    setChange(false);
                  }
                }}
                onClick={() => {
                  setNameReq(false);
                  setReqNameLen(false);
                }}
              />
              {reqName && (
                <div className="error">This attribute is required!</div>
              )}
              {reqNameLen && (
                <div className="error">
                  Name should have length less than 10
                </div>
              )}
            </div>
          </div>
          <div className="admin">
            <p>IsAdmin</p>
            <div className={borderTopPick ? "border-select" : "select"}>
              <div
                className={isAdmin ? "not-false" : "false"}
                onClick={() => {
                  setIsAdmin(false);
                  if (false !== adminProfile?.isAdmin) {
                    setChange(true);
                  } else {
                    setChange(false);
                  }
                  setBorderTopPick(true);
                }}
              >
                <p>FALSE</p>
              </div>
              <div
                className={isAdmin ? "true" : "not-true"}
                onClick={() => {
                  setIsAdmin(true);
                  if (true !== adminProfile?.isAdmin) {
                    setChange(true);
                  } else {
                    setChange(false);
                  }
                  setBorderTopPick(true);
                }}
              >
                <p>TRUE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="passwordbox">
        <div className="passwordcontainer">
          <p className="heading">Change Password</p>
          <div className="row1">
            <div className="currentpassword">
              <label htmlFor="currentpassword">Current Password</label>
              <input
                type={typeforCurrent}
                id="currentpassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <span className="icon" onClick={handleToggle1}>
                {iconCurrent}
              </span>
            </div>
          </div>
          <div className="row2">
            <div className="password">
              <label htmlFor="password">Password</label>
              <input
                type={typeforPassword}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="icon" onClick={handleToggle2}>
                {iconPassword}
              </span>
            </div>
            <div className="confirmpassword">
              <label htmlFor="confirmpassword">Confirm Password</label>
              <input
                type={typeforConfirm}
                id="confirmpassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="icon" onClick={handleToggle3}>
                {iconConfirm}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
