const Case = require('../models/cases');

exports.createCase = async (req, res) => {
  const novoCaso = new Case(req.body);
  await novoCaso.save();
  res.status(201).json(novoCaso);
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const casoAtualizado = await Case.findByIdAndUpdate(id, { status }, { new: true });
  res.json(casoAtualizado);
};

exports.listCases = async (req, res) => {
  const filtros = req.query;
  const casos = await Case.find(filtros).populate('responsavel evidencias');
  res.json(casos);
};

exports.getCaseDetail = async (req, res) => {
  const caso = await Case.findById(req.params.id).populate('responsavel evidencias');
  res.json(caso);
};

exports.updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    const casoAtualizado = await Case.findByIdAndUpdate(id, dadosAtualizados, {
      new: true,
      runValidators: true
    });

    if (!casoAtualizado) {
      return res.status(404).json({ message: 'Caso não encontrado' });
    }

    res.json(casoAtualizado);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o caso', erro: error.message });
  }
};

exports.deleteCase = async (req, res) => {
  try {
    const { id } = req.params;

    const casoDeletado = await Case.findByIdAndDelete(id);

    if (!casoDeletado) {
      return res.status(404).json({ message: 'Caso não encontrado' });
    }

    res.json({ message: 'Caso deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar o caso', erro: error.message });
  }
};