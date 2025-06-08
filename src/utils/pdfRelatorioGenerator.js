const PDFDocument = require('pdfkit');
const path = require('path');

const colors = {
  dentfyDarkBlue: '#0E1A26',
  dentfyAmber: '#F59E0B',
  dentfyGray500: '#6B7280',
  dentfyCyan: '#01777B',
};

exports.gerarPDF = (relatorio) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const buffers = [];

  const logoPath = path.join(__dirname, 'logo-dentify-preta.png');

  doc.on('data', buffers.push.bind(buffers));

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

  // LOGO
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

  
  // REGISTRO
  const dataCriacao = new Date(relatorio.dataCriacao).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).toUpperCase();

  doc.fontSize(10).font('Times-Roman').fillColor(colors.dentfyGray500)
    .text(`REGISTRADO EM: ${dataCriacao}`, { align: 'justify' })
    .text(`RELATÓRIO Nº ${relatorio._id}`.toUpperCase(), { align: 'justify' });

  doc.moveDown(1.8);

  // TÍTULO EM LARANJA
  doc.fontSize(12).font('Times-Bold').fillColor(colors.dentfyAmber)
    .text(relatorio.titulo.toUpperCase(), {
      align: 'center',
      underline: true,
    });

  doc.moveDown(1.2);

  // CORPO DO TEXTO (ALINHADO À ESQUERDA)
  doc.fontSize(11).font('Times-Roman').fillColor('black')
    .text(relatorio.conteudo, {
      align: 'justify',
      lineGap: 1,
      paragraphGap: 2,
    });

  doc.moveDown(2);

  // ASSINATURA
  doc.font('Times-Roman').fillColor(colors.dentfyCyan)
    .text('________________________________________', {
      align: 'center',
    });

  doc.fillColor('black')
    .font('Times-Roman')
    .text(`${relatorio.peritoResponsavel?.name || 'Nome do Perito'}`, {
      align: 'center',
    })
    .text('Perito Odonto-Legal', {
      align: 'center',
    });

  doc.moveDown(0.5);

  doc.font('Times-Italic').fontSize(9).fillColor(colors.dentfyGray500)
    .text(`Este documento foi assinado digitalmente por ${relatorio.peritoResponsavel?.name || 'Nome do Perito'} em ${new Date().toLocaleString('pt-BR')}`, {
      align: 'center',
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
