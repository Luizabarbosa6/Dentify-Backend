const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['imagem', 'texto'], required: true },
  dataColeta: Date,
  coletadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  caso: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  imagemURL: String,  
  conteudoTexto: String, 
});

module.exports = mongoose.model('Evidence', evidenceSchema);
