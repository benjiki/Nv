import api from "./api";
import type { AccountHolder, ApiResponse } from "../../types";
export const accountHolderService = {
    getAllAccountHolders: async (): Promise<AccountHolder[]> => {
        const response = await api.get<ApiResponse<AccountHolder[]>>("/account/");
        return response.data.data;
    }
}