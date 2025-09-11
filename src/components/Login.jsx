import React, { useState } from "react";
import Image from "../assets/Shoppii.png";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/styles/Login.css";

const Login = () => {
  const URL = import.meta.env.VITE_API_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = { email, password };

    setLoader(true);

    // Use toast.promise
    await toast.promise(
      (async () => {
        const res = await fetch(`${URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        });

        if (res.status === 400) {
          throw new Error("Invalid Credentials! Please try again.");
        } else if (res.status === 200) {
          const contentType = res.headers.get("content-type");
          const resData = contentType.includes("application/json")
            ? await res.json()
            : await res.text();

          if (resData?.token) {
            localStorage.setItem("user:token", resData.token);
            localStorage.setItem("user:detail", JSON.stringify(resData.user));
            setLoader(false);
            navigate("/dashboard");
            return "Successfully logged in!";
          } else {
            throw new Error("Something went wrong, please try again.");
          }
        }
      })(),
      {
        pending: "Logging in...",
        success: "Welcome back! 🎉",
        error: {
          render({ data }) {
            return data?.message || "Login failed!";
          },
        },
      }
    );
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="login-center">
            <h2 className="font-bold">Welcome back Boss!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <div className="login-center-options">
                <a href="#">Forgot password?</a>
              </div>

              <div className="login-center-buttons">
                <button className="btn-submit" type="submit" disabled={loader}>
                  {loader ? "Logging in..." : "Log In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toastify container - Dark Theme, Bottom Right */}
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default Login;
