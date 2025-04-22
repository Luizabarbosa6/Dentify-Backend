const express = require('express');
const router = express.Router();
const laudosController = require('../controllers/laudosController');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

/**
 * @swagger
 * tags:
 *   name: Laudos
 *   description: Gerenciamento de laudos periciais
 */

/**
 * @swagger
 * /api/laudos:
 *   post:
 *     summary: Cria um novo laudo
 *     tags: [Laudos]
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
 *               texto:
 *                 type: string
 *               evidence:
 *                 type: string
 *                 description: ID da evidência relacionada
 *               peritoResponsavel:
 *                 type: string
 *                 description: ID do perito responsável
 *     responses:
 *       201:
 *         description: Laudo criado com sucesso
 */
router.post('/', authGuard, roleGuard('perito'), laudosController.createLaudo);

/**
 * @swagger
 * /api/laudos/{id}:
 *   put:
 *     summary: Atualiza um laudo existente
 *     tags: [Laudos]
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
 *               titulo:
 *                 type: string
 *               texto:
 *                 type: string
 *               evidence:
 *                 type: string
 *             peritoResponsavel:
 *                 type: string
 *     responses:
 *       200:
 *         description: Laudo atualizado com sucesso
 */
router.put('/:id', authGuard, roleGuard('perito'), laudosController.updateLaudo);

/**
 * @swagger
 * /api/laudos/{id}:
 *   delete:
 *     summary: Deleta um laudo
 *     tags: [Laudos]
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
 *         description: Laudo deletado com sucesso
 */
router.delete('/:id', authGuard, roleGuard('perito'), laudosController.deleteLaudo);

/**
 * @swagger
 * /api/laudos/{id}/pdf:
 *   get:
 *     summary: Exporta um laudo em PDF
 *     tags: [Laudos]
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
 *         description: PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */

router.get('/:id/pdf', authGuard, roleGuard('perito'), laudosController.exportToPDF);

/**
 * @swagger
 * /api/laudos:
 *   get:
 *     summary: Lista todos os laudos
 *     tags: [Laudos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de laudos retornada com sucesso
 */
router.get('/', authGuard, laudosController.listarLaudos);


/**
 * @swagger
 * /api/laudos/{id}/assinar:
 *   post:
 *     summary: Assinar digitalmente o laudo
 *     tags: [Laudos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do laudo a ser assinado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Laudo assinado com sucesso
 */
router.post('/:id/assinar', authGuard, roleGuard('perito'), laudosController.assinarLaudo);


module.exports = router;

