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
    categories:     { type: [Schema.Types.ObjectId], ref: "category" }  
}, { timestamps})


userSchema.pre("remove", function() {
    console.log("hiiii");
    console.log("User is being removed", this);
    const query = Category.deleteMany({ author: this._id })
    query.exec()
        .then(console.log)
})

const User = model("user", userSchema);
export default User;