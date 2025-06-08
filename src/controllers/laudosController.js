const path = require('path');
const { gerarLegendaComBlip2 } = require('../utils/blip2Caption');
const { gerarTextoRelatorio } = require('../utils/gemini');
const { signPDFFile } = require('../utils/pdfSigner');
const Evidence = require('../models/evidence');
const Laudo = require('../models/laudos');
const axios = require('axios');
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

    if (!evidencia || !evidencia.imagemURL || !/^https?:\/\//.test(evidencia.imagemURL.trim())) {
      return res.status(404).json({ message: 'Evidência ou imagem não encontrada ou inválida' });
    }

    // 🧠 Gerar legenda da imagem via BLIP-2 (Replicate)
    let descricaoImagem = '';
    try {
      descricaoImagem = await gerarLegendaComBlip2(evidencia.imagemURL);
    } catch (err) {
      console.error("Erro ao gerar legenda com BLIP-2:", err);
      return res.status(500).json({ message: 'Erro ao gerar legenda da imagem (BLIP-2)', erro: err.message });
    }

    const prompt = `
Você é um perito odontolegal. Com base nas informações da evidência abaixo, elabore um laudo técnico odontolegal com linguagem formal, objetiva e tecnicamente estruturada.

Use a seguinte estrutura:

1. Introdução: Explique a finalidade do laudo e um breve resumo da evidência.
2. Descrição da Evidência: Descreva de forma clara e técnica a aparência da evidência, com base na descrição automática e nos metadados.
3. Análise Odontolegal: Apresente uma análise objetiva, considerando a relevância odontolegal da evidência, possíveis limitações e implicações técnicas.
4. Conclusão: Forneça uma conclusão clara sobre a utilidade odontolegal da evidência, sugerindo, se necessário, a coleta de mais informações.

INSTRUÇÕES IMPORTANTES:
- Não inclua campos como número do laudo, nome do perito, data de emissão ou qualquer identificação pessoal.
- Não utilize formatações como negrito, itálico, sublinhado, emojis, asteriscos ou hashtags.
- O texto gerado deve conter apenas o conteúdo técnico das quatro seções descritas.
- Escreva em linguagem impessoal, formal e clara.
- Evite frases genéricas ou vagas.
- Mencione a ausência de informações apenas se isso comprometer a análise técnica.

DADOS DA EVIDÊNCIA:
- Descrição automática da imagem: ${descricaoImagem}
- Tipo: ${evidencia.tipo}
- Título: ${evidencia.titulo || 'Sem título'}
- Descrição: ${evidencia.descricao || 'Sem descrição'}
- Local de coleta: ${evidencia.localColeta || 'Não informado'}
- Data de coleta: ${evidencia.dataColeta ? evidencia.dataColeta.toLocaleDateString() : 'Não informada'}
- Coletado por: ${evidencia.coletadoPor || 'Não informado'}
`;

    const texto = await gerarTextoRelatorio(prompt); // <-- continua usando Gemini aqui

    const novoLaudo = new Laudo({
      titulo,
      texto,
      evidence: evidenceId,
      peritoResponsavel,
    });

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