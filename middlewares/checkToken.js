import dotenv from "dotenv"
import createError from "http-errors";
import jwt from "jsonwebtoken"
import User from "../models/User"

dotenv.config()

// This middleware can be used to check if a request contains a valid token
const checkToken = (req, res, next) => {
    const tokenRaw = req.headers.authorization
    console.log(`TokenRaw is: ${tokenRaw}`);
    if (!tokenRaw) {
        next(createError(401, error.message))
    }

    const tokenToCheck = tokenRaw.split(" ")[1]
    console.log(`Token to check is: ${tokenToCheck}`);
    if (!tokenToCheck) {
        next(createError(401, error.message))
    }

    const secret = process.env.SECRET 
    // payload is the object we assigned to it when we created the token

    // * VERIFICATION OF JWT
    jwt.verify(tokenToCheck, secret, (error, payload) => {
        console.log({ error, payload });
        if (error) {
            next(createError(401, error.message))
        }

        // JWT:
        // aaaaa.bbbbbb.ccccc
        // Header.Payload.Signature(made by the secret)

        User.findById(payload.userId)
            .then(user => {
                req.userData = {
                    userId: user._id,
                    username: user.username,
                    email: user.email
                }
                next()
            })
            .catch (error => {
                return res.status(400).send(error.message)
            })
    })
}

export default checkToken;