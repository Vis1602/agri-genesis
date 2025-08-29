import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faBars,
  faXmark,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../Styles/Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../services/auth";

function Navbar() {
  const [nav, setNav] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const openNav = () => {
    setNav(!nav);
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleChatBtnClick = () => {
    navigate("/chat");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  return (
    <div className="navbar-section">
      <h1 className="navbar-title">
        <Link to="/">AgriGenesis</Link>
      </h1>

      {/* Desktop Navbar */}
      <ul className="navbar-items">
        <li>
          <Link to="/">
            <button
              className="navbar-links"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Home
            </button>
          </Link>
        </li>
        <li>
          <button
            onClick={() => scrollToSection("reviews")}
            className="navbar-links"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Reviews
          </button>
        </li>
        <li>
          <button
            onClick={() => scrollToSection("farmers")}
            className="navbar-links"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Experts
          </button>
        </li>
        {currentUser && (
          <>
            <li>
              <Link to="/appointments" >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  className="navbar-links"
                >
                  Appointments
                </button>
              </Link>
            </li>
            {currentUser.role === "expert" && (
              <li>
                <Link to="/expert-dashboard" className="navbar-links">
                  Dashboard
                </Link>
              </li>
            )}
          </>
        )}
      </ul>

      {/* Right-side Buttons */}
      <div className="navbar-right">
        <button
          className="navbar-btn"
          type="button"
          disabled={isButtonDisabled}
          onClick={handleChatBtnClick}
        >
          <FontAwesomeIcon icon={faCommentDots} /> Live Chat
        </button>

        {currentUser ? (
          <button
            onClick={handleLogout}
            className="navbar-btn"
            style={{ marginLeft: "10px" }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        ) : (
          <button
            className="navbar-btn"
            type="button"
            onClick={handleLogin}
            style={{ marginLeft: "10px" }}
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Navbar */}
      <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
        <div onClick={openNav} className="mobile-navbar-close">
          <FontAwesomeIcon icon={faXmark} className="hamb-icon" />
        </div>

        <ul className="mobile-navbar-links">
          <li>
            <Link onClick={openNav} to="/">
              Home
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                openNav();
                scrollToSection("reviews");
              }}
              className="navbar-links"
            >
              Reviews
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                openNav();
                scrollToSection("farmers");
              }}
              className="navbar-links"
            >
              Experts
            </button>
          </li>
          {currentUser ? (
            <>
              <li>
                <Link onClick={openNav} to="/appointments">
                  Appointments
                </Link>
              </li>
              {currentUser.role === "expert" && (
                <li>
                  <Link onClick={openNav} to="/expert-dashboard">
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link onClick={openNav} to="/chat">
                  Live Chat
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    openNav();
                    handleLogout();
                  }}
                  className="text-appointment-btn"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <button
                className="text-appointment-btn"
                type="button"
                onClick={() => {
                  openNav();
                  handleLogin();
                }}
              >
                Login
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Hamburger Icon */}
      <div className="mobile-nav">
        <FontAwesomeIcon
          icon={faBars}
          onClick={openNav}
          className="hamb-icon"
        />
      </div>
    </div>
  );
}

export default Navbar;
