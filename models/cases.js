const { default: mongoose } = require("mongoose");

const casoSchema = new mongoose.Schema({
    titulo: String,
    descricao: String,
    status: { type: String, enum: ['Em andamento', 'Finalizado', 'Arquivado'] },
    dataAbertura: Date,
    dataFechamento: Date,
    responsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    evidencias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' }]
  });


module.exports = mongoose.model('Caso', casoSchema)


/*idCaso: {type: String, required: true},
Data: {type: Date, required: true},
Hora: {type: String, required: true},
Local: {type: String, required: true},
tipoPericia: {type: String, required: true},
orgaoSolicitante: {type: String, required: true},
periciado:{
    Nome: {type: String, required: true},
    dataNascimento: {type: Date, required: true},
    Sexo: {type: String, required: true},
    documentoIdentificacao: {type: String, required: true},
},
evidencias: {
    descricaoCaso: { type: String, required: true },
    evidencias: { type: String, required: true },
    documentoIdentificacao: { type: String, required: true }*/
