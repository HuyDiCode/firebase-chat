const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Helper to make requests
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};

// Authentication APIs
export const authAPI = {
  login: (email, password) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiCall("/auth/logout", {
      method: "POST",
      body: JSON.stringify({
        token: localStorage.getItem("accessToken"),
      }),
    }),

  refreshToken: () =>
    apiCall("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({
        token: localStorage.getItem("refreshToken"),
      }),
    }),
};

// User APIs
export const userAPI = {
  // Get current user profile
  getMe: () => apiCall("/accounts/me"),

  // Get user by ID
  getUserById: (id) => apiCall(`/accounts/${id}`),

  // Get all users with pagination
  getUsers: (page = 1, take = 10, searchParams = "") =>
    apiCall(`/accounts?page=${page}&take=${take}&searchParams=${searchParams}`),
};
