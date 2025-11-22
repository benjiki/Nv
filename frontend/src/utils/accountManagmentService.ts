import type { ApiResponse, AccountManagementResponse, AccountManagementFilter, TransactionType } from "types";
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

    reverseTransaction: async (id: number, type: TransactionType) => {
        let endpoint = "";

        switch (type) {
            case "TRANSFER":
                endpoint = `/transfer/${id}/reverse`;
                break;
            case "DEPOSIT":
                endpoint = `/deposit/${id}/reverse`;
                break;
            case "REPAYMENT":
                endpoint = `/repayment/${id}/reverse`;
                break;
            case "LOAN":
                endpoint = `/loan/${id}/reverse`;
                break;
            default:
                throw new Error("Invalid transaction type");
        }

        const response = await api.put(`/account-managment${endpoint}`);
        return response.data;
    }
};

