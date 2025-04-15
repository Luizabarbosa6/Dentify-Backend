const express = require('express');
const router = express.Router();
const controller = require('../controllers/casesController');

router.post('/', controller.createCase);
router.patch('/:id/status', controller.updateStatus);
router.get('/', controller.listCases);
router.get('/:id', controller.getCaseDetail);
router.put('/:id', controller.updateCase);
router.delete('/:id', controller.deleteCase);


module.exports = router;




