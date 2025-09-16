import React, { useState, useContext } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";   // 👈 added

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onLogin = async (e) => {
    e.preventDefault();
    const endpoint = currState === "Login" ? "login" : "register";
    try {
      const res = await fetch(`${url}/api/user/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(result.message || "Success ✅");   // 👈 beautiful toast
        setToken(result.token);
        localStorage.setItem("token", result.token);
        setShowLogin(false);
      } else {
        toast.error(result.message || "Something went wrong ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error! Please try again.");
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>

        <div className="login-popup-inputs">
          {currState !== "Login" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />

          <div className="password-field">
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button type="submit">
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
