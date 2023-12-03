import express, { response } from "express";
import { config } from '../config.js';
import pkg from 'google-auth-library';
const { google } = pkg;
import User from "../models/User.js"
import { OAuth2Client } from "google-auth-library";
import { login, register } from "../controller/auth.js";
import { loginValidation, registerValidation } from "../utils/validator.js";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);


router.post('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Referrer-Policy", "no-referrer-when-downgrade");

    const oAuth2Client = new OAuth2Client(
        config.google.clientId,
        config.google.clientSecret,
        config.google.redirectUri

    );
    // const url = `https://accounts.google.com/o/oauth2/auth?client_id=${config.google.clientId}&redirect_uri=${config.google.redirectUri}&response_type=code&scope=openid%20profile%20email`;
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile  openid ',
        prompt: 'consent'
    });

    res.json({ url: authorizeUrl })
    console.log(authorizeUrl)
});




export default router;