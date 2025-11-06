import { Request, Response } from "express";
import { ApiError, ApiSuccess } from "../utils/ApiError.js";
import * as AccountManagment from "../services/accountManagment.service.js"
import { depositAccountManagmentSchema, loanAccountManagmentSchema, repaymentAccountManagmentSchema, transferAccountManagmentSchema } from "../validations/accountMangement.validation.js";


export const createDepositController = async (req: Request, res: Response) => {
    const { error, value } = depositAccountManagmentSchema.validate(req.body, {
        abortEarly: false
    })
    if (error) {
        const messages = error.details.map((err) => err.message);
        throw new ApiError(400, messages.join(", "));
    }
    const accountHolder = await AccountManagment.createDepositService(value)
    res.status(201).json(new ApiSuccess(accountHolder, "Deposit successfull"));
}

export const createLoanController = async (req: Request, res: Response) => {
    const { error, value } = loanAccountManagmentSchema.validate(req.body, {
        abortEarly: false
    })
    if (error) {
        const messages = error.details.map((err) => err.message);
        throw new ApiError(400, messages.join(", "));
    }
    const accountHolder = await AccountManagment.createLoanService(value)
    res.status(201).json(new ApiSuccess(accountHolder, "Loan successfull"));
}


export const createTransferController = async (req: Request, res: Response) => {
    const { error, value } = transferAccountManagmentSchema.validate(req.body, {
        abortEarly: false
    })
    if (error) {
        const messages = error.details.map((err) => err.message);
        throw new ApiError(400, messages.join(", "));
    }
    const accountHolder = await AccountManagment.createTransferService(value)
    res.status(201).json(new ApiSuccess(accountHolder, "Transfer successfull"));
}


export const createRepaymentController = async (req: Request, res: Response) => {
    const { error, value } = repaymentAccountManagmentSchema.validate(req.body, {
        abortEarly: false
    })
    if (error) {
        const messages = error.details.map((err) => err.message);
        throw new ApiError(400, messages.join(", "));
    }
    const accountHolder = await AccountManagment.createRepaymentService(value)
    res.status(201).json(new ApiSuccess(accountHolder, "Repayment successfull"));
}