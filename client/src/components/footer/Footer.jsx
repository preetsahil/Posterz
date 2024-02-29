import React from "react";
import { AiOutlineInstagram, AiOutlineMail } from "react-icons/ai";
import { RiTwitterXLine } from "react-icons/ri";
import { PiLinkedinLogo } from "react-icons/pi";
import "./Footer.scss";
import creditCardImg from "../../assets/creditcardicons.png";

function Footer() {
  return (
    <footer className="Footer">
      <div className="container">
        <div className="content">
          <div className="footer-left">
            <h3 className="title">Follow us</h3>
            <ul className="follow">
              <li
                className="hover-link center"
                onClick={() =>
                  window.open("https://www.instagram.com/_sahil217/")
                }
              >
                <AiOutlineInstagram />
              </li>
              <li
                className="hover-link center"
                onClick={() =>
                  window.open("https://www.linkedin.com/in/preet-sahil/")
                }
              >
                <PiLinkedinLogo />
              </li>
              <li
                className="hover-link center"
                onClick={() => window.open("https://twitter.com/sahil21_7")}
              >
                <RiTwitterXLine />
              </li>
              <li
                className="hover-link center"
                onClick={() => window.open("mailto:preetsahil289@gmail.com")}
              >
                <AiOutlineMail />
              </li>
            </ul>
          </div>
          <div className="footer-right">
            <h3 className="title">Company</h3>
            <ul className="company">
              <li className="hover-link">Contact Us</li>
              <li className="hover-link">Privacy Policy</li>
              <li className="hover-link">Returns And Exchange Policy</li>
              <li className="hover-link">Shipping Policy</li>
              <li className="hover-link">Terms & Conditions</li>
            </ul>
          </div>
        </div>
        <div className="subfooter center">
          <div className="credit-card-img">
            <img src={creditCardImg} alt="credit card img" />
          </div>
          <p style={{ marginTop: "5px" }}>
            Copyright {new Date().getFullYear()} © <strong>PosterVista.</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
