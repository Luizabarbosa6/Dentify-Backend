const Relatorio = require('../models/relatorios');
const { signPDFFile } = require('../utils/pdfSigner');
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

exports.assinarRelatorio = async (req, res) => {
  try {
    const relatorio = await Relatorio.findById(req.params.id);

    if (!relatorio) {
      return res.status(404).json({ message: 'Relatório não encontrado' });
    }

    if (relatorio.isSigned) {
      return res.status(400).json({ message: 'O relatório já está assinado' });
    }

    relatorio.isSigned = true;

    // opcional, se tiver um campo de assinatura:
    if (req.body.assinatura) {
      relatorio.assinatura = req.body.assinatura;
    }

    await relatorio.save();

    res.status(200).json({ message: 'Relatório assinado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao assinar o relatório', error: error.message });
  }
};


exports.exportToPDF = async (req, res) => {
  try {
    // Buscando o relatório e populando o perito responsável
    const relatorio = await Relatorio.findById(req.params.id).populate('peritoResponsavel', 'name');

    if (!relatorio) {
      return res.status(404).json({ message: 'Relatório não encontrado' });
    }

    // Verificando se o relatório foi assinado
    if (!relatorio.isSigned) {
      return res.status(400).json({ message: 'O relatório precisa ser assinado antes de ser exportado' });
    }

    // Verificando se o perito está corretamente preenchido
    if (!relatorio.peritoResponsavel || !relatorio.peritoResponsavel.name) {
      return res.status(400).json({ message: 'Perito responsável não encontrado' });
    }

    // Gerando o PDF com os dados do relatório
    const pdfBuffer = await gerarPDF(relatorio);

    // Configurando os headers para exportar o PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="relatorio-assinado-${relatorio._id}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    res.status(500).json({ message: 'Erro ao exportar o relatório', error: error.message });
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

