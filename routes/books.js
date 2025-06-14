const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');
const validation = require('../middleware/validate');
const auth = require('../middleware/authenticate')

router.get('/', booksController.getAllBooks);

router.get('/:id', booksController.getSingleBook);

router.post('/', validation.saveBook, auth.isAuthenticated, booksController.createBook)
router.put('/:id', validation.saveBook, auth.isAuthenticated, booksController.updateBook);
router.delete('/:id', auth.isAuthenticated, booksController.deleteBook);

module.exports = router;
