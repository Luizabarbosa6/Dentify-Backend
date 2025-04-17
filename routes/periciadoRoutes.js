const express = require('express');
const router = express.Router();
const controller = require('../controllers/periciadoController');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

router.post('/', authGuard, roleGuard('perito'), controller.createPericiado);
router.put('/:id', authGuard, roleGuard('perito'), controller.updatePericiado);
router.delete('/:id', authGuard, roleGuard('perito'), controller.deletePericiado);
router.get('/', authGuard, controller.getPericiado);
router.get('/:id', authGuard, controller.getPericiadoById);

module.exports = router;