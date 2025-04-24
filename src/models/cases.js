const { default: mongoose } = require("mongoose");

const casoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    tipo: { type: String, enum: ['Vitima', 'Desaparecido', 'Outro'], required: true },
    responsavel: { type: String, required: true },
    status: { type: String, enum: ['Em andamento', 'Finalizado', 'Arquivado'] },
    dataAbertura: Date,
    dataFechamento: Date,
    sexo: { type: String, enum: ['Masculino', 'Feminino', 'Outro'], required: true },
    local: String,
  });

module.exports = mongoose.model('Caso', casoSchema)