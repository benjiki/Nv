import type { ApiResponse, AccountManagementResponse, AccountManagementFilter } from "types";
import api from "./api";

export const accountMangementService = {
    getAllAccountTransactions: async (
        filters?: AccountManagementFilter
    ): Promise<AccountManagementResponse> => {
        const params: AccountManagementFilter = {
            page: filters?.page ?? 1,
            limit: filters?.limit ?? 10,
        };

        if (filters?.type) params.type = filters.type;
        if (filters?.sender) params.sender = filters.sender;
        if (filters?.receiver) params.receiver = filters.receiver;
        if (filters?.amount) params.amount = filters.amount;
        if (filters?.status) params.status = filters.status;

        const response = await api.get<ApiResponse<AccountManagementResponse>>(
            "/account-managment",
            { params }
        );

        // Guarantee a return object
        return response.data.data ?? { data: [], total: 0 };
    },
};

