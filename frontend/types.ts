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
