import { prisma } from "../prismaClient.js"
import { ApiError } from "../utils/ApiError.js"

export const accountHolderCreateService = async (data: {
    name: string,
    accountNumber: string
}) => {
    const checkAccount = await prisma.accountholder.findFirst({
        where: { name: data.name }
    })

    if (checkAccount) {
        throw new ApiError(404, "Account name is used try another name")
    }

    const newAccount = await prisma.accountholder.create({
        data: {
            name: data.name,
            balance: 0,
            accountNumber: data.accountNumber
        }
    })
    return newAccount;

}

export const accountHolderUpdateService = async (data: {
    id: number;
    name: string,
    accountNumber: string

}) => {
    const checkAccount = await prisma.accountholder.count({
        where: { id: Number(data.id) }
    })

    if (checkAccount <= 0) {
        throw new ApiError(404, "Account dose not exist")
    }

    const nameInUse = await prisma.accountholder.findFirst({
        where: {
            name: data.name,
            NOT: { id: data.id }, // exclude the current account holder
        },
    });

    if (nameInUse) {
        throw new ApiError(400, "Name is already used by another account holder");
    }

    const updateAccount = await prisma.accountholder.update({
        where: { id: data.id }, data: {
            name: data.name,
            accountNumber: data.accountNumber
        }
    })

    return updateAccount;
}




export const getAccountHolderService = async (data: { id: number }) => {
    // 🔹 Fetch the account holder
    const accountHolder = await prisma.accountholder.findUnique({
        where: { id: Number(data.id) },
        include: {
            deposits: true,
            loansTaken: { include: { repayments: true } },
            loansGiven: true,
            transfersIn: true,
            transfersOut: true,
            repayments: true,
        },
    });

    // 🔹 Handle "not found" case
    if (!accountHolder) {
        throw new ApiError(404, "Account does not exist");
    }

    // 🔹 Calculate derived totals
    const depositsAmount = accountHolder.deposits.reduce((sum, d) => sum + Number(d.amount), 0);

    const totalLoanTaken = accountHolder.loansTaken.reduce(
        (sum, loan) => sum + Number(loan.amount),
        0
    );

    const totalRepaidOnLoans = accountHolder.loansTaken.reduce(
        (sum, loan) =>
            sum + loan.repayments.reduce((rSum, r) => rSum + Number(r.amount), 0),
        0
    );

    const outstandingDebt = totalLoanTaken - totalRepaidOnLoans;

    const transfersInAmount = accountHolder.transfersIn.reduce(
        (sum, t) => sum + Number(t.amount),
        0
    );

    const transfersOutAmount = accountHolder.transfersOut.reduce(
        (sum, t) => sum + Number(t.amount),
        0
    );

    const repaymentsAmount = accountHolder.repayments.reduce(
        (sum, r) => sum + Number(r.amount),
        0
    );

    // 🔹 Return a clean summary
    return {
        id: accountHolder.id,
        name: accountHolder.name,
        accountNumber: accountHolder.accountNumber,
        balance: Number(accountHolder.balance),
        depositsAmount,
        outstandingDebt,
        transfersInAmount,
        transfersOutAmount,
        totalLoanTaken,
        repaymentsAmount,
    };
};





// Fetch all account holders
export const getAllAccountHoldersService = async (data: {
    name?: string,
    accountNumber?: string
    page?: number
    limit?: number
}) => {
    const page = data.page ?? 1;  // default to page 1
    const limit = data.limit ?? 10; // default to 10 items per page
    const accountHolders = await prisma.accountholder.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
            AND: [
                data.name
                    ? {
                        name: { contains: data.name }

                    }
                    : {},
                data.accountNumber
                    ? {
                        accountNumber: {
                            contains: data.accountNumber,
                        },
                    }
                    : {},
            ],
        },
        orderBy: { createdAt: "desc" },
        include: {
            deposits: true,
            loansTaken: { include: { repayments: true } },
            loansGiven: true,
            transfersIn: true,
            transfersOut: true,
            repayments: true,
        },
    });

    return accountHolders.map((ah) => {
        // Total deposits
        const depositsAmount = ah.deposits.reduce((sum, d) => sum + Number(d.amount), 0);

        // Total loan taken
        const totalLoanTaken = ah.loansTaken.reduce((sum, loan) => sum + Number(loan.amount), 0);

        // Total repaid on those loans
        const totalRepaidOnLoans = ah.loansTaken.reduce(
            (sum, loan) => sum + loan.repayments.reduce((rSum, r) => rSum + Number(r.amount), 0),
            0
        );

        // Outstanding debt = total loan taken - total repaid
        const outstandingDebt = totalLoanTaken - totalRepaidOnLoans;

        // Total transfers
        const transfersInAmount = ah.transfersIn.reduce((sum, t) => sum + Number(t.amount), 0);
        const transfersOutAmount = ah.transfersOut.reduce((sum, t) => sum + Number(t.amount), 0);

        // Total repayments made by this user
        const repaymentsAmount = ah.repayments.reduce((sum, r) => sum + Number(r.amount), 0);

        return {
            id: ah.id,
            name: ah.name,
            accountNumber: ah.accountNumber,
            balance: Number(ah.balance),
            depositsAmount,
            outstandingDebt,
            transfersInAmount,
            transfersOutAmount,
            totalLoanTaken,
            repaymentsAmount,
        };
    });
};
