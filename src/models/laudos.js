
const mongoose = require('mongoose');

const laudoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  texto: { type: String},
  evidence: { type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' },
  peritoResponsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isSigned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Laudo', laudoSchema); 