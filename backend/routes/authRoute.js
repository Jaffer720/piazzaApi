import express from "express";
import { login, register } from "../controller/auth.js";
import { loginValidation, registerValidation } from "../utils/validator.js";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

export default router