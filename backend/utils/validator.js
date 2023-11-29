import { check } from "express-validator";
import User from "../models/User.js";


// Validation middleware for register route
export const registerValidation = [
    check("username")
        .notEmpty().withMessage("Username is required")
        .isLowercase().withMessage("Username should be in lowercase")
        .custom(async (value) => {
            const existingUser = await User.findOne({ username: value });
            if (existingUser) {
                return Promise.reject("Username is already in use");
            }
        }),
    check("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .custom(async (value) => {
            const existingEmail = await User.findOne({ email: value });
            if (existingEmail) {
                return Promise.reject("email is already in use");
            }
        }),
    check("password").notEmpty().withMessage("Password is required"),
];

// Validation middleware for login route
export const loginValidation = [
    check("username").optional()
        .notEmpty().withMessage("Username is required")
        .isAlphanumeric().withMessage("Username can only contain letters and numbers")
        .isLowercase().withMessage("Username should be in lowercase"),
    check("email").optional()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    check("password").notEmpty().withMessage("Password is required"),
];