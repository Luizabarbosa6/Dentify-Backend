const express = require('express');
const router = express.Router();
const controller = require('../controllers/periciadoController');

router.post('/', controller.createPericiado);
router.get('/', controller.getPericiado);
router.get('/:id', controller.getPericiadoById);

module.exports = router;
