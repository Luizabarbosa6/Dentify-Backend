const Evidence = require('../models/evidence');
const getCoordinates = require('../utils/getCoordinates');

exports.uploadEvidence = async (req, res) => {
  try {
    const { tipo, dataColeta, coletadoPor, caso, localColeta, descricao, titulo } = req.body;

    let imagemURL = null;
    if (req.file && req.file.path) {
      imagemURL = req.file.path;
    }

    const responsavel = req.user.id;
    let latitude = null;
    let longitude = null;

    if (localColeta) {
      const coordinates = await getCoordinates(localColeta);
      if (coordinates) {
        latitude = coordinates.latitude;
        longitude = coordinates.longitude;
      }
    }

    const evid = new Evidence({
      tipo,
      dataColeta,
      coletadoPor,
      caso,
      localColeta,
      descricao,
      titulo,
      imagemURL,
      responsavel,
      latitude,
      longitude,
    });

    await evid.save();
    res.status(201).json(evid);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar evidência', error: error.message });
  }
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
    const { tipo, dataColeta, coletadoPor, caso, localColeta, descricao, titulo } = req.body;

    let imagemURL;
    if (req.file && req.file.path) {
      imagemURL = req.file.path;
    }

    const responsavel = req.user.id;

    // 🔍 Buscar coordenadas se localColeta foi enviado
    let latitude = null;
    let longitude = null;

    if (localColeta) {
      const coordinates = await getCoordinates(localColeta);
      if (coordinates) {
        latitude = coordinates.latitude;
        longitude = coordinates.longitude;
      }
    }

    const updateData = {
      tipo,
      dataColeta,
      coletadoPor,
      caso,
      localColeta,
      descricao,
      titulo,
      responsavel,
      latitude,
      longitude,
    };

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

