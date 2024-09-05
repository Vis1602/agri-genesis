import React from "react";
import "../Styles/Footer.css";
import SubscribeNewsletter from "./SubscribeNewsletter";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer-section">
      <div className="footer-container">
        <div className="ft-info">
          <div className="ft-info-p1">
            <p className="ft-title">
              AgriGenesis
            </p>
            <p className="ft-description">
              Lorem Ipsum
              Lorem Ipsum
              Lorem Ipsum
              Lorem Ipsum
              Lorem Ipsum
            </p>
          </div>

          <SubscribeNewsletter />
        </div>

        <div className="ft-list">
          <p className="ft-list-title">Services</p>
          <ul className="ft-list-items">
            <li>
              <a href="#services">Expert Advice</a>
            </li>
            <li>
              <a href="#services">weather Forecast</a>
            </li>
            <li>
              <a href="#services">Chatbot</a>
            </li>
            <li>
              <a href="#services">Seed Advisory</a>
            </li>
          </ul>
        </div>

        <div className="ft-list">
          <p className="ft-list-title">Legal</p>
          <ul className="ft-list-items">
            <li>
              <Link to={"/legal"}>Privacy Policy</Link>
            </li>
            <li>
              <Link to={"/legal"}>Terms of Services</Link>
            </li>
            <li>
              <Link to={"/legal"}>Consultations</Link>
            </li>
            <li>
              <Link to={"/legal"}>How it Works</Link>
            </li>
          </ul>
        </div>

        <div className="ft-list" id="contact">
          <p className="ft-list-title">Talk To Us</p>
          <ul className="ft-list-items">
            <li>
              <a href="mailto:lokwanivishal456@gmail.com\">support@AgriGenesis.com</a>
            </li>
            <li>
              <a href="mailto:lokwanivishal456@gmail.com">
                appointment@healthplus.com
              </a>
            </li>
            <li>
              <a href="tel:+7894561235">7894561235</a>
            </li>
            <li>
              <a href="tel:+7894561235">7894561235</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="ft-copyright">
        <p>© 2010-2024 Agrogenesis. All rights reserved.</p>
        <p>Designed and Developed by 4_square</p>
      </div>
    </div>
  );
}

export default Footer;
