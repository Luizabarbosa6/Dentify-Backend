const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const evidenceController = require('../controllers/evidenceController');
const authGuard = require('../middlewares/authGuard');
const roleGuard = require('../middlewares/roleGuard');

router.post('/', authGuard, roleGuard('assistente'), upload.single('imagem'), evidenceController.uploadEvidence);
router.put('/:id', authGuard, roleGuard('assistente'), upload.single('imagem'), evidenceController.updateEvidence);
router.delete('/:id', authGuard, roleGuard('assistente'), evidenceController.deleteEvidence);
router.get('/by-case/:caseId', authGuard, evidenceController.getEvidenceByCase);

module.exports = router;