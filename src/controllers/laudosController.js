const path = require('path');
const { signPDFFile } = require('../utils/pdfSigner');
Laudo = require('../models/laudos');
const { gerarPDF } = require('../utils/pdfGenerator');


exports.assinarLaudo = async (req, res) => {
  try {
    const laudo = await Laudo.findById(req.params.id);

    if (!laudo) {
      return res.status(404).json({ message: 'Laudo não encontrado' });
    }

    // Verifica se o laudo já está assinado
    if (laudo.isSigned) {
      return res.status(400).json({ message: 'O laudo já está assinado' });
    }

    // Marcar o laudo como assinado
    laudo.isSigned = true;
    await laudo.save();

    res.status(200).json({ message: 'Laudo assinado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao assinar o laudo', error: error.message });
  }
};


exports.exportToPDF = async (req, res) => {
  try {
    // Buscando o laudo e populando o perito responsável
    const laudo = await Laudo.findById(req.params.id).populate('peritoResponsavel', 'name');

    if (!laudo) {
      return res.status(404).json({ message: 'Laudo não encontrado' });
    }

    // Verificando se o laudo foi assinado
    if (!laudo.isSigned) {
      return res.status(400).json({ message: 'O laudo precisa ser assinado antes de ser exportado' });
    }

    // Verificando se o perito está corretamente preenchido
    if (!laudo.peritoResponsavel || !laudo.peritoResponsavel.name) {
      return res.status(400).json({ message: 'Perito responsável não encontrado' });
    }

    // Gerando o PDF com os dados do laudo
    const pdfBuffer = await gerarPDF(laudo);

    // Configurando os headers para exportar o PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="laudo-assinado-${laudo._id}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    res.status(500).json({ message: 'Erro ao exportar o laudo', error: error.message });
  }
};


exports.createLaudo = async (req, res) => {
  try {
    const { titulo, texto, peritoResponsavel } = req.body;
    
    // Validação básica dos campos obrigatórios
    if (!titulo || !texto || !peritoResponsavel) {
      return res.status(400).json({ message: 'Faltam campos obrigatórios (titulo, texto, peritoResponsavel)' });
    }

    const novoLaudo = new Laudo(req.body);
    await novoLaudo.save();
    res.status(201).json(novoLaudo);
  } catch (error) {
    console.error('Erro ao criar laudo:', error);
    res.status(500).json({ message: 'Erro ao criar laudo', erro: error.message });
  }
};


exports.listarLaudos = async (req, res) => {
  try {
    // Buscando todos os laudos, populando a evidência e o perito responsável
    const laudos = await Laudo.find()
      .populate('evidence')  // Preenche as evidências associadas
      .populate('peritoResponsavel', 'name');  // Preenche o nome do perito responsável

    if (laudos.length === 0) {
      return res.status(404).json({ message: 'Nenhum laudo encontrado' });
    }

    // Retorna os laudos encontrados
    res.status(200).json({ message: 'Laudos encontrados', laudos });
  } catch (error) {
    console.error('Erro ao buscar laudos:', error);
    res.status(500).json({ message: 'Erro ao buscar laudos', error: error.message });
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

    if (dadosAtualizados.status === 'concluído' && !laudoAtualizado.isSigned) {
      return res.status(400).json({ message: 'Não é possível concluir um laudo sem assinatura digital 🛑' });
    }

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