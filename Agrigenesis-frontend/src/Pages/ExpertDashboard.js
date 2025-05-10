import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { authService } from "../services/auth";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function ExpertDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (currentUser?.role !== "expert") {
      toast.error("Unauthorized access");
      window.location.href = "/";
      return;
    }
    fetchAppointments();
  }, [currentUser?.role]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments/upcoming");
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load appointments");
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, {
        status: newStatus,
      });
      toast.success(`Appointment ${newStatus} successfully`);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update appointment status");
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="container"
        style={{ padding: "2rem", minHeight: "calc(100vh - 200px)" }}
      >
        <h1 style={{ marginBottom: "2rem" }}>Expert Dashboard</h1>
        <div style={{ marginBottom: "2rem" }}>
          <h2>Welcome, {currentUser?.name}</h2>
          <p>Specialization: {currentUser?.specialization}</p>
        </div>

        <h3>Upcoming Appointments</h3>
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No upcoming appointments found.</p>
        ) : (
          <div
            className="appointments-grid"
            style={{ display: "grid", gap: "1rem" }}
          >
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                style={{
                  padding: "1rem",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-secondary)",
                }}
              >
                <h3>Farmer: {appointment.farmer.name}</h3>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(appointment.appointmentDate).toLocaleString()}
                </p>
                <p>
                  <strong>Mode:</strong> {appointment.mode}
                </p>
                <p>
                  <strong>Status:</strong> {appointment.status}
                </p>
                <p>
                  <strong>Issue:</strong> {appointment.issue}
                </p>
                {appointment.status === "pending" && (
                  <div
                    style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
                  >
                    <button
                      onClick={() =>
                        handleUpdateStatus(appointment._id, "confirmed")
                      }
                      className="text-appointment-btn"
                      style={{ backgroundColor: "#28a745" }}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(appointment._id, "cancelled")
                      }
                      className="text-appointment-btn"
                      style={{ backgroundColor: "#dc3545" }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {appointment.status === "confirmed" && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(appointment._id, "completed")
                    }
                    className="text-appointment-btn"
                    style={{ backgroundColor: "#28a745", marginTop: "1rem" }}
                  >
                    Mark as Completed
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

export default ExpertDashboard;
