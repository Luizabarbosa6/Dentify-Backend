const express = require('express');
const router = express.Router();
const controller = require('../controllers/casesController');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

router.post('/', authGuard, roleGuard('perito'), controller.createCase);
router.patch('/:id/status', authGuard, roleGuard('perito'), controller.updateStatus);
router.put('/:id', authGuard, roleGuard('perito'), controller.updateCase);
router.delete('/:id', authGuard, roleGuard('perito'), controller.deleteCase);
router.get('/', authGuard, controller.listCases);
router.get('/:id', authGuard, controller.getCaseDetail);

module.exports = router;
