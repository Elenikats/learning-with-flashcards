import { body, validationResult } from "express-validator"

const validateLogin = (req,res,next) => {
    body("username").isLength({ min: 3}).withMessage("invalid-name"),
    body("email").isEmail().withMessage("invalid-email"),
    body("password").isLength({ min: 8 }).withMessage("password-too_short")
}

export default validateLogin