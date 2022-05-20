import mongoose from "mongoose";
import User from "./User.js";
import Flashcard from "./Flashcard.js";

const { Schema, model } = mongoose
const timestamps = true;
const required = true;
const unique = true;
const trim = true;

const categorySchema = new Schema({
    header:      { type: String, required, trim, unique },
    user:        { type: Schema.Types.ObjectId, ref: "user", required },
    flashcards:  { type: Schema.Types.ObjectId, ref: "flashcard"},
}, { timestamps })

const Category = model("category", categorySchema);

export default Category;