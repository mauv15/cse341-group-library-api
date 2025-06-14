const mongodb = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;

const getAllBooks = async (req, res) => {
    //#swagger.tags=['Books']
    try {
        const books = await mongodb.getDb().db().collection('books').find().toArray();
        res.setHeader('Content-Type', 'application/JSON');
        res.status(200).json(books);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getSingleBook = async (req, res) => {
    //#swagger.tags=['Books']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json('Must use a valid id to find a book');
        }
        const bookId = new ObjectId(req.params.id);
        const book = await mongodb.getDb().db().collection('books').findOne({ _id: bookId });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.setHeader('Content-Type', 'application/JSON');
        res.status(200).json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const createBook = async (req, res) => {
    //#swagger.tags=['Books']
    try {
        const book = {
            ISBN: req.body.ISBN,
            Title: req.body.Title,
            Author: req.body.Author,
            publicationYear: req.body.publicationYear,
            Genre: req.body.Genre,
            Pages: req.body.Pages,
            userRating: req.body.userRating
        };
        const response = await mongodb.getDb().db().collection('books').insertOne(book);
        if (response.acknowledged) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occured while creating the book');
        };
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateBook = async (req, res) => {
    //#swagger.tags=['Books']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid id to update a book');
        };
        const bookId = new ObjectId(req.params.id);
        const book = {
            ISBN: req.body.ISBN,
            Title: req.body.Title,
            Author: req.body.Author,
            publicationYear: req.body.publicationYear,
            Genre: req.body.Genre,
            Pages: req.body.Pages,
            userRating: req.body.userRating
        };
        const response = await mongodb.getDb().db().collection('books').replaceOne({ _id: bookId }, book);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occured while updating the book');
        };
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteBook = async (req, res) => {
    //#swagger.tags=['Books']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid id to delete book');
        };
        const bookId = new ObjectId(req.params.id);
        const response = await mongodb.getDb().db().collection('books').deleteOne({ _id: bookId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occured while deleting the book');
        };
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = { getAllBooks, getSingleBook, createBook, updateBook, deleteBook };