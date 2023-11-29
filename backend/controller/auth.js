import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export const register = async (req, res, next) => {
    // Input validation middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            name: req.body.name,
            username: req.body.username.toLowerCase(), // Convert to lowercase
            email: req.body.email,
            password: hash,
        });

        await newUser.save();
        res.status(200).send({message: "User has been created.", details: { newUser }} );
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res) => {

    

    // Input validation middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { username, email, password } = req.body;

        // Validate that either username or email is provided, not both
        if (!((username && !email) || (!username && email))) {
            return res.status(400).json({ success: false, message: "Provide either username or email, not both." });
          }

        // Check if the user exists based on the provided username or email
        const user = await User.findOne({
            $or: [
                { username: username ? username.toLowerCase() : null },
                { email: email ? email.toLowerCase() : null }
            ]
            
        });

        if (!user) {
            return res.status(404).send({ success: false, message: "Username or email is incorrect" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(404).send({ success: false, message: "Password is incorrect" });
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET
        );

        const { password: userPassword, isAdmin, ...otherDetails } = user._doc;

        res.cookie("access_token", token, {
            httpOnly: true,
            // maxAge set to null or omitted for a session cookie
        });

        res.status(200).send({ details: { ...otherDetails }});
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
};