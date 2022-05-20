import express from "express";
import createError from "http-errors";
import Flashcard from "../models/Flashcard.js";
import User from "../models/User.js";

const flashcardRouter = express.Router()

flashcardRouter 
    .get("/", async (req, res, next) => {
        try{
            // TODO: middleware: If user is logged in, continue...

            const flashcards = await Flashcard.find({});
            res.send({flashcards});   

        } catch (error){
            next(createError(400, error.message))
        }
    })
    .post("/", async (req,res, next) => {
        try {
            const author = await User.findById(req.body.author)
            if(!author) {
                return next(createError(404, "Please log in!"))
            }

            const createFlashcard = await Flashcard.create(req.body);

            res.send({createFlashcard})

        } catch (error) {
            next(createError(400, error.message))
        }
    })
    .patch("/:id", async (req,res,next) => {
        try {
            const author = await User.findById(req.body.author)
            if(!author) {
                return next(createError(404, "Please log in!"))
            }

            const queryOptions = { new: true, runValidators: true }
            const updateFlashcard = Flashcard.findByIdAndUpdate(req.params.id, req.body, queryOptions)

            res.send({updateFlashcard})
        } catch (error){
            next(createError(400, error.message))
        }
    })
    .delete("/id", async (req, res, next) => {
        try {
            const author = await User.findById(req.body.author)
            if(!author) {
                return next(createError(404, "Please log in!"))
            }

            const removeFlashcard = await Flashcard.findByIdAndDelete(req.params.id)
            res.send({removeFlashcard})
        } catch (error){
            next(createError(400, error.message))
        }
    })

export default flashcardRouter;
