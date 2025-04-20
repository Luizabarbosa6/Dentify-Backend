const express = require('express');
const router = express.Router();
const controller = require('../controllers/casesController');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

/**
 * @swagger
 * tags:
 *   name: Casos
 *   description: Gerenciamento de Casos Odonto-legais
 */

/**
 * @swagger
 * /cases:
 *   post:
 *     summary: Cria um novo caso
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Em andamento, Finalizado, Arquivado]
 *               dataAbertura:
 *                 type: string
 *                 format: date
 *               sexo:
 *                 type: string
 *                 enum: [Masculino, Feminino, Outro]
 *               local:
 *                 type: string
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 */
router.post('/', authGuard, roleGuard('perito'), controller.createCase);

/**
 * @swagger
 * /cases/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um caso
 *     tags: [Casos]
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
 *               status:
 *                 type: string
 *                 enum: [Em andamento, Finalizado, Arquivado]
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 */
router.patch('/:id/status', authGuard, roleGuard('perito'), controller.updateStatus);

 /**
 * @swagger
 * /cases/{id}:
 *   put:
 *     summary: Atualiza um caso
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Aberto, Em andamento, Finalizado, Arquivado]
 *               dataAbertura:
 *                 type: string
 *                 format: date
 *               sexo:
 *                 type: string
 *                 enum: [Masculino, Feminino, Outro]
 *               local:
 *                 type: string
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 */
router.put('/:id', authGuard, roleGuard('perito'), controller.updateCase);

/**
 * @swagger
 * /cases/{id}:
 *   delete:
 *     summary: Deleta um caso
 *     tags: [Casos]
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
 *         description: Caso deletado com sucesso
 */
router.delete('/:id', authGuard, roleGuard('perito'), controller.deleteCase);

/**
 * @swagger
 * /cases:
 *   get:
 *     summary: Lista todos os casos
 *     tags: [Casos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de casos retornada com sucesso
 */
router.get('/', authGuard, controller.listCases);

/**
 * @swagger
 * /cases/{id}:
 *   get:
 *     summary: Detalha um caso específico
 *     tags: [Casos]
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
 *         description: Detalhes do caso retornados com sucesso
 */
router.get('/:id', authGuard, controller.getCaseDetail);

module.exports = router;
