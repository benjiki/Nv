// utils/authService.ts
import api from "./api"; // axios instance with interceptor

export const authService = {
    login: async (data: { phoneNumber: string; password: string }) => {
        const res = await api.post("/auth/login", data);
        const { accessToken, refreshToken, user } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        return user;
    },

    register: async (data: { phoneNumber: string; password: string }) => {
        const res = await api.post("/auth/register", data);
        const { accessToken, refreshToken, user } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        return user;
    },

    me: async () => {
        const res = await api.get("/auth/me");
        return res.data.user;
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token found");

        const res = await api.post("/auth/refresh-token", { refreshToken });
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        return res.data.accessToken;
    },
};
