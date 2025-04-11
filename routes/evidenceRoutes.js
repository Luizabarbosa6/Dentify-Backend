const express = require('express');
const router = express.Router();
const multer = require('multer');
const evidenceController = require('../controllers/evidenceController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/', upload.single('imagem'), evidenceController.uploadEvidence);
router.get('/by-case/:caseId', evidenceController.getEvidenceByCase);

module.exports = router;
