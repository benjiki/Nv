// utils/authService.ts
import type { ApiResponse, Users, UsersFilter, UsersResponse } from "types";
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

    allusersServivce: async (
        filters?: UsersFilter
    ): Promise<UsersResponse> => {
        const params: UsersFilter = {
            page: filters?.page ?? 1,
            limit: filters?.limit ?? 10,
        };

        if (filters?.phoneNumber) params.phoneNumber = filters.phoneNumber;

        const response = await api.get<ApiResponse<UsersResponse>>(
            "/auth/users",
            { params }
        );

        // Guarantee a return object
        return response.data.data ?? { data: [], total: 0 };
    },

    usersByidService: async (id: number): Promise<Users> => {
        const response = await api.get<ApiResponse<Users>>(`/auth/user/${id}`);
        return response.data.data;
    },
    updateUsersService: async (id: number, data: { phoneNumber: string; password: string }) => {
        const res = await api.put(`auth/user/${id}`, data);
        return res.data; // { status, message, error }
    },
    usersStatsService: async () => {

    }
};
