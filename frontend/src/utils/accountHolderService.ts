import api from "./api";
import type { AccountHolder, AccountHolderFilter, AccountHolderResponse, AccountHolderStats, ApiResponse } from "../../types";

export const accountHolderService = {
    getAllAccountHolders: async (filters?: AccountHolderFilter): Promise<AccountHolderResponse> => {
        const params: AccountHolderFilter = {
            page: filters?.page ?? 1,
            limit: filters?.limit ?? 10,
        };
        if (filters?.name) params.name = filters.name;
        if (filters?.accountNumber) params.accountNumber = filters.accountNumber;

        // Backend should return { data: AccountHolder[], total: number }
        const response = await api.get<ApiResponse<AccountHolderResponse>>("/account/", { params });

        return response.data.data;
    },

    getAccountHolderStats: async () => {
        const response = await api.get<ApiResponse<AccountHolderStats>>("/account/stats")
        return response.data.data;
    },

    getAccountHolderById: async (id: number): Promise<AccountHolder> => {
        const response = await api.get<ApiResponse<AccountHolder>>(`/account/${id}`);
        return response.data.data; // this is the single account holder object
    },

    createAccounHolder: async (data: { name: string, accountNumber: string }) => {
        const res = await api.post("/account/create", data);
        return res.data
    },
    updateAccountHolder: async (id: number, data: { name: string; accountNumber: string }) => {
        const res = await api.put(`/account/update/${id}`, data);
        return res.data; // { status, message, error }
    }

};