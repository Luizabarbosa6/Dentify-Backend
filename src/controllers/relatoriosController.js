const Relatorio = require('../models/relatorios');
const Case = require('../models/cases');
const { gerarTextoRelatorio } = require('../utils/gemini');
const Evidence = require('../models/evidence');
const Laudo = require('../models/laudos');
const Periciado = require('../models/periciado');
const { signPDFFile } = require('../utils/pdfSigner');
const { gerarPDF } = require('../utils/pdfRelatorioGenerator');

exports.createRelatorio = async (req, res) => {
  try {
    const { caso: casoId, titulo, peritoResponsavel } = req.body;

    const caso = await Case.findById(casoId);
    const evidencias = await Evidence.find({ caso: casoId });
    const laudos = await Laudo.find().populate('evidence');
    const periciado = await Periciado.findOne({ caso: casoId });

    if (!caso) {
      return res.status(404).json({ message: 'Caso não encontrado' });
    }

    // Montar o prompt para o Gemini
    const prompt = `
Você é um perito odontolegal. Com base nas informações a seguir, elabore um relatório técnico com linguagem formal, objetiva e tecnicamente estruturada.

Informações do caso:
- Título: ${caso.titulo}
- Descrição: ${caso.descricao}
- Tipo: ${caso.tipo}
- Responsável: ${caso.responsavel}
- Status: ${caso.status}
- Local: ${caso.local}

Dados do periciado:
${periciado ? `
- Nome: ${periciado.nomeCompleto}
- Sexo: ${periciado.sexo}
- NIC: ${periciado.nic}
- CPF: ${periciado.cpf}
- Data de nascimento: ${periciado.dataNascimento.toLocaleDateString()}
${periciado.odontograma && periciado.odontograma.length > 0
  ? `- Odontograma:\n${periciado.odontograma.map((dente, i) => `  • Dente ${dente.numero}: ${dente.descricao}`).join('\n')}`
  : '- Odontograma: Não informado'}
` : 'Nenhum periciado cadastrado.'}


Evidências coletadas:
${evidencias.map(ev => `- ${ev.tipo.toUpperCase()}: ${ev.titulo || 'Sem título'} (${ev.descricao})`).join('\n')}

Laudos relacionados:
${laudos.map(laudo => `- ${laudo.titulo}: ${laudo.texto}`).join('\n')}

Elabore o relatório técnico com base nas informações acima, organizando o conteúdo nas seguintes seções:

1. Resumo do Caso: apresente uma visão geral dos dados do caso.
2. Identificação do Periciado: descreva os dados relevantes do indivíduo periciado (se disponíveis).
3. Análise das Evidências: detalhe tecnicamente as evidências coletadas e sua relevância para o caso.
4. Considerações com base nos laudos: relacione os laudos com as evidências e com o caso.
5. Conclusão Técnica: apresente uma conclusão formal e objetiva sobre o andamento ou estado do caso com base nos dados disponíveis.

INSTRUÇÕES IMPORTANTES:
- A saída deve ser em texto puro, sem qualquer formatação Markdown.
- Não use asteriscos (*), hashtags (#), negrito, itálico ou emojis.
- Utilize apenas texto corrido, com títulos em caixa alta ou numerados.
- Não insira marcações visuais de destaque, apenas estrutura técnica e formal.
- Caso alguma informação esteja ausente e isso comprometa a análise, registre essa ausência de forma técnica e objetiva.
`;


    const conteudo = await gerarTextoRelatorio(prompt);

    const novoRelatorio = new Relatorio({
      titulo,
      conteudo,
      caso: casoId,
      peritoResponsavel
    });

    caso.status = 'Finalizado';
    caso.dataFechamento = new Date();
    await caso.save();

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

