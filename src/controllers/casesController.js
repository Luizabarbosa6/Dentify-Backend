const Case = require('../models/cases');

exports.createCase = async (req, res) => {
  try {
    const novoCaso = new Case(req.body);
    await novoCaso.save();
    res.status(201).json({ message: 'Caso criado com sucesso', caso: novoCaso });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar caso', erro: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const casoAtualizado = await Case.findByIdAndUpdate(id, { status }, { new: true });
    if (!casoAtualizado) {
      return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.status(200).json({ message: 'Status atualizado com sucesso', caso: casoAtualizado });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status do caso', erro: error.message });
  }
};

exports.listCases = async (req, res) => {
  try {
    const filtros = req.query;
    const casos = await Case.find(filtros).populate('responsavel');
    if (casos.length === 0) {
      return res.status(404).json({ message: 'Nenhum caso encontrado' });
    }
    res.status(200).json({ message: 'Casos encontrados', casos });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar casos', erro: error.message });
  }
};

exports.getCaseDetail = async (req, res) => {
  try {
    const caso = await Case.findById(req.params.id).populate('responsavel');
    if (!caso) {
      return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.status(200).json({ message: 'Detalhes do caso encontrados', caso });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar detalhes do caso', erro: error.message });
  }
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
