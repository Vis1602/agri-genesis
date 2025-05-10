import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { authService } from "../services/auth";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments/appointments");
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load appointments");
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await api.put(`/appointments/${appointmentId}/cancel`);
      toast.success("Appointment cancelled successfully");
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="container"
        style={{ padding: "2rem", minHeight: "calc(100vh - 200px)" }}
      >
        <h1
          style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: "bold" }}
        >
          My Appointments
        </h1>

        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p>No appointments found.</p>
            <Link
              to="/appointment"
              className="text-appointment-btn"
              style={{ color: "#3b82f6" }}
            >
              Book an Appointment
            </Link>
          </div>
        ) : (
          <div
            className="appointments-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                style={{
                  padding: "1.5rem",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #1f2937, #111827)",
                  color: "#ffffff",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  {currentUser.role === "expert"
                    ? `👨‍🌾 Farmer: ${appointment.farmer.name}`
                    : `👨‍🔬 Expert: ${appointment.expert.name} (${appointment.expert.specialization})`}
                </h3>
                <p>
                  <strong>📅 Date:</strong>{" "}
                  {new Date(appointment.appointmentDate).toLocaleString()}
                </p>
                <p>
                  <strong>💬 Mode:</strong> {appointment.mode}
                </p>
                <p>
                  <strong>📌 Status:</strong> {appointment.status}
                </p>
                <p>
                  <strong>📝 Issue:</strong> {appointment.issue}
                </p>
                <p>
                  <strong>📝 Number:</strong> {appointment.number}
                </p>
                {["pending", "confirmed"].includes(appointment.status) && (
                  <button
                    onClick={() => handleCancelAppointment(appointment._id)}
                    className="text-appointment-btn"
                    style={{
                      backgroundColor: "#dc3545",
                      marginTop: "1rem",
                      padding: "10px 16px",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#b02a37")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#dc3545")
                    }
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MyAppointments;
