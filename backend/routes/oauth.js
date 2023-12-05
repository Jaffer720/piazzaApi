import express, { response } from "express";
import User from '../models/User.js';
import { config } from '../config.js';
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import pkg from 'google-auth-library';
const { google } = pkg;
import { OAuth2Client } from "google-auth-library";

dotenv.config();
const router = express.Router();
const jwtSecretKey = process.env.JWT_SECRET;

router.get('/', async (req, res) => {
    try {
        const code = req.query.code;
        const oAuth2Client = new OAuth2Client(
            config.google.clientId,
            config.google.clientSecret,
            config.google.redirectUri,


        );

        const r = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(r.tokens);

        const ticket = await oAuth2Client.verifyIdToken({
            idToken: oAuth2Client.credentials.id_token,
            audience: config.google.clientId,
        });

        const payload = ticket.getPayload();
        const user = await User.findOne({ googleId: payload.sub });

        if (!user) {

            const newUser = new User({
                googleId: payload.sub,
                name: payload.name,

            });

            await newUser.save();
            const accessToken = jwt.sign(
                { userId: newUser._id },
                jwtSecretKey,
            );
            res.cookie("access_token", accessToken, {
                httpOnly: true,
            });
            return res.status(201).send({ message: 'User Registered succecfuly and get token', newUser });
        }
        const accessToken = jwt.sign(
            { userId: user._id },
            jwtSecretKey,
        );
        res.cookie("access_token", accessToken, {
            httpOnly: true,
        });
        res.status(201).send({ message: 'User athenticated succecfuly and get token', user });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

export default router;