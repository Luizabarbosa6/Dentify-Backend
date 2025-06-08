const mongoose = require('mongoose');

const periciadoSchema = new mongoose.Schema({
  nomeCompleto: { type: String, required: true },
  endereco: { type: String },
  caso: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  dataNascimento: { type: Date, required: true },
  sexo: { type: String, enum: ['Masculino', 'Feminino', 'Outro'], required: true },
  cpf: { type: String, required: true, unique: true },
  nic: { type: String, required: true, unique: true },
  etnia: { type: String, enum: ['Preto', 'Pardo', 'Branco', 'Amarelo', 'Indígena'], required: true },
  criadoEm: { type: Date, default: Date.now },

  // Adicionando o odontograma:
  odontograma: [{
    numero: { type: Number, required: true }, // Ex: número do dente
    descricao: { type: String, required: true } // Ou "problema", se preferir
  }]
});

module.exports = mongoose.model('Periciado', periciadoSchema);
