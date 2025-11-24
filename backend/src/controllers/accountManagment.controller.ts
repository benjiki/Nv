import { Request, Response } from "express";
import { ApiError, ApiSuccess } from "../utils/ApiError.js";
import * as AccountManagment from "../services/accountMangment/accountManagment.service.js"
import * as AccountManagmentValidation from "../validations/accountMangement.validation.js";
import { io } from "../index.js";
import { createDepositService, reversaDepositService } from "../services/accountMangment/deposit.service.js";
import { AllLoansWithActiveRepaymentService, createLoanService, reversalLoanService } from "../services/accountMangment/loan.service.js";
import { createTransferService, reverseTransactionService } from "../services/accountMangment/transfer.service.js";
import { createRepaymentService, reversalRepaymentService } from "../services/accountMangment/repayment.service.js";

export const createDepositController = async (req: Request, res: Response) => {
    const { error, value } = AccountManagmentValidation.depositAccountManagmentSchema.validate(req.body, {
        abortEarly: false
    })
    if (error) {
        const messages = error.details.map((err) => err.message);
        throw new ApiError(400, messages.join(", "));
    }
    const accountHolder = await createDepositService(value)
    io.emit("accountTransactionUpdated");
    io.emit("accountHoldersUpdated")
    res.status(201).json(new ApiSuccess(accountHolder, "Deposit successfull"));
}

export const createLoanController = async (req: Request, res: Response) => {
    const { error, value } = AccountManagmentValidation.loanAccountManagmentSchema.validate(req.body, {
        abortEarly: false
    })
    if (error) {
        const messages = error.details.map((err) => err.message);
        throw new ApiError(400, messages.join(", "));
    }
    const accountHolder = await createLoanService(value)
    io.emit("accountTransactionUpdated");
    io.emit("accountHoldersUpdated")
    res.status(201).json(new ApiSuccess(accountHolder, "Loan successfull"));
}


export const createTransferController = async (req: Request, res: Response) => {
    const { error, value } = AccountManagmentValidation.transferAccountManagmentSchema.validate(req.body, {
        abortEarly: false
    })
    if (error) {
        const messages = error.details.map((err) => err.message);
        throw new ApiError(400, messages.join(", "));
    }
    const accountHolder = await createTransferService(value)
    io.emit("accountTransactionUpdated");
    io.emit("accountHoldersUpdated")
    res.status(201).json(new ApiSuccess(accountHolder, "Transfer successfull"));
}


export const createRepaymentController = async (req: Request, res: Response) => {
    const { error, value } = AccountManagmentValidation.repaymentAccountManagmentSchema.validate(req.body, {
        abortEarly: false
    })
    if (error) {
        const messages = error.details.map((err) => err.message);
        throw new ApiError(400, messages.join(", "));
    }
    const accountHolder = await createRepaymentService(value)
    io.emit("accountTransactionUpdated");
    io.emit("accountHoldersUpdated")
    res.status(201).json(new ApiSuccess(accountHolder, "Repayment successfull"));
}

export const getTransactionDataController = async (req: Request, res: Response) => {
    const { error: paramError, value: paramValue } = AccountManagmentValidation.accountManagmentQueryFiltterSchema.validate(req.query);

    // If there's an error in the request body or params, return an error response
    if (paramError) {
        const messages = [
            ...(paramError?.details.map((err) => err.message) || [])
        ];
        return res.status(400).json({
            error: messages.join(", "),
        });
    }

    const transactions = await AccountManagment.getTransactionDataService({ ...paramValue });

    res.status(200).json(new ApiSuccess(transactions, "All transactions"))
}

export const getTransactionByIdDataController = async (req: Request, res: Response) => {
    const { error: paramError, value: paramValue } = AccountManagmentValidation.accountManagmentParamSchema.validate(req.params)

    if (paramError) {
        const messages = [
            ...(paramError?.details.map((err) => err.message) || [])
        ];
        return res.status(400).json({
            error: messages.join(", "),
        });
    }
    const transactions = await AccountManagment.getTransactionByIdDataService({ id: paramValue.id })
    res.status(200).json(new ApiSuccess(transactions, "All transactions"))

}

export const reverseTransactionController = async (req: Request, res: Response) => {
    const { error: paramError, value: paramValue } = AccountManagmentValidation.accountManagmentParamSchema.validate(req.params)
    if (paramError) {
        const messages = [
            ...(paramError?.details.map((err) => err.message) || [])
        ];
        return res.status(400).json({
            error: messages.join(", "),
        });
    }
    const reversalTransaction = await reverseTransactionService({ tranferId: paramValue.id })
    res.status(200).json(new ApiSuccess(reversalTransaction, "Transaction reversed successfully"))
}

export const reverseDepositController = async (req: Request, res: Response) => {
    const { error: paramError, value: paramValue } = AccountManagmentValidation.accountManagmentParamSchema.validate(req.params)
    if (paramError) {
        const messages = [
            ...(paramError?.details.map((err) => err.message) || [])
        ];
        return res.status(400).json({
            error: messages.join(", "),
        });
    }
    const reversalDeposit = await reversaDepositService({ depositId: paramValue.id })
    res.status(200).json(new ApiSuccess(reversalDeposit, "Deposit reversed successfully"))
}

export const reverseRepaymentController = async (req: Request, res: Response) => {
    const { error: paramError, value: paramValue } = AccountManagmentValidation.accountManagmentParamSchema.validate(req.params)
    if (paramError) {
        const messages = [
            ...(paramError?.details.map((err) => err.message) || [])
        ];
        return res.status(400).json({
            error: messages.join(", "),
        });
    }
    const reversalDeposit = await reversalRepaymentService({ repaymentId: paramValue.id })
    res.status(200).json(new ApiSuccess(reversalDeposit, "Repayment reversed successfully"))
}

export const reverseLoanController = async (req: Request, res: Response) => {
    const { error: paramError, value: paramValue } = AccountManagmentValidation.accountManagmentParamSchema.validate(req.params)
    if (paramError) {
        const messages = [
            ...(paramError?.details.map((err) => err.message) || [])
        ];
        return res.status(400).json({
            error: messages.join(", "),
        });
    }
    const reversalDeposit = await reversalLoanService({ loanId: paramValue.id })
    res.status(200).json(new ApiSuccess(reversalDeposit, "Loan reversed successfully"))
}

export const AllLoansController = async (req: Request, res: Response) => {
    const AllLoans = await AllLoansWithActiveRepaymentService()

    res.status(200).json(new ApiSuccess(AllLoans, "Loans"))
}