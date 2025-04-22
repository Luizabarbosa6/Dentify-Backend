const mongoose = require('mongoose');

const relatorioSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  conteudo: { type: String, required: true },
  caso: { type: mongoose.Schema.Types.ObjectId, ref: 'Caso', required: true },
  peritoResponsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isSigned: { type: Boolean, default: false },
  dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Relatorio', relatorioSchema);
