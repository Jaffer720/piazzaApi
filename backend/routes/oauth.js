import express, { response } from "express";
import { config } from '../config.js';
import pkg from 'google-auth-library';
const { google } = pkg;
import { OAuth2Client } from "google-auth-library";


const router = express.Router();

async function getUserData(access_token) {

    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);

    //console.log('response',response);
    const data = await response.json();
    console.log('data', data);
    
}

router.get('/', async (req, res) => {
    console.log("I am here")
    try {
        const code = req.query.code;
        // const googleClient = new OAuth2Client(config.google.clientId, config.google.clientSecret, config.google.redirectUri);
        const oAuth2Client = new OAuth2Client(
            config.google.clientId,
            config.google.clientSecret,
            config.google.redirectUri

        );
        // Exchange the authorization code for tokens
        const r = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(r.tokens);
        console.info('Tokens acquired.');
        const user = oAuth2Client.credentials;
        console.log('credentials', user);
        await getUserData(oAuth2Client.credentials.access_token);
        res.status(200).send({message:"authentication Successfull"});
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

export default router;