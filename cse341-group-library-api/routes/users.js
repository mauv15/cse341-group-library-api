const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const validation = require('../middleware/validate');
const { isAuthenticated }= require('../middleware/authenticate')

router.get('/', usersController.getAll);

router.get('/:id', usersController.getSingle);

router.post('/', validation.saveUser, isAuthenticated, usersController.createUser)
router.put('/:id', validation.saveUser, isAuthenticated, usersController.updateUser);
router.delete('/:id', isAuthenticated, usersController.deleteUser);

module.exports = router;
