import { Decimal } from "decimal.js";
import { prisma, LoanStatus } from "../prismaClient.js"
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
                amount: totalAmount,
                interestRate: data.interestRate,
                dueDate: data.dueDate || new Date(),
            },
        });
    });

    return loan;
};


export const createTransferService = async (data: {
    senderId: number;
    receiverId: number;
    amount: number;
}) => {
    if (data.senderId === data.receiverId)
        throw new ApiError(400, "Sender and receiver cannot be the same");

    const sender = await prisma.accountholder.findUnique({ where: { id: data.senderId } });
    const receiver = await prisma.accountholder.findUnique({ where: { id: data.receiverId } });

    if (!sender || !receiver) throw new ApiError(404, "Sender or receiver not found");
    // if (sender.balance < data.amount) throw new ApiError(400, "Insufficient funds");
    if (sender.balance.lt(new Decimal(data.amount))) {
        throw new ApiError(400, "Insufficient funds");
    }
    const transfer = await prisma.$transaction(async (tx) => {
        // Deduct from sender
        await tx.accountholder.update({
            where: { id: data.senderId },
            data: { balance: { decrement: data.amount } },
        });

        // Credit receiver
        await tx.accountholder.update({
            where: { id: data.receiverId },
            data: { balance: { increment: data.amount } },
        });

        // Create transfer record
        return tx.transfer.create({
            data: {
                senderId: data.senderId,
                receiverId: data.receiverId,
                amount: data.amount,
            },
        });
    });

    return transfer;
};





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

export const getTransactionDataService = async (data: {
    sender?: string,
    receiver?: string,
    amount?: number,
    type?: "TRANSFER" | "REPAYMENT" | "LOAN" | "DEPOSIT",
    status?: "REPAID" | "PENDING",
    page?: number,
    limit?: number
}) => {
    // Fetch all data from DB
    const deposits = await prisma.deposit.findMany({
        where: { user: { deletedAt: null } },
        include: { user: true },
    });

    const transfers = await prisma.transfer.findMany({
        where: {
            sender: { deletedAt: null },
            receiver: { deletedAt: null }
        },
        include: { sender: true, receiver: true },
    });

    const loans = await prisma.loan.findMany({
        where: {
            lender: { deletedAt: null },
            borrower: { deletedAt: null }
        },
        include: { lender: true, borrower: true },
    });

    const repayments = await prisma.repayment.findMany({
        where: { payer: { deletedAt: null } },
        include: {
            payer: true,
            loan: { include: { lender: true } }
        },
    });

    // Normalize data
    const formattedDeposits = deposits.map(d => ({
        id: d.id,
        type: "DEPOSIT" as const,
        amount: d.amount,
        sender: null,
        receiver: d.user.name,
        interestRate: null,
        status: null,
        createdAt: d.createdAt,
    }));

    const formattedTransfers = transfers.map(t => ({
        id: t.id,
        type: "TRANSFER" as const,
        amount: t.amount,
        sender: t.sender.name,
        receiver: t.receiver.name,
        interestRate: null,
        status: null,
        createdAt: t.createdAt,
    }));

    const formattedLoans = loans.map(l => ({
        id: l.id,
        type: "LOAN" as const,
        amount: l.amount,
        sender: l.lender.name,
        receiver: l.borrower.name,
        interestRate: l.interestRate,
        status: l.status,
        createdAt: l.createdAt,
    }));

    const formattedRepayments = repayments.map(r => ({
        id: r.id,
        type: "REPAYMENT" as const,
        amount: r.amount,
        sender: r.payer.name,
        receiver: r.loan.lender.name,
        interestRate: null,
        status: r.loan.status,
        createdAt: r.createdAt,
    }));

    let allTransactions = [
        ...formattedDeposits,
        ...formattedTransfers,
        ...formattedLoans,
        ...formattedRepayments,
    ];

    // **Apply filters**
    // Apply filters with partial and case-insensitive matching
    if (data.receiver) {
        const receiverFilter = data.receiver.toString().toLowerCase();
        allTransactions = allTransactions.filter(tx =>
            tx.receiver?.toString().toLowerCase().includes(receiverFilter)
        );
    }

    if (data.sender) {
        const senderFilter = data.sender.toString().toLowerCase();
        allTransactions = allTransactions.filter(tx =>
            tx.sender?.toString().toLowerCase().includes(senderFilter)
        );
    }


    if (data.amount !== undefined) {
        allTransactions = allTransactions.filter(tx => Number(tx.amount) === data.amount);
    }

    if (data.type) {
        allTransactions = allTransactions.filter(tx => tx.type === data.type);
    }

    if (data.status) {
        const statusFilter = data.status.toLowerCase();
        allTransactions = allTransactions.filter(tx =>
            tx.status?.toLowerCase() === statusFilter
        );
    }


    // Sort by most recent
    allTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    const page = data.page ?? 1;
    const limit = data.limit ?? 10;
    const start = (page - 1) * limit;
    const paginatedTransactions = allTransactions.slice(start, start + limit);

    return {
        data: paginatedTransactions,
        total: allTransactions.length
    };
};


export const getTransactionByIdDataService = async (data: { id: number }) => {

    const deposits = await prisma.deposit.findMany({
        where: {
            user: { deletedAt: null, id: data.id }
        },
        include: {
            user: true
        }
    });

    const transfers = await prisma.transfer.findMany({
        where: {
            OR: [
                { sender: { id: data.id } },
                { receiver: { id: data.id } }
            ],
            sender: { deletedAt: null },
            receiver: { deletedAt: null }

        }, include: {
            sender: true,
            receiver: true
        }
    });

    const loans = await prisma.loan.findMany({
        where: {
            OR: [{ lender: { id: data.id } }, { borrower: { id: data.id } }],
            lender: { deletedAt: null },
            borrower: { deletedAt: null }
        }, include: {
            lender: true,
            borrower: true
        }
    });


    const repayments = await prisma.repayment.findMany({
        where: {
            payer: { deletedAt: null, id: data.id },
        }, include: {
            loan: true,
            payer: true
        }
    })

    //   normalizing data for accountholder to one sturcture

    const formattedDeposits = deposits.map(d => ({
        id: d.id,
        type: "DEPOSIT",
        amount: d.amount,
        sender: null,
        receiver: d.user.name,
        interestRate: null,
        status: null,
        createdAt: d.createdAt,
    }));

    const formattedTransfers = transfers.map(t => ({
        id: t.id,
        type: "TRANSFER",
        amount: t.amount,
        sender: t.sender.name,
        receiver: t.receiver.name,
        interestRate: null,
        status: null,
        createdAt: t.createdAt,
    }));

    const formattedLoans = loans.map(l => ({
        id: l.id,
        type: "LOAN",
        amount: l.amount,
        sender: l.lender.name,     // lender gives money
        receiver: l.borrower.name, // borrower receives money
        interestRate: l.interestRate,
        status: l.status,
        createdAt: l.createdAt,
    }));

    const formattedRepayments = repayments.map(r => ({
        id: r.id,
        type: "REPAYMENT",
        amount: r.amount,
        sender: r.payer.name,
        receiver: r.loan.lenderId, // optionally join lender if needed
        interestRate: null,
        status: r.loan.status,
        createdAt: r.createdAt,
    }));


    // merging all transactions
    const allTransactions = [
        ...formattedDeposits,
        ...formattedTransfers,
        ...formattedLoans,
        ...formattedRepayments,
    ]

    //sort data by date the most recent will be first
    allTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return allTransactions

}