import React from "react";
import "./Detail.scss";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import logo from "../../../../src/assets/logo.svg";
import { useNavigate } from "react-router-dom";
function Detail() {
  const navigate=useNavigate();
  return (
    <div className="Detail">
      <div className="left-content">
        <div className="big-container">
          <div className="sub-content">
            <div className="heading-container">
              <h1 className="heading">Welcome 👋</h1>
              <p className="subheading">
                This admin portal is your one-stop shop for managing your
                posterz website.
              </p>
            </div>
            <div className="insight">
              <ul>
                <li>
                  <span>Expand your product selection:</span>
                  Effortlessly add new product categories and populate them with
                  your amazing products.
                </li>
                <li>
                  <span>Stay on top of orders:</span>
                  View a complete history of all orders placed through your
                  platform, ensuring you can fulfill them efficiently.
                </li>
                <li>
                  <span>Keep your account secure:</span>
                  Update your password and username to maintain optimal account
                  security.
                </li>
                <li>
                  <span>Gain valuable insights:</span>
                  Get detailed information about all your product categories and
                  the products within them. This lets you analyze performance
                  and make informed decisions.
                </li>
              </ul>
            </div>
          </div>
          <div className="community">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginInline: "30px",
              }}
            >
              <div className="github">
                <FaGithub />
                Github
              </div>
              <div className="instagram">
                <FaInstagram />
                Instagram
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginInline: "30px",
              }}
            >
              <div className="linkedin" onClick={()=>{
                navigate("/")
              }}>
                <img src={logo} alt="" width="19.19" height="19.19" />
                Posterz.
              </div>
              <div className="twitter">
                <FaXTwitter />
                Twitter
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
