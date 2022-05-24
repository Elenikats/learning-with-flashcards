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
    author:      { type: Schema.Types.ObjectId, ref: "user", required },
    flashcards:  { type: [Schema.Types.ObjectId], ref: "flashcard"},
}, { timestamps })


categorySchema.pre("remove", async function() {
    console.log("hi there i am deleting ");
    console.log("Category is being removed" + this._id);

    // We filter out the category that is being deleted by the user.categories
    const user = await User.findById(this.author);
    if (user) {
        user.categories = user.categories.filter(category => category.toString() !== this._id.toString())
        await user.save()
    }
    
    // Flashcards are being deleted when this category is being deleted
    await Flashcard.deleteMany({ category: this._id })
})

const Category = model("category", categorySchema);

export default Category;