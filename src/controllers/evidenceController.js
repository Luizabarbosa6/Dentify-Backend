const Evidence = require('../models/evidence');

exports.uploadEvidence = async (req, res) => {
  const { tipo, dataColeta, coletadoPor, caso, conteudoTexto, titulo  } = req.body;

  let imagemURL = null;
  if (req.file && req.file.path) {
    imagemURL = req.file.path; 
  }

  const evid = new Evidence({ tipo, dataColeta, coletadoPor, caso, conteudoTexto, titulo, imagemURL});

  await evid.save();
  res.status(201).json(evid);
};

exports.getEvidenceByCase = async (req, res) => {
  try {
    // Buscando evidências e populando o campo coletadoPor (referência para o usuário)
    const evidencias = await Evidence.find({ caso: req.params.caseId })
      .populate('coletadoPor', 'name');  // Isso vai retornar o campo 'name' do usuário

    // Verifique o que está sendo retornado
    res.json(evidencias);
  } catch (error) {
    console.error('Erro ao obter evidências:', error);
    res.status(500).json({ error: 'Erro ao obter evidências.' });
  }
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

exports.updateEvidence = async (req, res) => {
  try {
    const { tipo, dataColeta, coletadoPor, caso, conteudoTexto, titulo,} = req.body;

    let imagemURL;
    if (req.file && req.file.path) {
      imagemURL = req.file.path;
    }

    const updateData = { tipo, dataColeta, coletadoPor, caso, conteudoTexto, titulo};

    if (imagemURL) {
      updateData.imagemURL = imagemURL;
    }

    const updated = await Evidence.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Evidência não encontrada' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar evidência', error: error.message });
  }
};

exports.deleteEvidence = async (req, res) => {
  try {
    const deleted = await Evidence.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Evidência não encontrada' });
    }
    res.json({ message: 'Evidência deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar evidência', error: error.message });
  }
};

