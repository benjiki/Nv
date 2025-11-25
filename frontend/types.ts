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

export interface AccountHolderStats {
    countAccountHoldersWithDebts: number;
    countAllAccountHoders: number;
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

export type TransactionType = "TRANSFER" | "REPAYMENT" | "LOAN" | "DEPOSIT" | "NOT_SET";
export type Status = "REPAID" | "PENDING" | "NOT_SET" | "REVERSED"
export interface AccountManagment {
    id: number;
    type: TransactionType;
    amount: string;
    sender: string | null;
    receiver: string;
    interestRate: number | null;
    remainingDebt: number | null;
    status: Status;
    createdAt: string;
}
export interface AccountManagementResponse {
    data: AccountManagment[];
    total: number;
}

export interface LoanRepayments {
    id: number;
    type: string;
    amount: string,
    sender: string,
    senderid: number,
    receiver: string,
    receiverid: number,
    interestRate: number,
    status: Status,
    createdAt: string,
    remainingDebt: number | null
}
export type LoanRepaymentsResponse = LoanRepayments[];


export interface AccountManagementFilter {
    sender?: string;
    receiver?: string;
    status?: Status;
    type?: TransactionType
    amount?: string;
    page?: number;
    limit?: number;
}

export interface Users {
    id: number,
    phoneNumber: string,
    role: string,
    accountStatus: boolean,
}
export interface UsersResponse {
    data: Users[];
    total: number;
}


export interface UsersFilter {
    phoneNumber?: string,
    page?: number;
    limit?: number;
}
