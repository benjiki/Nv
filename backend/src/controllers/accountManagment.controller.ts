import { Request, Response } from "express";
import { ApiError, ApiSuccess } from "../utils/ApiError.js";
import * as AccountManagment from "../services/accountManagment.service.js"
import { depositAccountManagmentSchema, loanAccountManagmentSchema } from "../validations/accountMangement.validation.js";


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
    res.status(201).json(new ApiSuccess(accountHolder, "Loane successfull"));
}