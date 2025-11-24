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

    if (lender.balance.lt(new Decimal(data.amount))) {
        throw new ApiError(400, "Lender has insufficient funds");
    }
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

        // Check for repayments
        const repaymentCount = await tx.repayment.count({
            where: { loanId: original.id }
        });
        if (repaymentCount > 0) throw new ApiError(400, "Cannot reverse a loan with existing repayments");

        // Calculate principal and interest portions
        const totalAmount = new Decimal(original.amount); // total amount borrower received
        const interestRate = new Decimal(original.interestRate);
        const principal = totalAmount.div(interestRate.div(100).plus(1));
        const interest = totalAmount.minus(principal);

        // Fetch borrower balance
        const borrowerAccount = await tx.accountholder.findUnique({
            where: { id: original.borrowerId },
            select: { balance: true }
        });
        if (!borrowerAccount) throw new ApiError(404, "Borrower not found");

        if (new Decimal(borrowerAccount.balance).lt(totalAmount)) {
            throw new ApiError(400, "Borrower has insufficient funds to reverse loan");
        }

        // Reverse the principal back to lender
        await tx.accountholder.update({
            where: { id: original.lenderId },
            data: { balance: { increment: principal } }
        });

        // Remove total amount from borrower (principal + interest)
        await tx.accountholder.update({
            where: { id: original.borrowerId },
            data: { balance: { decrement: totalAmount } }
        });

        // Update loan status
        await tx.loan.update({
            where: { id: original.id },
            data: { status: LoanStatus.REVERSED }
        });

        return {
            message: "Loan reversed successfully",
            principal: principal.toString(),
            interestRemoved: interest.toString()
        };
    });

    return reversal;
};

export const AllLoansWithActiveRepaymentService = async () => {

    const loans = await prisma.loan.findMany({
        where: {
            lender: { deletedAt: null },
            borrower: { deletedAt: null },
            NOT: {
                status: { in: ["REVERSED", "REPAID", "DEFAULTED"] }
            }
        },
        include: { lender: true, borrower: true },
    });

    const formattedLoans = loans.map(l => ({
        id: l.id,
        type: "LOAN" as const,
        amount: l.amount,
        sender: l.lender.name,
        receiver: l.borrower.name,
        interestRate: l.interestRate,
        status: l.status,
        createdAt: l.createdAt,
        remainingDebt: null
    }));
    return formattedLoans;
}