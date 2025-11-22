import { Decimal } from "decimal.js";
import { prisma, LoanStatus } from "../../prismaClient.js"
import { ApiError } from "../../utils/ApiError.js";

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

export const reversaDepositService = async (data: { depositId: number }) => {
    const original = await prisma.deposit.findUnique({
        where: { id: data.depositId }
    });

    if (!original) throw new ApiError(404, "Deposit Not Found");
    if (original.status === "REVERSED") throw new ApiError(400, "Deposit already reversed");

    const result = await prisma.$transaction(async (tx) => {
        // Fetch account holder with updated row lock
        const accountHolder = await tx.accountholder.findUnique({
            where: { id: original.userId },
            select: { balance: true }
        });

        if (!accountHolder) throw new ApiError(404, "Account holder not found");

        // Check sufficient balance
        if (accountHolder.balance.toNumber() < original.amount.toNumber()) {
            throw new ApiError(400, "Insufficient funds to reverse deposit");
        }

        // Decrement balance
        await tx.accountholder.update({
            where: { id: original.userId },
            data: {
                balance: { decrement: original.amount }
            }
        });

        // Mark deposit as reversed
        await tx.deposit.update({
            where: { id: original.id },
            data: { status: "REVERSED" }
        });

    });

    return result;
};
