// apps/auth-service/src/validations/auth.validations.ts
import Joi from "joi";

export const registerValidationSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits.",
      "string.empty": "Phone number is required.",
      "any.required": "Phone number is required.",
    }),

  role: Joi.string().valid("Customer", "Admin").optional().messages({
    "any.only": 'Role must be either "Customer" or "Admin".',
    "string.base": "Role must be a string.",
  }),

  accountStatus: Joi.boolean().optional().messages({
    "boolean.base": "Account status must be true or false.",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
}).unknown(false); // Optional: Reject unknown fields

// login validation

// apps/auth-service/src/validations/auth.validations.ts

export const loginValidationSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits.",
      "string.empty": "Phone number is required.",
      "any.required": "Phone number is required.",
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
}).unknown(false); // Optional: Reject unknown fields
