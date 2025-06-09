const mongoose = require('mongoose');

function gerarNicAleatorio() {
  return Math.floor(10000000 + Math.random() * 90000000).toString(); // Gera um número de 8 dígitos como string
}
const periciadoSchema = new mongoose.Schema({
  nomeCompleto: { type: String, required: true },
  endereco: { type: String },
  caso: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  dataNascimento: { type: Date, required: true },
  sexo: { type: String, enum: ['Masculino', 'Feminino', 'Outro'], required: true },
  cpf: { type: String, required: true, unique: true },
  nic: { type: String, required: true, unique: true, default: gerarNicAleatorio },
  etnia: { type: String, enum: ['Preto', 'Pardo', 'Branco', 'Amarelo', 'Indígena'], required: true },
  criadoEm: { type: Date, default: Date.now },
  odontograma: [{
    numero: { type: Number, required: true }, 
    descricao: { type: String, required: true } 
  }]
});

module.exports = mongoose.model('Periciado', periciadoSchema);
