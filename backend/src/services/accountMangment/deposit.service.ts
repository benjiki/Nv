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
