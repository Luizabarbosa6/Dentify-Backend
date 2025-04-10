const express = require('express');
const router = express.Router();
const caseController = require('../controllers/casesController');

router.post('/', caseController.createCase);
router.patch('/:id/status', caseController.updateStatus);
router.get('/', caseController.listCases);
router.get('/:id', caseController.getCaseDetail);

module.exports = router;





/*.post('/', upload.single('evidencia'), async (req, res) => {
  try {
    const {
      idCaso,
      Data,
      Hora,
      Local,
      tipoPericia,
      orgaoSolicitante,
      'periciado.Nome': nome,
      'periciado.dataNascimento': dataNascimento,
      'periciado.Sexo': sexo,
      'periciado.documentoIdentificacao': docPericiado,
      'evidencias.descricaoCaso': descricaoCaso,
      'evidencias.evidencias': evidenciasInfo,
      'evidencias.documentoIdentificacao': docEvidencias,
    } = req.body;

    const novoCaso = new Caso({
      idCaso,
      Data,
      Hora,
      Local,
      tipoPericia,
      orgaoSolicitante,
      periciado: { Nome: nome, dataNascimento, Sexo: sexo, documentoIdentificacao: docPericiado },
      evidencias: { descricaoCaso, evidencias: req.file?.filename || evidenciasInfo, documentoIdentificacao: docEvidencias}
    });

    await novoCaso.save();
    res.status(201).json({ msg: 'Caso cadastrado com sucesso', caso: novoCaso });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao salvar o caso', erro: err.message });
  }
});*/