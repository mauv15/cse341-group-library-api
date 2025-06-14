const mongodb = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;

const getAllMovies = async (req, res) => {
    //#swagger.tags=['movies']
    try {
        const movies = await mongodb.getDb().db().collection('movies').find().toArray();
        res.setHeader('Content-Type', 'application/JSON');
        res.status(200).json(movies);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getSingleMovie = async (req, res) => {
    //#swagger.tags=['movies']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json('Must use a valid id to find a movie');
        }
        const movieId = new ObjectId(req.params.id);
        const movie = await mongodb.getDb().db().collection('movies').findOne({ _id: movieId });
        if (!movie) {
            return res.status(404).json({ message: 'movie not found' });
        }
        res.setHeader('Content-Type', 'application/JSON');
        res.status(200).json(movie);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const createMovie = async (req, res) => {
    //#swagger.tags=['movies']
    try {
        const movie = {
            ISBN: req.body.ISBN,
            title: req.body.title,
            director: req.body.director,
            year: req.body.year,
            genre: req.body.genre,
            distributor: req.body.distrubitor,
            userRating: req.body.userRating
        };
        const response = await mongodb.getDb().db().collection('movies').insertOne(movie);
        if (response.acknowledged) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occured while creating the movie');
        };
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateMovie = async (req, res) => {
    //#swagger.tags=['movies']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid id to update a movie');
        };
        const movieId = new ObjectId(req.params.id);
        const movie = {
            ISBN: req.body.ISBN,
            title: req.body.title,
            director: req.body.director,
            year: req.body.year,
            genre: req.body.genre,
            distributor: req.body.distrubitor,
            userRating: req.body.userRating
        };
        const response = await mongodb.getDb().db().collection('movies').replaceOne({ _id: movieId }, movie);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occured while updating the movie');
        };
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteMovie = async (req, res) => {
    //#swagger.tags=['movies']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid id to delete movie');
        };
        const movieId = new ObjectId(req.params.id);
        const response = await mongodb.getDb().db().collection('movies').deleteOne({ _id: movieId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occured while deleting the movie');
        };
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = { getAllMovies, getSingleMovie, createMovie, updateMovie, deleteMovie };
