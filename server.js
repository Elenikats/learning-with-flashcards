import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "./lib/database.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import flashcardRouter from "./routes/flashcardRouter.js";
import registerRouter from "./routes/registerRouter.js";
import loginRouter from "./routes/loginRouter.js";

dotenv.config()
connect();
const app = express();
app.use(cors());
app.use(express.json());

// router endpoints
app.use("/register", registerRouter)
app.use("/login", loginRouter)
app.use("/flashcards", flashcardRouter)

app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Listening at: http://localhost:${process.env.PORT}`);
})