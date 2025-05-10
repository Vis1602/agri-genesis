import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../services/auth";
import "../Styles/RegisterPage.css";
import Navbar from "../Components/Navbar";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "farmer", 
    specialization: "",
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

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.register(formData);
      toast.success("Registration successful! Please login.");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Register</h2>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

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
              autoComplete="new-password"
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              placeholder="Confirm your password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="farmer" style={{ color: "black" }}>
                Farmer
              </option>
              <option value="expert" style={{ color: "black" }}>
                Expert
              </option>
            </select>
          </div>

          {formData.role === "expert" && (
            <div className="form-group">
              <label htmlFor="specialization">Specialization</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                placeholder="Enter your specialization"
              />
            </div>
          )}

          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          <p className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
