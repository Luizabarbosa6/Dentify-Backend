const express = require('express');
const router = express.Router();
const laudosController = require('../controllers/laudosController');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

router.post('/', authGuard, roleGuard('perito'), laudosController.createLaudo);
router.put('/:id', authGuard, roleGuard('perito'), laudosController.updateLaudo);
router.delete('/:id', authGuard, roleGuard('perito'), laudosController.deleteLaudo);
router.get('/:id/pdf', authGuard, laudosController.exportToPDF);
router.get('/', authGuard, laudosController.listarLaudos);

module.exports = router;
