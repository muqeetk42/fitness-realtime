import axios from "axios";

// 1. Establish the Communication Link
// We create a central Axios instance pointing to our backend server's base orbit.
const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// 2. The Pre-Flight Interceptor
// Before ANY request leaves the client, this function intercepts it.
api.interceptors.request.use(
    (config) => {
        // SSR Guard: Ensure we are in the browser before accessing window/localStorage
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        // If there is an error setting up the request, reject it immediately
        return Promise.reject(error);
    }
);

// 3. The Post-Flight Interceptor (Ejection Seat)
// This intercepts any responses COMING BACK from the server before they reach our components.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                console.warn("Token expired or invalid. Ejecting user...");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// ==========================================
// API WRAPPERS
// ==========================================
// These functions abstract the network logic away from our React components.

export const registerUser = (data) => api.post("/register", data);
export const loginUser = (data) => api.post("/login", data);
export const getUser = () => api.get("/api/user");
