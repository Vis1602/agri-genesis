import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../services/auth";
import "../Styles/LoginPage.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "farmer", // default role
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
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      const { name, email, password, role } = formData;
      await authService.register(name, email, password, role);

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">Create Account</h2>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="role-select"
          >
            <option value="farmer">Farmer</option>
            <option value="expert">Agricultural Expert</option>
          </select>
        </div>
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Register"}
        </button>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
