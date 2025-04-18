const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['imagem', 'texto'], required: true },
  dataColeta: Date,
  coletadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  caso: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  imagemURL: {
    type: String,
    validate: {
      validator: function(value) {
        const validUrl = /^(https?:\/\/)/;
        const validImage = /\.(jpg|jpeg|png|gif)$/i;
        const isLocalPath = /^uploads\//;
        return validUrl.test(value) || validImage.test(value) || isLocalPath.test(value);
      },
      message: 'O campo imagemURL deve ser uma URL válida, uma imagem ou um caminho de arquivo local.',
    }
  },
  conteudoTexto: String,
});

module.exports = mongoose.model('Evidence', evidenceSchema);
