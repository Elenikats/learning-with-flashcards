import { body, validationResult } from "express-validator"

function validateLogin() {
        const arrayOfMiddlewares = [
                body("username").isLength({ min: 3}).withMessage("invalid-name"),
                body("email").isEmail().withMessage("invalid-email"),
                body("password").isLength({ min: 8 }).withMessage("password-too_short"),
                (req,res,next) => {
                        const errors = validationResult(req);
                        console.log(errors.isEmpty());
                        if (!errors.isEmpty()) {
                            return res.status(400).json({ errors: errors.array() })
                        } 
                        next()
                }
        ]
        return arrayOfMiddlewares
   
}

export default validateLogin;