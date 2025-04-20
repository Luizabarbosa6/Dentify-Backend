const Relatorio = require('../models/relatorios');
const { gerarPDF } = require('../utils/pdfRelatorioGenerator');

exports.createRelatorio = async (req, res) => {
  try {
    const novoRelatorio = new Relatorio(req.body);
    await novoRelatorio.save();
    res.status(201).json(novoRelatorio);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar relatório', erro: error.message });
  }
};

exports.exportToPDF = async (req, res) => {
  try {
    const relatorio = await Relatorio.findById(req.params.id).populate('peritoResponsavel').populate('caso');
    if (!relatorio) {
      return res.status(404).json({ message: 'Relatório não encontrado' });
    }

    const pdfBuffer = await gerarPDF(relatorio);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="relatorio-${relatorio._id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao exportar PDF', erro: error.message });
  }
};

exports.listarRelatorios = async (req, res) => {
  try {
    const relatorios = await Relatorio.find().populate('caso').populate('peritoResponsavel');
    res.json(relatorios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar relatórios', erro: error.message });
  }
};

exports.updateRelatorio = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    const relatorioAtualizado = await Relatorio.findByIdAndUpdate(id, dadosAtualizados, {
      new: true,
      runValidators: true
    });

    if (!relatorioAtualizado) {
      return res.status(404).json({ message: 'Relatório não encontrado' });
    }

    res.json(relatorioAtualizado);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar relatório', erro: error.message });
  }
};

exports.deleteRelatorio = async (req, res) => {
  try {
    const { id } = req.params;

    const relatorioDeletado = await Relatorio.findByIdAndDelete(id);

    if (!relatorioDeletado) {
      return res.status(404).json({ message: 'Relatório não encontrado' });
    }

    res.json({ message: 'Relatório deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar relatório', erro: error.message });
  }
};

