import express, { response } from "express";
import { config } from '../config.js';
import pkg from 'google-auth-library';
const { google } = pkg;
import { OAuth2Client } from "google-auth-library";

const router = express.Router();

router.post('/', (req, res) => {
    res.header("Access-Control-Allow-Origin");
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Referrer-Policy", "no-referrer-when-downgrade");

    const oAuth2Client = new OAuth2Client(
        config.google.clientId,
        config.google.clientSecret,
        config.google.redirectUri

    );
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile  openid ',
        prompt: 'consent'
    });

    res.json({ url: authorizeUrl })
});




export default router;