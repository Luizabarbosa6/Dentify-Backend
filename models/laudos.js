
const mongoose = require('mongoose');

const laudoSchema = new mongoose.Schema({
  titulo: String,
  texto: String,
  caso: { type: mongoose.Schema.Types.ObjectId, ref: 'Caso' },
  peritoResponsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Laudo', laudoSchema); 