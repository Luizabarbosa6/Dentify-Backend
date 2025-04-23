const express = require('express');
const router = express.Router();
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

const { createUser, getUsers, login, updateUser, deleteUser, getUserById } = require('../controllers/userControllers');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários e autenticação
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Realiza login e retorna token JWT
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpf:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post('/login', login);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cria um novo usuário (admin apenas)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cpf
 *               - email
 *               - password
 *               - confirmarSenha
 *             properties:
 *               name:
 *                 type: string
 *               cpf:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmarSenha:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, perito, assistente]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post('/', authGuard, roleGuard('admin'), createUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos os usuários (admin e perito)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', authGuard, roleGuard('admin'), getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Busca um usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do usuário
 */
router.get('/:id', authGuard, getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cpf:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmarSenha:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, perito, assistente]
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 */
router.put('/:id', authGuard, updateUser); 

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove um usuário (admin apenas)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 */
router.delete('/:id', authGuard, roleGuard('admin'), deleteUser);

  
module.exports = router;
