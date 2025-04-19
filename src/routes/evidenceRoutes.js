const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const evidenceController = require('../controllers/evidenceController');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

/**
 * @swagger
 * tags:
 *   name: Evidências
 *   description: Gerenciamento de evidências coletadas em casos
 */

/**
 * @swagger
 * /api/evidences:
 *   post:
 *     summary: Faz upload de uma evidência (imagem ou texto)
 *     tags: [Evidências]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [imagem, texto]
 *               dataColeta:
 *                 type: string
 *                 format: date
 *               coletadoPor:
 *                 type: string
 *                 description: ID do assistente que coletou
 *               caso:
 *                 type: string
 *                 description: ID do caso relacionado
 *               imagem:
 *                 type: string
 *                 format: binary
 *               conteudoTexto:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evidência criada com sucesso
 */
router.post('/', authGuard, roleGuard('assistente'), upload.single('imagem'), evidenceController.uploadEvidence);

/**
 * @swagger
 * /api/evidences/{id}:
 *   put:
 *     summary: Atualiza uma evidência existente
 *     tags: [Evidências]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [imagem, texto]
 *               dataColeta:
 *                 type: string
 *                 format: date
 *               coletadoPor:
 *                 type: string
 *               caso:
 *                 type: string
 *               imagem:
 *                 type: string
 *                 format: binary
 *               conteudoTexto:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evidência atualizada com sucesso
 */
router.put('/:id', authGuard, roleGuard('assistente'), upload.single('imagem'), evidenceController.updateEvidence);

/**
 * @swagger
 * /api/evidences/{id}:
 *   delete:
 *     summary: Deleta uma evidência
 *     tags: [Evidências]
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
 *         description: Evidência deletada com sucesso
 */
router.delete('/:id', authGuard, roleGuard('assistente'), evidenceController.deleteEvidence);

/**
 * @swagger
 * /api/evidences/by-case/{caseId}:
 *   get:
 *     summary: Lista evidências de um caso específico
 *     tags: [Evidências]
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
 *         description: Lista de evidências retornada com sucesso
 */
router.get('/by-case/:caseId', authGuard, evidenceController.getEvidenceByCase);

module.exports = router;