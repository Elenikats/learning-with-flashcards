import mongoose from "mongoose";
import User from "./User.js";

const { Schema, model } = mongoose
const timestamps = true;
const required = true;
const unique = true;
const trim = true;

const flashcardSchema = new Schema({
    category:   { type: Schema.Types.ObjectId, ref: "category", required },
    front:      { type: String, required, trim, unique },
    back:       { type: String, required, trim },
}, { timestamps })

const Flashcard = model("flashcard", flashcardSchema);

export default Flashcard;