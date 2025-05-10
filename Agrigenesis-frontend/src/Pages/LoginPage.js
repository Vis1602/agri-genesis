import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../services/auth";
import "../Styles/LoginPage.css";
import Navbar from "../Components/Navbar";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await authService.login(formData.email, formData.password);
      toast.success("Login successful!");

      // Redirect based on user role
      if (user.role === "expert") {
        navigate("/expert-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="register-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
