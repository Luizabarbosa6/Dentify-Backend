const mongoose = require('mongoose');

const periciadoSchema = new mongoose.Schema({
  nomeCompleto: { type: String, required: true },
  dataNascimento: { type: Date, required: true },
  sexo: { type: String, enum: ['Masculino', 'Feminino', 'Outro'], required: true },
  documentoIdentificacao: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Periciado', periciadoSchema);
