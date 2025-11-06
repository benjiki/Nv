import Joi from "joi";

export const depositAccountManagmentSchema = Joi.object({
    userId: Joi.number().required().messages({
        "any.required": "userId is required",
        "number.base": "userId must be a number",
    }),
    amount: Joi.number().required().messages({
        "any.required": "Amount is required",
        "number.base": "Amount must be a number",
    }),
}).unknown(false)



export const loanAccountManagmentSchema = Joi.object({
    lenderId: Joi.number().required().messages({
        "any.required": "lenderId is required",
        "number.base": "lenderId must be a number",
    }),
    borrowerId: Joi.number().required().messages({
        "any.required": "borrowerId is required",
        "number.base": "borrowerId must be a number",
    }),
    amount: Joi.number().required().messages({
        "any.required": "Amount is required",
        "number.base": "Amount must be a number",
    }),
    interestRate: Joi.number().required().messages({
        "any.required": "interestRate is required",
        "number.base": "interestRate must be a number",
    }),
    dueDate: Joi.date().messages({
        'date.base': 'Due date must be a valid date.',
        'date.empty': 'Due date cannot be empty.',
        'any.required': 'Due date is required.',
    }),

}).unknown(false)



export const accountManagmentParamSchema = Joi.object({
    id: Joi.number().integer().required().messages({
        "any.required": "ID is required",
        "number.base": "ID must be a number",
    }),
}).unknown(false);

