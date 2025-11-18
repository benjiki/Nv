import Joi from "joi";

export const createAccountHolderSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Name is required",
        "any.required": "Name is required"
    }),
    accountNumber: Joi.string().required().messages({
        "string.empty": "Account Number is required",
        "any.required": "Account Number is required"
    })
}).unknown(false)

export const updateAccountHolderSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Name is required",
        "any.required": "Name is required"
    }),
    accountNumber: Joi.string().required().messages({
        "string.empty": "Account Number is required",
        "any.required": "Account Number is required"
    })

}).unknown(false)

export const accountHolderParamSchema = Joi.object({
    id: Joi.number().integer().required().messages({
        "any.required": "ID is required",
        "number.base": "ID must be a number",
    }),
}).unknown(false);

export const accountHolderQueryFiltterSchema = Joi.object({
    name: Joi.string(),
    accountNumber: Joi.string(),
    page: Joi.number(),
    limit: Joi.number()
}).unknown(false);
