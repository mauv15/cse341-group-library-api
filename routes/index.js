
const express = require('express');
const passport = require('passport');

const router = express.Router();

router.use('/', require('./swagger'));
router.use('/users', require('./users'));
router.use('/members', require('./members'));
router.use('/books', require('./books'));
router.use('/movies', require('./movies'));

module.exports = router;
