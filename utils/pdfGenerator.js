const PDFDocument = require('pdfkit');

exports.gerarPDF = (laudo) => {
  const doc = new PDFDocument();
  let buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.fontSize(18).text(laudo.titulo, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Data: ${laudo.dataCriacao}`);
  doc.text(`Responsável: ${laudo.peritoResponsavel?.nome || 'N/A'}`);
  doc.moveDown();
  doc.text(laudo.texto);
  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
  });
};
