const express = require('express');
const router = express.Router();
const { createUser, getUsers, login, updateUser, deleteUser, getUserById } = require('../controllers/userControllers');

// Rotas de usuários
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/login', login);
router.put('/:id', updateUser); // Rota para atualizar usuário
router.delete('/:id', deleteUser); // Rota para deletar usuário

module.exports = router;
