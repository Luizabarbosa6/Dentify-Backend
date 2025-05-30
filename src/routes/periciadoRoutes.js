const express = require('express');
const router = express.Router();
const controller = require('../controllers/periciadoController');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

/**
 * @swagger
 * tags:
 *   name: Periciados
 *   description: Gerenciamento de pessoas periciadas
 */

/**
 * @swagger
 * /api/periciado:
 *   post:
 *     summary: Cria um novo periciado
 *     tags: [Periciados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeCompleto:
 *                 type: string
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *               sexo:
 *                 type: string
 *                 enum: [Masculino, Feminino, Outro]
 *               documentoIdentificacao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Periciado criado com sucesso
 */
router.post('/', authGuard, roleGuard('perito'), controller.createPericiado);

/**
 * @swagger
 * /api/periciado/{id}:
 *   put:
 *     summary: Atualiza um periciado
 *     tags: [Periciados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               nomeCompleto:
 *                 type: string
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *               sexo:
 *                 type: string
 *                 enum: [Masculino, Feminino, Outro]
 *               documentoIdentificacao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Periciado atualizado com sucesso
 */
router.put('/:id', authGuard, roleGuard('perito'), controller.updatePericiado);

/**
 * @swagger
 * /api/periciado/{id}:
 *   delete:
 *     summary: Remove um periciado
 *     tags: [Periciados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Periciado removido com sucesso
 */
router.delete('/:id', authGuard, roleGuard('perito'), controller.deletePericiado);

/**
 * @swagger
 * /api/periciado:
 *   get:
 *     summary: Lista todos os periciados
 *     tags: [Periciados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de periciados retornada com sucesso
 */
router.get('/', authGuard, controller.getPericiado);

/**
 * @swagger
 * /api/periciado/{id}:
 *   get:
 *     summary: Obtém detalhes de um periciado
 *     tags: [Periciados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do periciado retornados com sucesso
 */
router.get('/:id', authGuard, controller.getPericiadoById);

/**
 * @swagger
 * /api/periciado/por-case/{caseId}:
 *   get:
 *     summary: Lista periciados por ID do caso (caseId)
 *     tags: [Periciados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de periciados retornada com sucesso
 */
router.get('/por-caso/:caseId', authGuard, controller.getPericiadosByCaseId);


module.exports = router;