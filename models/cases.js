const { default: mongoose } = require("mongoose");

const casoSchema = new mongoose.Schema({ 
    idCaso: {type: String, required: true},
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
        documentoIdentificacao: { type: String, required: true }
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Caso', casoSchema)
