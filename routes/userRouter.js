import express from "express";
import createError from "http-errors";
import User from "../models/User.js";
import { hash } from "bcrypt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validateLogin from "../lib/validateLogin.js"

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

    // registration
    .post("/register", validateLogin() , async (req,res, next) => {
    try {
            
        req.body.password = await hash(req.body.password, 10)
        const createUser = await User.create(req.body)

        res.send({ createUser })
    } catch (error) {
        next(createError(400, error.message))
    }
    })

    // login
    .post("/login", async (req,res, next) => {
        const { email, password } = req.body
        console.log("email from login:", email);
        console.log("password from login:", password);
        try {
            const findUserWithSameEmail = await User.findOne({ email })
            await bcrypt.compare(findUserWithSameEmail.password, password)

            // ! It doesn't check when a password is wrong
            // if (findUserWithSameEmail.password != password) {
            //     console.log("not same password");
            //     return next(createError(400, "Wrong password, please try again"))
            // }

            console.log("hash:",findUserWithSameEmail.password);

            // TODO: make the token expire when the user logs out instead for after 1h.
            // * create token
            const payload = { userId: findUserWithSameEmail._id }
            const options = { expiresIn: "300m" }
            const token = jwt.sign(payload, process.env.SECRET, options)

            // ? Question: why do we need spread operator? why to json?
            res.send({ ...findUserWithSameEmail.toJSON(), token })
            console.log("registration successful");
        } catch (error) {
            next(createError(400, error.message))
        }
    })


    .delete("/:id", async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id)
            await user.remove()
            res.send({ok: true, deleted: user})
        } catch (error){
            next(createError(400, error.message))
        }
    })

export default userRouter