import { prisma } from "../prismaClient.js"
import { ApiError, ApiSuccess } from "../utils/ApiError.js"
import { createAccountHolderSchema, updateAccountHolderSchema, accountHolderParamSchema, accountHolderQueryFiltterSchema } from "../validations/accountHolder.validation.js"
import { Request, Response } from "express"
import * as AccountService from "../services/acountHolder.service.js"
import { io } from "../index.js";

export const accountholderCreate = async (req: Request, res: Response) => {
    const { error, value } = createAccountHolderSchema.validate(req.body, {
        abortEarly: false
    })
    if (error) {
        const messages = error.details.map((err) => err.message);
        throw new ApiError(400, messages.join(", "));
    }
    const accountHolder = await AccountService.accountHolderCreateService(value)
    io.emit("accountHoldersUpdated");
    res.status(201).json(new ApiSuccess(accountHolder, "Account holder created successfully"));
}

export const accountholderUpdate = async (req: Request, res: Response) => {
    // Validate the body and the params
    const { error: bodyError, value: bodyValue } = updateAccountHolderSchema.validate(req.body);
    const { error: paramError, value: paramValue } = accountHolderParamSchema.validate(req.params);

    // If there's an error in the request body or params, return an error response
    if (bodyError || paramError) {
        const messages = [
            ...(bodyError?.details.map((err) => err.message) || []),
            ...(paramError?.details.map((err) => err.message) || [])
        ];
        return res.status(400).json({
            error: messages.join(", "),
        });
    }

    const accountHolder = await AccountService.accountHolderUpdateService({
        id: paramValue.id,
        ...bodyValue
    });
    io.emit("accountHoldersUpdated");
    res.status(201).json(new ApiSuccess(accountHolder, "Account holder updated successfully"));

}

export const getAllAccountHoldersController = async (req: Request, res: Response) => {
    const { error: paramError, value: paramValue } = accountHolderQueryFiltterSchema.validate(req.query);

    // If there's an error in the request body or params, return an error response
    if (paramError) {
        const messages = [
            ...(paramError?.details.map((err) => err.message) || [])
        ];
        return res.status(400).json({
            error: messages.join(", "),
        });
    }


    const accountHolders = await AccountService.getAllAccountHoldersService({ ...paramValue })

    res.status(200).json(new ApiSuccess(accountHolders))
}

export const getAccountHolderController = async (req: Request, res: Response) => {
    const { error: paramError, value: paramValue } = accountHolderParamSchema.validate(req.params);

    if (paramError) {
        const messages = [
            ...(paramError?.details.map((err) => err.message) || [])
        ];
        return res.status(400).json({
            error: messages.join(", "),
        });
    }

    const accountHolder = await AccountService.getAccountHolderService({ id: paramValue.id })

    res.status(200).json(new ApiSuccess(accountHolder))
}

