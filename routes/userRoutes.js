const express = require('express');
const router = express.Router();
const { createUser, getUsers, login, updateUser, deleteUser, getUserById } = require('../controllers/userControllers');


router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/login', login);
router.put('/:id', updateUser); 
router.delete('/:id', deleteUser); 

module.exports = router;
