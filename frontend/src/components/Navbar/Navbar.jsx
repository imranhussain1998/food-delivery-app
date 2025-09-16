import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const { getTotalCartAmount, token, setToken, searchQuery, setSearchQuery } =
    useContext(StoreContext);
  const [menu, setMenu] = React.useState("menu");
  const navigate = useNavigate();

  const logOut = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>

      {/* Menu Links */}
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          mobile
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          contact
        </a>
      </ul>

      {/* Right Side */}
      <div className="navbar-right">
        {/* Search Bar */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src={assets.search_icon} alt="search" />
        </div>

        {/* Cart */}
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="cart" className="search-icon" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {/* Profile / Login */}
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="orders" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logOut}>
                <img src={assets.logout_icon} alt="logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
