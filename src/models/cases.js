const { default: mongoose } = require("mongoose");

const casoSchema = new mongoose.Schema({
    titulo: String,
    descricao: String,
    status: { type: String, enum: ['Em andamento', 'Finalizado', 'Arquivado'] },
    data: Date,
    dataFechamento: Date,
    sexo: { type: String, enum: ['Masculino', 'Feminino', 'Outro'], required: true },
    local: String,
  });

module.exports = mongoose.model('Caso', casoSchema)