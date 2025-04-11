const express = require('express');
const router = express.Router();
const laudosController = require('../controllers/laudosController'); 


router.post('/', laudosController.createLaudo);
router.get('/:id/pdf', laudosController.exportToPDF);
router.get('/', laudosController.listarLaudos);


module.exports = router;
