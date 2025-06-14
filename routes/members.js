const express = require('express');
const router = express.Router();
const membersController = require('../controllers/members');
const validation = require('../middleware/validate');
const { isAuthenticated }= require('../middleware/authenticate')

router.get('/', membersController.getAll);

router.get('/:id', membersController.getSingle);

router.post('/', validation.saveMember, isAuthenticated,  membersController.createMember)
router.put('/:id', validation.saveMember, isAuthenticated,  membersController.updateMember);
router.delete('/:id', isAuthenticated, membersController.deleteMember);

module.exports = router;
