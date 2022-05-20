import express from "express";
import createError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv"

const loginRouter = express.Router();
dotenv.config()

loginRouter 
    .post("/", async (req,res, next) => {
        const { username, password } = req.body
        console.log("username from login:", username);
        console.log("password from login:", password);
        try {
            const findUserWithSameUsername = await User.findOne({ username })
            await bcrypt.compare(findUserWithSameUsername.password, password)

            console.log("hash:",findUserWithSameUsername.password);

            // TODO: make the token expire when the user logs out
            // * create token
            const payload = { userId: findUserWithSameUsername._id }
            const options = { expiresIn: "60m" }
            const token = jwt.sign(payload, process.env.SECRET, options)

            // ? Question: why do we need spread operator? why to json?
            res.send({ ...findUserWithSameUsername.toJSON(), token })
            console.log("registration successful");
        } catch (error) {
            next(createError(400, error.message))
        }
    })

export default loginRouter;