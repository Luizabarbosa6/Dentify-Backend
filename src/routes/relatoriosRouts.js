const express = require('express');
const router = express.Router();
const controller = require('../controllers/relatoriosController');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

router.post('/', authGuard, roleGuard('perito'), controller.createRelatorio);  
router.get('/', authGuard, roleGuard('perito'), controller.listarRelatorios);
router.put('/:id',authGuard, roleGuard('perito'), controller.updateRelatorio);
router.delete('/:id',authGuard, roleGuard('perito'), controller.deleteRelatorio);
router.get('/:id/exportar-pdf', authGuard, roleGuard('perito'), controller.exportToPDF);

module.exports = router;
