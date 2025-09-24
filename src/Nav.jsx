import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "./assets/logo.png";
import "./styles.css";
import "./nav.css";
import Profile from "./Profile";
import React from "react";

function Nav() {
  return (
    <>
      <div className="navbar navbar-expand-lg sticky-top">
        <div className="container">
          {/* Logo */}
          <a className="navbar-brand" href="#">
            <img src={logo} className="logo" alt="logo" /><span> Basantotat</span> 
          </a>

          {/* ✅ nav links */}
          <div className="d-flex" id="mainNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a 
                  className="nav-link"
                  onClick={() => document.getElementById("games").scrollIntoView({ behavior: "smooth" })}
                >
                  <i className="fa-solid fa-gamepad"></i>
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link"
                  onClick={() => document.getElementById("footer").scrollIntoView({ behavior: "smooth" })}
                >
                  <i className="fa-solid fa-comments"></i>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="modal"
                  data-bs-target="#profileModal"
                >
                  <i className="fa-solid fa-user"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ✅ Modal component rendered here */}
      <Profile />
    </>
  );
}

export default Nav;
