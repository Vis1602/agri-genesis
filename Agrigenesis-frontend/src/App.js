import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Home from "./Pages/Home";
import LoginPage from "./Pages/LoginPage";
import Appointment from "./Pages/Appointment";
import MyAppointments from "./Pages/MyAppointments";
import ExpertDashboard from "./Pages/ExpertDashboard";
import PrivateRoute from "./Components/PrivateRoute";
import RegisterPage from "./Pages/RegisterPage";
import Chat from "./Pages/Chat";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/appointment"
            element={
              <PrivateRoute>
                <Appointment />
              </PrivateRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <PrivateRoute>
                <MyAppointments />
              </PrivateRoute>
            }
          />
          <Route
            path="/expert-dashboard"
            element={
              <PrivateRoute>
                <ExpertDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default App;
