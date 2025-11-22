import { Decimal } from "decimal.js";
import { prisma, LoanStatus } from "../../prismaClient.js"
import { ApiError } from "../../utils/ApiError.js";



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
                amount: totalAmount,
                interestRate: data.interestRate,
                dueDate: data.dueDate || new Date(),
            },
        });
    });

    return loan;
};

export const reversalLoanService = async (data: { loanId: number }) => {
    const original = await prisma.loan.findUnique({
        where: { id: data.loanId }
    });

    if (!original) throw new ApiError(404, "Loan Not Found");
    if (original.status === "REVERSED") throw new ApiError(400, "Loan already reversed");
    if (original.status !== "PENDING") throw new ApiError(400, "Only pending loans with no repayments can be reversed");

    const reversal = await prisma.$transaction(async (tx) => {

        // Prevent reversal if repayments exist
        const repaymentCount = await tx.repayment.count({
            where: { loanId: original.id }
        });

        if (repaymentCount > 0) {
            throw new ApiError(400, "Cannot reverse a loan with existing repayments");
        }

        // Borrower balance check
        const accountHolder = await tx.accountholder.findUnique({
            where: { id: original.borrowerId },
            select: { balance: true }
        });

        if (!accountHolder) throw new ApiError(404, "Borrower not found");

        if (accountHolder.balance.lessThan(original.amount)) {
            throw new ApiError(400, "Borrower has insufficient funds to reverse loan");
        }

        // Move the money back
        await tx.accountholder.update({
            where: { id: original.lenderId },
            data: { balance: { increment: original.amount } }
        });

        await tx.accountholder.update({
            where: { id: original.borrowerId },
            data: { balance: { decrement: original.amount } }
        });

        await tx.loan.update({
            where: { id: original.id },
            data: { status: "REVERSED" }
        });

    });

    return reversal;
};
