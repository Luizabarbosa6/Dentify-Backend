const express = require('express');
const router = express.Router();
const laudosController = require('../controllers/laudosController'); 


router.post('/', laudosController.createLaudo);
router.get('/:id/pdf', laudosController.exportToPDF);
router.get('/', laudosController.listarLaudos);
router.put('/:id', laudosController.updateLaudo);   
router.delete('/:id', laudosController.deleteLaudo);

module.exports = router;