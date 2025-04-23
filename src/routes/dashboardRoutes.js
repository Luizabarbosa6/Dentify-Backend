const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');


/**
 * @swagger
 * /api/dashboard/resumo:
 *   get:
 *     summary: Retorna resumo de casos por status e tipo
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dados agregados do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 porStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         example: Em andamento
 *                       total:
 *                         type: integer
 *                         example: 12
 *                 porTipo:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tipo:
 *                         type: string
 *                         example: Vítima
 *                       total:
 *                         type: integer
 *                         example: 8
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/resumo', dashboardController.getDashboardResumo);

router.get('/resumo', dashboardController.getDashboardResumo);

module.exports = router;
