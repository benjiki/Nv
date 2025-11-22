import { Decimal } from "decimal.js";
import { prisma, LoanStatus } from "../../prismaClient.js"
import { ApiError } from "../../utils/ApiError.js";



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


export const reverseTransactionService = async (data: { tranferId: number }) => {
    const original = await prisma.transfer.findUnique({
        where: { id: data.tranferId }
    })

    if (!original) throw new ApiError(404, "Transfer Not Found");
    if (original.status === "REVERSED") throw new ApiError(400, "transfer already reversed")

    const reversal = await prisma.$transaction(async (tx) => {

        const accountHolder = await tx.accountholder.findUnique({
            where: { id: original.receiverId },
            select: { balance: true }
        });

        if (!accountHolder) throw new ApiError(404, "Account holder not found");

        // Check sufficient balance
        if (accountHolder.balance.toNumber() < original.amount.toNumber()) {
            throw new ApiError(400, "Receiver has insufficient funds to reverse loan");
        }
        // reverse money to the sender
        await tx.accountholder.update({
            where: { id: original.senderId },
            data: { balance: { increment: original.amount } }
        })

        // remove money from the receiver
        await tx.accountholder.update({
            where: { id: original.receiverId },
            data: { balance: { decrement: original.amount } }
        })

        // create the reversal transaction
        const newReversal = await tx.transfer.create({
            data: {
                senderId: original.receiverId,
                receiverId: original.senderId,
                amount: original.amount,
                status: "COMPLETED",
                relatedTransactionId: original.id
            }
        })

        // Mark original as reversed
        await tx.transfer.update({
            where: { id: original.id },
            data: { status: "REVERSED", relatedTransactionId: newReversal.id }
        })
        return newReversal
    })
    return reversal
}