import express from "express";
import createError from "http-errors";
import Flashcard from "../models/Flashcard.js";
import User from "../models/User.js";
import Category from "../models/Category.js";

const categoryRouter = express.Router()

categoryRouter 
    .get("/", async (req, res, next) => {
        try{
            // TODO: middleware: If user is logged in, continue...

            const categories = Category.find({});
            categories.select("-__v");
            categories.populate("author", "username");
            categories.populate("flashcards", "front back");

            const categoriesAfterPopulation = await categories.exec()
            res.send({categoriesAfterPopulation})

        } catch (error){
            next(createError(400, error.message))
        }
    })
    .post("/", async (req,res, next) => {
        try {
            const author = await User.findById(req.userData.userId)
            if(!author) {
                return next(createError(404, "There is no such a user!"))
            }

            const createCategory = await Category.create({author: req.userData.userId , header: req.body.header});
            author.categories.push(createCategory._id)
            await author.save()

            res.send({ createCategory })

        } catch (error) {
            next(createError(400, error.message))
        }
    })
    .patch("/:id", async (req,res,next) => {
        try {
            // ? is it needed?
            // const author = await User.findById(req.body.author)
            // if(!author) {
            //     return next(createError(404, "Please log in!"))
            // }

            const queryOptions = { new: true, runValidators: true }
            const updateCategory = await Category.findByIdAndUpdate(req.params.id, req.body, queryOptions)

            res.send({updateCategory})
        } catch (error){
            next(createError(400, error.message))
        }
    })
    .delete("/:id", async (req, res, next) => {
        try {
            // const author = await User.findById(req.body.author)
            // if(!author) {
            //     return next(createError(404, "Please log in!"))
            // }
            const category = await Category.findById(req.params.id)
            await category.remove()

            res.send({ok: true, deleted: category})
        } catch (error){
            next(createError(400, error.message))
        }
    })

export default categoryRouter;
