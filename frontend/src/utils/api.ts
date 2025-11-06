// utils/api.ts
import axios from "axios";
import { authService } from "./authService";

const api = axios.create({
    baseURL: "/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await authService.refreshToken();
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/auth";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
