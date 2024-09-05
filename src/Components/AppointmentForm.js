import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/AppointmentForm.css";
import { ToastContainer, toast } from "react-toastify";

function AppointmentForm() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const [FarmerName, setFarmerName] = useState("");
  const [FarmerNumber, setFarmerNumber] = useState("");
  const [FarmerGender, setFarmerGender] = useState("default");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [preferredMode, setPreferredMode] = useState("default");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form inputs
    const errors = {};
    if (!FarmerName.trim()) {
      errors.FarmerName = "Farmer name is required";
    }

    if (!FarmerNumber.trim()) {
      errors.FarmerNumber = "Farmer phone number is required";
    } else if (FarmerNumber.trim().length !== 10) {
      errors.FarmerNumber = "Farmer phone number must be of 10 digits";
    }

    if (FarmerGender === "default") {
      errors.FarmerGender = "Please select Farmer gender";
    }
    if (!appointmentTime) {
      errors.appointmentTime = "Appointment time is required";
    } else {
      const selectedTime = new Date(appointmentTime).getTime();
      const currentTime = new Date().getTime();
      if (selectedTime <= currentTime) {
        errors.appointmentTime = "Please select a future appointment time";
      }
    }
    if (preferredMode === "default") {
      errors.preferredMode = "Please select preferred mode";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Reset form fields and errors after successful submission
    setFarmerName("");
    setFarmerNumber("");
    setFarmerGender("default");
    setAppointmentTime("");
    setPreferredMode("default");
    setFormErrors({});

    toast.success("Appointment Scheduled !", {
      position: toast.POSITION.TOP_CENTER,
      onOpen: () => setIsSubmitted(true),
      onClose: () => setIsSubmitted(false),
    });
  };

  return (
    <div className="appointment-form-section">
      <h1 className="appointment-siteTitle">
        <Link to="/">
          AgriGenesis
        </Link>
      </h1>

      <div className="form-container">
        <h2 className="form-title">
          <span>Book Appointment Online</span>
        </h2>

        <form className="form-content" onSubmit={handleSubmit}>
          <label>
            Farmer Full Name:
            <input
              type="text"
              value={FarmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              required
            />
            {formErrors.FarmerName && <p className="error-message">{formErrors.FarmerName}</p>}
          </label>

          <br />
          <label>
            Farmer Phone Number:
            <input
              type="text"
              value={FarmerNumber}
              onChange={(e) => setFarmerNumber(e.target.value)}
              required
            />
            {formErrors.FarmerNumber && <p className="error-message">{formErrors.FarmerNumber}</p>}
          </label>

          <br />
          <label>
            Farmer Gender:
            <select
              value={FarmerGender}
              onChange={(e) => setFarmerGender(e.target.value)}
              required
            >
              <option value="default">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {formErrors.FarmerGender && <p className="error-message">{formErrors.FarmerGender}</p>}
          </label>

          <br />
          <label>
            Preferred Appointment Time:
            <input
              type="datetime-local"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            />
            {formErrors.appointmentTime && <p className="error-message">{formErrors.appointmentTime}</p>}
          </label>

          <br />
          <label>
            Preferred Mode:
            <select
              value={preferredMode}
              onChange={(e) => setPreferredMode(e.target.value)}
              required
            >
              <option value="default">Select</option>
              <option value="voice">Voice Call</option>
              <option value="video">Video Call</option>
            </select>
            {formErrors.preferredMode && <p className="error-message">{formErrors.preferredMode}</p>}
          </label>

          <br />
          <button type="submit" className="text-appointment-btn">
            Confirm Appointment
          </button>

          <p className="success-message" style={{display: isSubmitted ? "block" : "none"}}>Appointment details has been sent to the Farmers phone number via SMS.</p>
        </form>
      </div>

      <div className="legal-footer">
        <p>© 2013-2024 AgriGenesis. All rights reserved.</p>
      </div>

      <ToastContainer autoClose={5000} limit={1} closeButton={false} />
    </div>
  );
}

export default AppointmentForm;
