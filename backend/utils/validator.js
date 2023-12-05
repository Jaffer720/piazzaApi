import { check, body } from "express-validator";
import User from "../models/User.js";



// Validation middleware for Post route
export const createPostValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('topics').isArray().withMessage('Topics must be an array'),
    body('body').trim().notEmpty().withMessage('Body is required'),
    body('expirationTime').optional().isISO8601().withMessage('Invalid expirationTime format'),
];