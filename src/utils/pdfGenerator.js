const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path'); // ✅ Importação do path

exports.gerarPDF = (laudo) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  let buffers = [];

  doc.on('data', buffers.push.bind(buffers));

  // Marca d'água (imagem grande e centralizada no fundo)
  const watermarkPath = path.join(__dirname, 'logo-dentify-preta.png');
  try {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    doc.opacity(0.07);
    doc.image(watermarkPath, -150, 150, {
      width: 900,
      height: 900, // define altura forçada
      opacity: 0.07
    });
    doc.opacity(1);
  } catch (e) {
    console.warn('⚠️ Marca d’água não aplicada:', e.message);
  }

  // Cabeçalho institucional
  doc.fontSize(12).font('Times-Bold')
    .text('GOVERNO DO ESTADO DE PERNAMBUCO', { align: 'center' })
    .text('POLÍCIA TÉCNICO-CIENTÍFICA', { align: 'center' })
    .text('DEPARTAMENTO DE MEDICINA LEGAL', { align: 'center' })
    .text('Setor de Odontologia Legal', { align: 'center' });

  doc.moveDown();

  // Dados do laudo
  doc.font('Times-Roman').fontSize(11)
    .text(`REGISTRADO EM: ${new Date(laudo.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).toUpperCase()}`)
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

  // Assinatura
  doc.font('Times-Roman')
    .text('________________________________________', { align: 'left' })
    .text(`${laudo.peritoResponsavel?.name || 'Nome do Perito'}`, { align: 'left' })
    .text('Perito Odonto-Legal', { align: 'left' });

  doc.moveDown(2);

  doc.font('Times-Italic')
    .fontSize(10)
    .fillColor('gray')
    .text(`Este documento foi assinado digitalmente por ${laudo.peritoResponsavel?.name || 'Nome do Perito'} em ${new Date().toLocaleString()}`, {
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
