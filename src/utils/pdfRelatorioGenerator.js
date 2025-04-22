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

  // Corpo do texto do relatório
  doc.fontSize(12).font('Times-Roman')
     .text(relatorio.conteudo, {
        align: 'justify',
        lineGap: 4
     });

  doc.moveDown(3);

  doc.font('Times-Roman')
    .text('________________________________________', { align: 'left' })
    .text(`${relatorio.peritoResponsavel?.name || 'Nome do Perito'}`, { align: 'left' })
    .text('Perito Odonto-Legal', { align: 'left' });
    doc.moveDown(2);
    doc.font('Times-Italic')
       .fontSize(10)
       .fillColor('gray')
       .text(`Este documento foi assinado digitalmente por ${relatorio.peritoResponsavel?.name || 'Nome do Perito'} em ${new Date().toLocaleString()}`, {
         align: 'left'
       });
    
  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      const buffer = Buffer.concat(buffers);
      resolve(buffer);
    });

    doc.on('error', (err) => {
      reject(err);
    });
  });
};
