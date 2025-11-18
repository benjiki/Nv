import api from "./api";
import type { AccountHolderFilter, AccountHolderResponse, ApiResponse } from "../../types";

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
};