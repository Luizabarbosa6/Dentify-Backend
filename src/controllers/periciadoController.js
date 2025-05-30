const Periciado = require('../models/periciado');
exports.createPericiado = async (req, res) => {
  try {
    const novaPessoa = new Periciado(req.body);
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
    const pessoaAtualizada = await Periciado.findByIdAndUpdate(id, dadosAtualizados, {
      new: true, // Retorna o documento atualizado
      runValidators: true // Valida com base no schema
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