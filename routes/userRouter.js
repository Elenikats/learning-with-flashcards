import express from "express";
import createError from "http-errors";
import User from "../models/User.js";

const userRouter = express.Router();

userRouter
    .get("/", async (req,res, next) => {
        try {
           const users = await User.find({})
           res.send({ users })
        } catch (error){
            next(createError(400, error.message))
        }
    })

export default userRouter