import React from "react";
import "./Detail.scss";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

function Detail() {
  return (
    <div className="Detail">
      <div className="left-content">
        <h1 className="heading">Welcome 👋</h1>
        <p className="subheading">
          This admin portal is your one-stop shop for managing your posterz
          website.
        </p>
        <div className="sub-content">
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
              Get detailed information about all your product categories and the
              products within them. This lets you analyze performance and make
              informed decisions.
            </li>
          </ul>
        </div>
        <div className="community">
          <div style={{
            display:"flex",
            flexDirection:"column",
            marginInline:"30px",
          }}>
          <div className="github">
            <FaGithub />
            Github
          </div>
          <div className="instagram">
            <FaInstagram />
            Instagram
          </div>
          </div>
          <div  style={{
            display:"flex",
            flexDirection:"column",
            marginInline:"30px"
          }}>
          <div className="linkedin">
            <FaLinkedin />
            Linkedin
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
