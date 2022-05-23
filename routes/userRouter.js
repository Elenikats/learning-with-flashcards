import express from "express";
import createError from "http-errors";
import User from "../models/User.js";
import { hash } from "bcrypt";
import bcrypt from "bcrypt";
// import { validateLogin } from "../middlewares/validateLogin.js"
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator"

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
    .post("/register",
    // body("username").isLength({ min: 3}).withMessage("invalid-name"),
    // body("email").isEmail().withMessage("invalid-email"),
    // body("password").isLength({ min: 8 }).withMessage("password-too_short"),
    async (req,res, next) => {
    // TODO: validate the registration, if the data are correct | with Jay 
    try {

        req.body.password = await hash(req.body.password, 10)
        const createUser = await User.create(req.body)

        res.send({ createUser })
    } catch (error){
        next(createError(400, error.message))
    }
    })

    // login
    .post("/login", async (req,res, next) => {
        const { username, password } = req.body
        console.log("username from login:", username);
        console.log("password from login:", password);
        try {
            const findUserWithSameUsername = await User.findOne({ username })
            await bcrypt.compare(findUserWithSameUsername.password, password)

            console.log("hash:",findUserWithSameUsername.password);

            // TODO: make the token expire when the user logs out instead for after 1h.
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


    .delete("/:id", async (req, res, next) => {
        try {
            const removeUser= await User.findByIdAndDelete(req.params.id)
            res.send({removeUser})
        } catch (error){
            next(createError(400, error.message))
        }
    })

export default userRouter