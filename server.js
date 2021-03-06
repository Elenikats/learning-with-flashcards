import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "./lib/database.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import flashcardRouter from "./routes/flashcardRouter.js";
import userRouter from "./routes/userRouter.js"
import categoryRouter from "./routes/categoryRouter.js"
import checkToken from "./middlewares/checkToken.js"

dotenv.config()
connect();
const app = express();
app.use(cors());
app.use(express.json());

// router endpoints
app.use("/users", userRouter)
app.use("/categories", checkToken, categoryRouter)
app.use("/flashcards", checkToken, flashcardRouter)




app.use((req,res, next) => next({ status: 404, message: "Resource not found!" }));
app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Listening at: http://localhost:${process.env.PORT}`);
})
















// ! When there is an expired JSONWEBTOKEN or a wrong one the server crashes


