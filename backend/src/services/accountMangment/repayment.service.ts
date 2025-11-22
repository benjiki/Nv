import { Decimal } from "decimal.js";
import { prisma, LoanStatus } from "../../prismaClient.js"
import { ApiError } from "../../utils/ApiError.js";


export const createRepaymentService = async (data: {
    loanId: number;
    payerId: number;
    amount: number;
}) => {
    // ✅ Validate loan and payer
    const loan = await prisma.loan.findUnique({
        where: { id: data.loanId },
        include: { lender: true, borrower: true },
    });

    if (!loan) throw new ApiError(404, "Loan not found");

    const payer = await prisma.accountholder.findUnique({
        where: { id: data.payerId },
    });
    if (!payer) throw new ApiError(404, "Payer not found");

    // ✅ Check loan status
    if (loan.status === LoanStatus.REPAID) {
        throw new ApiError(400, "This loan has already been fully repaid");
    }

    if (loan.status === LoanStatus.DEFAULTED) {
        throw new ApiError(400, "This loan is defaulted and cannot accept repayments");
    }

    // ✅ Check if payer has enough balance
    if (payer.balance.lt(new Decimal(data.amount))) {
        throw new ApiError(400, "Insufficient funds");
    }

    // ✅ Calculate remaining debt
    const totalRepaid = await prisma.repayment.aggregate({
        _sum: { amount: true },
        where: { loanId: data.loanId },
    });

    const totalRepaidAmount = totalRepaid._sum.amount || new Decimal(0);
    const remainingDebt = loan.amount.sub(totalRepaidAmount);

    if (remainingDebt.lte(new Decimal(0))) {
        throw new ApiError(400, "No outstanding debt for this loan");
    }

    // ✅ Prevent overpayment
    if (new Decimal(data.amount).gt(remainingDebt)) {
        throw new ApiError(
            400,
            `Your remaining debt is ${remainingDebt.toFixed(2)}, not ${data.amount}`
        );
    }

    // ✅ Check if user has taken another loan after this one
    const newerLoan = await prisma.loan.findFirst({
        where: {
            borrowerId: data.payerId,
            id: { not: loan.id },
            createdAt: { gt: loan.createdAt },
            status: { in: [LoanStatus.PENDING, LoanStatus.ACTIVE] },
        },
        orderBy: { createdAt: "desc" },
    });

    if (newerLoan) {
        throw new ApiError(
            400,
            "You have already taken another active loan. Repay the current active loan instead."
        );
    }

    // ✅ Proceed with repayment in transaction
    const repayment = await prisma.$transaction(async (tx) => {
        // Deduct from payer
        await tx.accountholder.update({
            where: { id: data.payerId },
            data: { balance: { decrement: data.amount } },
        });

        // Credit lender
        await tx.accountholder.update({
            where: { id: loan.lenderId },
            data: { balance: { increment: data.amount } },
        });

        // Record repayment
        const newRepayment = await tx.repayment.create({
            data: {
                loanId: data.loanId,
                payerId: data.payerId,
                amount: data.amount,
            },
        });

        // Check if loan is now fully paid
        const updatedTotal = totalRepaidAmount.add(new Decimal(data.amount));

        if (updatedTotal.gte(loan.amount)) {
            await tx.loan.update({
                where: { id: data.loanId },
                data: { status: LoanStatus.REPAID },
            });
        }

        return newRepayment;
    });

    return repayment;
};