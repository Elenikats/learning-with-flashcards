import mongoose from "mongoose";
import Flashcard from "./Flashcard.js";
import Category from "./Category.js"

const { Schema, model } = mongoose;
const timestamps = true
const required = true
const unique = true
const trim = true

const userSchema = new Schema({
    username:       { type: String, required, trim, unique },
    email:          { type: String, required, trim, unique },
    password:       { type: String, required },
    flashcards:     { type: [Schema.Types.ObjectId], ref: "flashcard" }  
}, { timestamps })

// This middleware function will run before a document is deleted, when someone calls "doc.remove()".
// By default, like now it will NOT run when someone calls "User.remove()"
userSchema.pre("remove", async function() {
    console.log("User is being removed" + this._id);
    await Flashcard.deleteMany({ author: this.id })
    await Category.deleteMany({ user: this._id })
})

const User = model("user", userSchema);
export default User;