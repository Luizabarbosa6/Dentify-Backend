const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.gerarPDF = (relatorio) => {
  const doc = new PDFDocument({ margin: 50 });
  let buffers = [];

  doc.on('data', buffers.push.bind(buffers));

  // Cabeçalho institucional
  doc.fontSize(12).font('Times-Bold')
    .text('GOVERNO DO ESTADO DE PERNAMBUCO', { align: 'center' })
    .text('POLÍCIA TÉCNICO-CIENTÍFICA', { align: 'center' })
    .text('DEPARTAMENTO DE MEDICINA LEGAL', { align: 'center' })
    .text('Setor de Odontologia Legal', { align: 'center' });

  doc.moveDown();

  // Dados do relatório
  doc.font('Times-Roman').fontSize(11)
    .text(`Registrado em: ${new Date(relatorio.createdAt).toLocaleDateString()}`.toUpperCase())
    .text(`Relatório nº ${relatorio._id}`.toUpperCase());

  doc.moveDown();

  // Título do relatório
  doc.fontSize(14).font('Times-Bold')
    .text(relatorio.titulo.toUpperCase(), { align: 'center', underline: true });

  doc.moveDown();

  // Informações do Caso relacionado
  const caso = relatorio.caso; // já populado
  if (caso) {
    doc.fontSize(12).font('Times-Roman')
      .text(`Caso nº: ${caso._id}`)
      .text(`Título do Caso: ${caso.titulo}`)
      .text(`Local: ${caso.local}`)
      .text(`Sexo: ${caso.sexo}`)
      .text(`Data de Abertura: ${new Date(caso.dataAbertura).toLocaleDateString()}`)
      .text(`Status: ${caso.status}`);

    doc.moveDown();
  }

  // Corpo do texto do relatório
  doc.fontSize(12).font('Times-Roman')
    .text(relatorio.texto, {
      align: 'justify',
      lineGap: 4
    });

  doc.moveDown(3);

  // Rodapé com assinatura
  doc.font('Times-Roman')
    .text('________________________________________', { align: 'left' })
    .text(`${relatorio.peritoResponsavel?.nome || 'Nome do Perito'}`, { align: 'left' })
    .text('Perito Odonto-Legal', { align: 'left' });

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
  });
};
