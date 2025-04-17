const Periciado = require('../models/periciado');
exports.createPericiado = async (req, res) => {
  try {
    const novaPessoa = new periciado(req.body);
    await novaPessoa.save();
    res.status(201).json(novaPessoa);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar periciado', detalhes: err });
  }
};

exports.getPericiado = async (req, res) => {
  const pessoas = await Periciado.find();
  res.json(pessoas);
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