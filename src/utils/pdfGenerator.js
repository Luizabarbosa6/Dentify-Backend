const PDFDocument = require('pdfkit');
const path = require('path');

const colors = {
  dentfyDarkBlue: '#0E1A26',
  dentfyAmber: '#F59E0B',
  dentfyTextPrimary: '#E5E7EB',
  dentfyGray500: '#6B7280',
  dentfyCyan: '#01777B',
};

exports.gerarPDF = (laudo) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const buffers = [];

  const logoPath = path.join(__dirname, 'logo-dentify-preta.png');

  doc.on('data', buffers.push.bind(buffers));

  // Marca d’água em todas as páginas
  const applyWatermark = () => {
    try {
      doc.save();
      doc.opacity(0.07);
      const watermarkWidth = doc.page.width * 1.5;
      const imgX = (doc.page.width - watermarkWidth) / 2;
      const imgY = (doc.page.height - watermarkWidth) / 2;
      doc.image(logoPath, imgX, imgY, { width: watermarkWidth });
      doc.restore();
    } catch (e) {
      console.warn('⚠️ Marca d’água não aplicada:', e.message);
    }
  };

  applyWatermark();
  doc.on('pageAdded', applyWatermark);

  // Header com logo + texto alinhado ao centro
   doc.image(logoPath, 50, 37, { width: 70 });

  // CABEÇALHO
  doc.fontSize(12).font('Times-Bold').fillColor(colors.dentfyDarkBlue)
    .text('GOVERNO DO ESTADO DE PERNAMBUCO', { align: 'center' })
    .text('POLÍCIA TÉCNICO-CIENTÍFICA', { align: 'center' })
    .text('DEPARTAMENTO DE MEDICINA LEGAL', { align: 'center' })
    .text('Setor de Odontologia Legal', { align: 'center' });

  doc.moveDown(0.3);
  doc.lineWidth(1).strokeColor(colors.dentfyCyan)
    .moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(2);


  // Dados do laudo
    doc.fontSize(10).font('Times-Roman').fillColor(colors.dentfyGray500)
    .text(`REGISTRADO EM: ${laudo.createdAt}`, { align: 'justify' })
    .text(`RELATÓRIO Nº ${laudo._id}`.toUpperCase(), { align: 'justify' });

  doc.moveDown(1.8);


  // Título do laudo
  doc.fontSize(12).font('Times-Bold').fillColor(colors.dentfyAmber)
    .text(laudo.titulo.toUpperCase(), {
      align: 'center',
      underline: true,
    });

  doc.moveDown(1.2);


  // Texto principal
   doc.fontSize(11).font('Times-Roman').fillColor('black')
    .text(laudo.texto, {
      align: 'justify',
      lineGap: 1,
      paragraphGap: 2,
    });

  doc.moveDown(2);

  // Assinatura
 doc.font('Times-Roman').fillColor(colors.dentfyCyan)
    .text('________________________________________', {
      align: 'center',
    });

  doc.fillColor(colors.dentfyDarkBlue)
    .text(`${laudo.peritoResponsavel?.name || 'Nome do Perito'}`, { align: 'center' })
    .text('Perito Odonto-Legal', { align: 'center' });

  doc.moveDown(1);

  doc.font('Times-Italic').fontSize(10).fillColor(colors.dentfyGray500)
    .text(`Este documento foi assinado digitalmente por ${laudo.peritoResponsavel?.name || 'Nome do Perito'} em ${new Date().toLocaleString()}`, {
      align: 'center'
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
