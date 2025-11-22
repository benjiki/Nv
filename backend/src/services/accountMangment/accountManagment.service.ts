import { prisma } from "../../prismaClient.js"

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

