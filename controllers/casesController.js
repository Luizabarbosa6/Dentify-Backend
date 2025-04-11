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
