const path = require('path');
const { gerarTextoRelatorio } = require('../utils/gemini');
const { signPDFFile } = require('../utils/pdfSigner');
const Evidence = require('../models/evidence');
const Laudo = require('../models/laudos');

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
    const { titulo, evidence: evidenceId, peritoResponsavel } = req.body;

    const evidencia = await Evidence.findById(evidenceId).populate('caso');

    if (!evidencia) {
      return res.status(404).json({ message: 'Evidência não encontrada' });
    }

    const prompt = `
Você é um perito odontolegal. Abaixo estão os dados de uma evidência coletada. Gere um laudo técnico descritivo com base nessas informações:

🔍 Evidência:
- Tipo: ${evidencia.tipo}
- Título: ${evidencia.titulo || 'Sem título'}
- Descrição: ${evidencia.descricao || 'Sem descrição'}
- Local de coleta: ${evidencia.localColeta || 'Não informado'}
- Data de coleta: ${evidencia.dataColeta ? evidencia.dataColeta.toLocaleDateString() : 'Não informada'}
- Coletado por: ${evidencia.coletadoPor || 'Não informado'}

Evite uso de símbolos de formatação como asteriscos ou hashtags. Use linguagem técnica, formal e clara.
O laudo deve descrever tecnicamente a evidência, contextualizar sua importância para o caso e apresentar uma conclusão pericial.
`;

    const texto = await gerarTextoRelatorio(prompt);

    const novoLaudo = new Laudo({
      titulo,
      texto,
      evidence: evidenceId,
      peritoResponsavel,
    });

    await novoLaudo.save();

    res.status(201).json(novoLaudo);

  } catch (error) {
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