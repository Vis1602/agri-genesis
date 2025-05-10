import api from "./api";

export const appointmentService = {
  // Get all appointments for the logged-in user
  getAppointments: () => api.get("/appointments").then((res) => res.data),

  // Get upcoming appointments
  getUpcomingAppointments: () =>
    api.get("/appointments/upcoming").then((res) => res.data),

  // Get a single appointment
  getAppointment: (id) =>
    api.get(`/appointments/${id}`).then((res) => res.data),

  // Create a new appointment
  createAppointment: (appointmentData) =>
    api.post("/appointments", appointmentData).then((res) => res.data),

  // Update appointment status (expert only)
  updateAppointmentStatus: (id, status) =>
    api.put(`/appointments/${id}/status`, { status }).then((res) => res.data),

  // Cancel appointment
  cancelAppointment: (id) =>
    api.put(`/appointments/${id}/cancel`).then((res) => res.data),
};
