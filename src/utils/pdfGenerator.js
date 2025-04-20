const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.gerarPDF = (laudo) => {
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

  // Dados do laudo
  doc.font('Times-Roman').fontSize(11)
  .text(`Registrado em: ${new Date(laudo.createdAt).toLocaleDateString()}`.toUpperCase())
  .text(`Laudo nº ${laudo._id}`.toUpperCase());

  doc.moveDown();

  // Título do laudo
  doc.fontSize(14).font('Times-Bold')
     .text(laudo.titulo.toUpperCase(), { align: 'center', underline: true });

  doc.moveDown();

  // Corpo do texto
  doc.fontSize(12).font('Times-Roman')
     .text(laudo.texto, {
        align: 'justify',
        lineGap: 4
     });

  doc.moveDown(3);

  // Rodapé com assinatura
  doc.font('Times-Roman')
     .text('________________________________________', { align: 'left' })
     .text(`${laudo.peritoResponsavel?.nome || 'Nome do Perito'}`, { align: 'left' })
     .text('Perito Odonto-Legal', { align: 'left' });


  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
  });
};
