const Periciado = require('../models/periciado');
const getCoordinates = require('../utils/getCoordinates');


exports.createPericiado = async (req, res) => {
  try {
    const data = req.body;

    // Supondo que o campo seja 'endereco'
    if (data.endereco) {
      const coords = await getCoordinates(data.endereco);
      if (coords) {
        data.latitude = coords.latitude;
        data.longitude = coords.longitude;
      }
    }

    const novaPessoa = new Periciado(data);
    await novaPessoa.save();
    res.status(201).json(novaPessoa);
  } catch (err) {
    res.status(400).json({ 
      error: 'Erro ao cadastrar periciado', 
      detalhes: err.message, 
      erros: err.errors 
    });
  }
};

exports.getPericiadosByCaseId = async (req, res) => {
  try {
    const { caseId } = req.params;
    const periciados = await Periciado.find({ caso: caseId });
    res.status(200).json(periciados);
  } catch (error) {
    console.error('Erro ao buscar periciados por caseId:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

exports.getPericiado = async (req, res) => {
  try {
    const pessoas = await Periciado.find();
    if (pessoas.length === 0) {
      return res.status(404).json({ message: 'Nenhum periciado encontrado' });
    }
    res.status(200).json(pessoas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar periciados', erro: error.message });
  }
};


exports.getPericiadoById = async (req, res) => {
  const pessoa = await Periciado.findById(req.params.id);
  if (!pessoa) return res.status(404).json({ error: 'Periciado não encontrado' });
  res.json(pessoa);
};

exports.updatePericiado = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    if (dadosAtualizados.endereco) {
      const coords = await getCoordinates(dadosAtualizados.endereco);
      if (coords) {
        dadosAtualizados.latitude = coords.latitude;
        dadosAtualizados.longitude = coords.longitude;
      }
    }

    const pessoaAtualizada = await Periciado.findByIdAndUpdate(id, dadosAtualizados, {
      new: true,
      runValidators: true
    });

    if (!pessoaAtualizada) {
      return res.status(404).json({ error: 'Periciado não encontrado' });
    }

    res.json(pessoaAtualizada);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar periciado', detalhes: err });
  }
};

exports.deletePericiado = async (req, res) => {
  try {
    const { id } = req.params;
    const pessoaDeletada = await Periciado.findByIdAndDelete(id);
    if (!pessoaDeletada) {
      return res.status(404).json({ error: 'Periciado não encontrado' });
    }
    res.json({ mensagem: 'Periciado deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar periciado', detalhes: err });
  }
};

exports.updateOdontograma = async (req, res) => {
  try {
    const { id } = req.params;
    const { odontograma } = req.body;

    if (!odontograma || !Array.isArray(odontograma)) {
      return res.status(400).json({ error: 'Formato inválido para odontograma' });
    }

    const periciado = await Periciado.findById(id);
    if (!periciado) {
      return res.status(404).json({ error: 'Periciado não encontrado' });
    }

    periciado.odontograma = odontograma;
    await periciado.save();

    res.status(200).json({ message: 'Odontograma atualizado com sucesso', periciado });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar odontograma', detalhes: error.message });
  }
};

exports.getOdontograma = async (req, res) => {
  try {
    const { id } = req.params;
    const periciado = await Periciado.findById(id);

    if (!periciado) {
      return res.status(404).json({ error: 'Periciado não encontrado' });
    }

    res.status(200).json(periciado.odontograma || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar odontograma', detalhes: error.message });
  }
};