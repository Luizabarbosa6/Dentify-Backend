const periciado = require('../models/periciado');
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
