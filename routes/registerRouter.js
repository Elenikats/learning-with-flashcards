import { hash } from "bcrypt";
import express from "express";
import createError from "http-errors";
import User from "../models/User.js";

const registerRouter = express.Router();

registerRouter
    .post("/", async (req,res, next) => {
        // TODO: validate the registration, if the data are correct || with Jay 
        try {
            req.body.password = await hash(req.body.password, 10)
            const createUser = await User.create(req.body)

            res.send({ createUser })
        } catch (error){
            next(createError(400, error.message))
        }


        // try {
        //     const newUser = await User.register(req.body)

        //     if (newUser) {
        //         return res.send(newUser)
        //     }
        // } catch (error){
        //     next(createError(400, error.message))
        // }
    })

export default registerRouter