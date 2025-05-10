import api from "./api";

export const authService = {
  register: async (userData) => {
    const response = await api.post("/users/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post("/users/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};
