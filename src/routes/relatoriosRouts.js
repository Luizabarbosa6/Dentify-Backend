const express = require('express');
const router = express.Router();
const controller = require('../controllers/relatoriosController');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

/**
 * @swagger
 * tags:
 *   name: Relatórios
 *   description: Endpoints para gerenciamento de relatórios
 */

/**
 * @swagger
 * /api/relatorio:
 *   post:
 *     summary: Cria um novo relatorio
 *     tags: [Relatórios]
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
 *               conteudo:
 *                 type: string
 *               caso:
 *                 type: string
 *                 description: ID do caso
 *               peritoResponsavel:
 *                 type: string
 *                 description: ID do perito responsável
 *     responses:
 *       201:
 *         description: Relatório criado com sucesso            
 */

router.post('/', authGuard, roleGuard('perito'), controller.createRelatorio); 

/**
 * @swagger
 * /api/relatorio:
 *   get:
 *     summary: Listar todos os relatórios
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de relatórios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Relatorio'
 */
router.get('/', authGuard, roleGuard('perito'), controller.listarRelatorios);

/**
 * @swagger
 * /api/relatorio/{id}:
 *   put:
 *     summary: Atualizar um relatório existente
 *     tags: [Relatórios]
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
 *     responses:
 *       200:
 *         description: Relatório atualizado com sucesso
 */
router.put('/:id',authGuard, roleGuard('perito'), controller.updateRelatorio);

/**
 * @swagger
 * /api/relatorio/{id}:
 *   delete:
 *     summary: Deletar um relatório
 *     tags: [Relatórios]
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
 *         description: Relatório deletado com sucesso
 */
router.delete('/:id',authGuard, roleGuard('perito'), controller.deleteRelatorio);

/**
 * @swagger
 * /api/relatorio/{id}/pdf:
 *   get:
 *     summary: Exportar o relatório em PDF
 *     tags: [Relatórios]
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
 *         description: PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:id/pdf', authGuard, roleGuard('perito'), controller.exportToPDF);

/**
 * @swagger
 * /api/relatorio/{id}/assinar:
 *   post:
 *     summary: Assinar digitalmente o relatório
 *     tags: [Relatórios]
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
 *         description: Relatório assinado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 assinatura:
 *                   type: string
 */
router.post('/:id/assinar', authGuard, roleGuard('perito'), controller.assinarRelatorio);

/**
 * @swagger
 * /api/relatorio/{id}:
 *   put:
 *     summary: Atualizar um relatório existente
 *     tags: [Relatórios]
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
 *               titulo:
 *                 type: string
 *               conteudo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Relatório atualizado com sucesso
 */
router.get('/:id', authGuard, roleGuard('perito'), controller.getRelatorioById);

module.exports = router;