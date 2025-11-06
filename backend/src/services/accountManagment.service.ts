import { prisma } from "../prismaClient.js"
import { ApiError } from "../utils/ApiError.js";

export const createDepositService = async (data: {
    userId: number;
    amount: number;
}) => {
    // ✅ Check if user exists
    const user = await prisma.accountholder.findUnique({
        where: { id: data.userId },
    });
    if (!user) throw new ApiError(404, "Account holder not found");

    // ✅ Create deposit and update balance
    const deposit = await prisma.$transaction(async (tx) => {
        await tx.accountholder.update({
            where: { id: data.userId },
            data: {
                balance: { increment: data.amount },
            },
        });

        return tx.deposit.create({
            data: {
                userId: data.userId,
                amount: data.amount,
            },
        });
    });

    return deposit;
};


export const createLoanService = async (data: {
    lenderId: number;
    borrowerId: number;
    amount: number;
    interestRate: number;
    dueDate?: Date;
}) => {
    // ✅ Verify lender and borrower exist
    const lender = await prisma.accountholder.findUnique({ where: { id: data.lenderId } });
    const borrower = await prisma.accountholder.findUnique({ where: { id: data.borrowerId } });

    if (!lender || !borrower) throw new ApiError(404, "Lender or borrower not found");

    // ✅ Create loan and adjust balances (optional logic)
    const loan = await prisma.$transaction(async (tx) => {
        const interestAmount = (data.amount * data.interestRate) / 100;
        const totalAmount = data.amount + interestAmount;

        // Deduct amount from lender’s balance
        await tx.accountholder.update({
            where: { id: data.lenderId },
            data: { balance: { decrement: data.amount } },
        });

        // Add amount to borrower’s balance
        await tx.accountholder.update({
            where: { id: data.borrowerId },
            data: { balance: { increment: totalAmount } },
        });

        // Create loan record
        return tx.loan.create({
            data: {
                lenderId: data.lenderId,
                borrowerId: data.borrowerId,
                amount: data.amount,
                interestRate: data.interestRate,
                dueDate: data.dueDate || new Date(),
            },
        });
    });

    return loan;
};
