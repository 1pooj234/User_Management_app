import { Outlet, Link, useLocation, NavLink } from "react-router-dom";
import "./RootLayout.css";
import Slider from "../ui/Slider";
import Modal from "../ui/Modal";
import { useState } from "react";
import { LogoutUser } from "../CustomHooks/Api";
const RootLayout = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const toggleSlider = () => {
    setShow((prev) => !prev);
  };
  const closeSlider = () => {
    setShow(false);
  };
  const removeModal = (val) => {
    setShow(val);
  };
  return (
    <>
      <nav className="navbar">
        <Link
          style={{ textDecoration: "none" }}
          to={location.state?.token ? "/users" : "/"}
          state={{ ...location.state }}
        >
          <img
            className="logo"
            src="https://i.ibb.co/v64GC044/project-management.png"
            alt="project-management"
          />
        </Link>
        {location.state?.token && (
          <>
            <Modal closePopup={removeModal} show={show}></Modal>
            <div className="mobile_nav">
              <Slider show={show}>
                <div className="nav_links">
                  <NavLink
                    className="navlink_cover"
                    state={{ ...location.state }}
                    to="/users"
                  >
                    <button onClick={closeSlider} className="nav_link">
                      Home
                    </button>
                    <div className="hl"></div>
                  </NavLink>
                  <NavLink
                    className="navlink_cover"
                    state={{ ...location.state }}
                    to="/profile"
                  >
                    <button onClick={closeSlider} className="nav_link">
                      Profile
                    </button>
                    <div className="hl"></div>
                  </NavLink>
                </div>
                <Link to="/">
                  <button
                    onClick={async () => {
                      await LogoutUser(
                        location.state.token,
                        location.state.emp
                      );
                    }}
                    className="logout_btn"
                  >
                    Logout
                  </button>
                </Link>
              </Slider>
            </div>
          </>
        )}

        {location.state?.token && (
          <div
            onClick={toggleSlider}
            className={show ? "center center_clicked" : "center"}
          >
            <div></div>
          </div>
        )}
        {location.state?.token && (
          <div className="nav_links_pc">
            <NavLink
              className="navlink_cover"
              state={{ ...location.state }}
              to="/users"
            >
              <button className="nav_link">Home</button>
              <div className="hl"></div>
            </NavLink>
            <NavLink
              className="navlink_cover"
              state={{ ...location.state }}
              to="/profile"
            >
              <button className="nav_link">Profile</button>
              <div className="hl"></div>
            </NavLink>
            <Link to="/">
              <button
                onClick={async () => {
                  await LogoutUser(location.state.token, location.state.emp);
                }}
                className="logout_btn"
              >
                Logout
              </button>
            </Link>
          </div>
        )}
        {location.pathname === "/login" && (
          <Link to="/">
            <button
              className="signup_btn"
              style={{ display: `${location.state?.token ? "none" : "block"}` }}
            >
              Back
            </button>
          </Link>
        )}
      </nav>
      <div className="main_page">
        <Outlet />
      </div>
    </>
  );
};

export default RootLayout;
