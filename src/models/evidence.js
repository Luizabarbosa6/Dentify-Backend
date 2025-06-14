const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['imagem', 'texto'], required: true },
  titulo: { type: String },
  dataColeta: Date,
  coletadoPor: { type: String },
  responsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  caso: { type: mongoose.Schema.Types.ObjectId, ref: 'Caso' },
  periciado: { type: mongoose.Schema.Types.ObjectId, ref: 'Periciado' },
  localColeta: { type: String },
  latitude: Number,
  longitude: Number,
  imagemURL: {
    type: String,
    validate: {
      validator: function(value) {
        const validUrl = /^(https?:\/\/)/;
        const validImage = /\.(jpg|jpeg|png|gif)$/i;
        const validFile = /\.(pdf|docx|doc|txt|zip)$/i;
        const isLocalPath = /^uploads\//;

        return validUrl.test(value) || validImage.test(value) || validFile.test(value) || isLocalPath.test(value);
      },
      message: 'O campo imagemURL deve ser uma URL válida, uma imagem, um PDF, DOCX, TXT ou um caminho de arquivo local.',
    }
  },
  descricao: { type: String },
});

module.exports = mongoose.model('Evidence', evidenceSchema);
