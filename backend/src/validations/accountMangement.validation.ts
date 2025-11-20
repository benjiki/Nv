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


export const transferAccountManagmentSchema = Joi.object({
    senderId: Joi.number().required().messages({
        "any.required": "senderId is required",
        "number.base": "senderId must be a number",
    }),
    receiverId: Joi.number().required().messages({
        "any.required": "receiverId is required",
        "number.base": "receiverId must be a number",
    }),
    amount: Joi.number().required().messages({
        "any.required": "Amount is required",
        "number.base": "Amount must be a number",
    }),
}).unknown(false)


export const repaymentAccountManagmentSchema = Joi.object({
    loanId: Joi.number().required().messages({
        "any.required": "loanId is required",
        "number.base": "loanId must be a number",
    }),
    payerId: Joi.number().required().messages({
        "any.required": "payerId is required",
        "number.base": "payerId must be a number",
    }),
    amount: Joi.number().required().messages({
        "any.required": "Amount is required",
        "number.base": "Amount must be a number",
    }),
}).unknown(false)

export const accountManagmentParamSchema = Joi.object({
    id: Joi.number().integer().required().messages({
        "any.required": "ID is required",
        "number.base": "ID must be a number",
    }),
}).unknown(false);



export const accountManagmentQueryFiltterSchema = Joi.object({
    name: Joi.string(),
    accountNumber: Joi.string(),
    page: Joi.number(),
    limit: Joi.number()
}).unknown(false);