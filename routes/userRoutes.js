const express = require('express');
const router = express.Router();
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

const { createUser, getUsers, login, updateUser, deleteUser, getUserById } = require('../controllers/userControllers');


router.post('/login', login);
router.post('/', authGuard, roleGuard('admin'), createUser);
router.get('/', authGuard, roleGuard('admin', 'perito'), getUsers);
router.get('/:id', authGuard, getUserById);
router.put('/:id', authGuard, updateUser); 
router.delete('/:id', authGuard, roleGuard('admin'), deleteUser);

  
module.exports = router;
