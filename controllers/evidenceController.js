const Evidence = require('../models/evidence');

exports.uploadEvidence = async (req, res) => {
  const { tipo, dataColeta, coletadoPor, caso, conteudoTexto } = req.body;
  let imagemURL = null;

  if (req.file) {
    imagemURL = `/uploads/${req.file.filename}`;
  }

  const evid = new Evidence({ tipo, dataColeta, coletadoPor, caso, conteudoTexto, imagemURL });

  await evid.save();
  res.status(201).json(evid);
};

exports.getEvidenceByCase = async (req, res) => {
  const evidencias = await Evidence.find({ caso: req.params.caseId });
  res.json(evidencias);
};

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

