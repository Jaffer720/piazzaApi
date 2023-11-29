import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js"
import reactionRoute from "./routes/reactionRoute.js";


const app = express();
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS);
        console.log("Connected to mongoDB.");
    } catch {
        console.log("Connection Error");
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});

//middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());


//Routes
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/reaction", reactionRoute);


app.listen(process.env.PORT, () => {
    connect();
    console.log(`server listen on port ${process.env.PORT}`);
    console.log("Connected to backend.");
});
