const Laudo = require('../models/laudos');
const { gerarPDF } = require('../utils/pdfGenerator');

exports.createLaudo = async (req, res) => {
  try {
    const novoLaudo = new Laudo(req.body);
    await novoLaudo.save();
    res.status(201).json(novoLaudo);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar laudo', erro: error.message });
  }
};

exports.exportToPDF = async (req, res) => {
  const laudo = await Laudo.findById(req.params.id).populate('peritoResponsavel');
  const pdfBuffer = await gerarPDF(laudo);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="laudo-${laudo._id}.pdf"`);
  res.send(pdfBuffer);
};

exports.listarLaudos = async (req, res) => {
  try {
    const laudos = await Laudo.find().populate('evidence').populate('peritoResponsavel');
    res.json(laudos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar laudos' });
  }
};

exports.updateLaudo = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    const laudoAtualizado = await Laudo.findByIdAndUpdate(id, dadosAtualizados, {
      new: true,
      runValidators: true
    });

    if (!laudoAtualizado) {
      return res.status(404).json({ message: 'Laudo não encontrado' });
    }

    res.json(laudoAtualizado);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar laudo', erro: error.message });
  }
};

exports.deleteLaudo = async (req, res) => {
  try {
    const { id } = req.params;

    const laudoDeletado = await Laudo.findByIdAndDelete(id);

    if (!laudoDeletado) {
      return res.status(404).json({ message: 'Laudo não encontrado' });
    }

    res.json({ message: 'Laudo deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar laudo', erro: error.message });
  }
};