const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const Book = require("./models/bookModel.js");
const { CURSOR_FLAGS } = require("mongodb");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.get("/", (req, res) => {
    console.log(req);
    return res.status(234).send('Welcome to the Store');
});

const createNewBook = async (newBook) => {
    try {
        const book = await Book.create(newBook);
        console.log('Book created:', book);
    } catch (error) {
        console.error('Error creating book:', error);
    }
};

app.post("/books", (req, res) => {
    try{
        if(
            !req.body.title ||
            !req.body.author ||
            !req.body.publishYear
        ){
            return res.status(400).send({
                message: "Send all required fields: title, author, publishYear"
            });
        }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear
        };
        createNewBook(newBook);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send({message: error.message});
    }
})

app.get('/books', async (req, res) => {
    try{
        const books = await Book.find({});

        return res.status(200).json({
            count: books.length,
            data: books
        });
    }
    catch(error){
        console.log(error.message);
        res.status(500).send({ message: error.message});
    }
});

app.get('/books/:id', async (req, res) => {
    try{

        const {id} = req.params
        const book = await Book.findById(id);

        return res.status(200).json(book);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send({ message: error.message});
    }
});

app.put("/books/:id", async (req,res) => {
    try{
        if(
            !req.body.title ||
            !req.body.author ||
            !req.body.publishYear
        ){
            return res.status(400).send({
                message: "Send all required fields: title, author, publishYear"
            });
        }
        const {id} = req.params;
        const result = await Book.findByIdAndUpdate(id, req.body);

        if(!result){
            return res.status(404).json({message: "Book not Found"});
        }
        return res.status(200).send({message: "Book Updated Successfully"});
    }
    catch(error){
        console.log(error.message);
        res.status(500).send({message: error.message});
    }
});

app.delete("/books/:id" , async (req, res) => {
    try{
        const {id} = req.params;

        const result = await Book.findByIdAndDelete(id);

        if(!result){
            return res.status(404).json({message: "Book not found"});
        }
        return res.status(200).send({message: "Book Deleted Successfully"});
    } 
    catch(error){
        console.log(error.message);
        res.status(500).send({message: error.message});
    }
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("App connected Successfully");
        app.listen(process.env.PORT || 5555, () => {
            console.log(`Your app is listening on port ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    });
