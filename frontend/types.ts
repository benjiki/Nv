// types.ts
export interface AccountHolder {
    id: number;
    name: string;
    accountNumber: string;
    balance: number;
    depositsAmount: number;
    outstandingDebt: number;
    transfersInAmount: number;
    transfersOutAmount: number;
    totalLoanTaken: number;
    repaymentsAmount: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

export type AccountHolderFilter = {
    name?: string;
    accountNumber?: string;
    page?: number;
    limit?: number;
};

export interface AccountHolderResponse {
    data: AccountHolder[];
    total: number;
}
