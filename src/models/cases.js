const { default: mongoose } = require("mongoose");

const casoSchema = new mongoose.Schema({
    titulo: String,
    descricao: String,
    status: { type: String, enum: ['Em andamento', 'Finalizado', 'Arquivado'] },
    dataAbertura: Date,
    dataFechamento: Date,
    responsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });


module.exports = mongoose.model('Caso', casoSchema)