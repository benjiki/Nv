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