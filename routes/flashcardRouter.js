import express from "express";
import createError from "http-errors";
import Flashcard from "../models/Flashcard.js";
import User from "../models/User.js";
import Category from "../models/Category.js";

const flashcardRouter = express.Router()

flashcardRouter 
    .get("/", async (req, res, next) => {
        try{
            // TODO: middleware: If user is logged in, continue...

            const flashcards = Flashcard.find({});
            flashcards.select("-__v");
            flashcards.populate("category", "header");
            const flashcardsAfterPopulation = await flashcards.exec();
            res.send({flashcardsAfterPopulation});   

        } catch (error){
            next(createError(400, error.message))
        }
    })
    .post("/", async (req,res, next) => {
        try {
            const category = await Category.findById(req.body.category)

            // ? DO I NEED THIS? the category is required so probably not necessary.
            if(!category) {
                return next(createError(404, "Please create a category first!"))
            }

            const createFlashcard = await Flashcard.create(req.body);
            category.flashcards.push(createFlashcard._id)
            await category.save()

            res.send({ createFlashcard })

        } catch (error) {
            next(createError(400, error.message))
        }
    })
    .patch("/:id", async (req,res,next) => {
        try {
            // const author = await User.findById(req.body.author)
            // if(!author) {
            //     return next(createError(404, "Please log in!"))
            // }

            const queryOptions = { new: true, runValidators: true }
            const updateFlashcard = await Flashcard.findByIdAndUpdate(req.params.id, req.body, queryOptions)

            res.send({updated: updateFlashcard})
        } catch (error) {
            next(createError(400, error.message))
        }
    })
    .delete("/:id", async (req, res, next) => {
        try {
            // const author = await User.findById(req.body.author)
            // if(!author) {
            //     return next(createError(404, "Please log in!"))
            // }

            const flashcard = await Flashcard.findById(req.params.id)
            await flashcard.remove()
            res.send({ok: true, deleted: flashcard})
        } catch (error){
            next(createError(400, error.message))
        }
    })

export default flashcardRouter;
