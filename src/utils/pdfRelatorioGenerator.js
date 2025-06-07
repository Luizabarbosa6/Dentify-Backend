const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const colors = {
  dentfyDarkBlue: '#0E1A26',
  dentfyAmber: '#F59E0B',
  dentfyTextPrimary: '#E5E7EB',
  dentfyGray500: '#6B7280',
  dentfyCyan: '#01777B',
};

exports.gerarPDF = (relatorio) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const buffers = [];

  const watermarkPath = path.join(__dirname, 'logo-dentify-preta.png');
  const logoPath = path.join(__dirname, 'logo-dentify-preta.png'); // Corrija o caminho

  doc.on('data', buffers.push.bind(buffers));

  // ✅ Só a marca d’água aqui!
 doc.on('pageAdded', () => {
  try {
    doc.save();
    doc.opacity(0.07);
    const watermarkWidth = 600;
    const imgX = (doc.page.width - watermarkWidth) / 2;
    const imgY = (doc.page.height - watermarkWidth) / 2;
    doc.image(watermarkPath, imgX, imgY, { width: watermarkWidth });
    doc.restore();
  } catch (e) {
    console.warn('⚠️ Marca d’água não aplicada em nova página:', e.message);
  }
});

// ✅ Marca d'água na 1ª página
try {
  doc.save();
  doc.opacity(0.07);
  const watermarkWidth = 600;
  const imgX = (doc.page.width - watermarkWidth) / 2;
  const imgY = (doc.page.height - watermarkWidth) / 2;
  doc.image(watermarkPath, imgX, imgY, { width: watermarkWidth });
  doc.restore();
} catch (e) {
  console.warn('⚠️ Marca d’água não aplicada na primeira página:', e.message);
}

  doc.fillColor(colors.dentfyDarkBlue)
    .fontSize(12).font('Times-Bold')
    .text('GOVERNO DO ESTADO DE PERNAMBUCO', { align: 'center' })
    .text('POLÍCIA TÉCNICO-CIENTÍFICA', { align: 'center' })
    .text('DEPARTAMENTO DE MEDICINA LEGAL', { align: 'center' })
    .text('Setor de Odontologia Legal', { align: 'center' });

  doc.moveDown();
  doc.lineWidth(1).strokeColor(colors.dentfyCyan)
    .moveTo(50, doc.y).lineTo(545, doc.y).stroke();

  doc.moveDown();

  // Informações
  doc.font('Times-Roman').fontSize(11).fillColor(colors.dentfyGray500)
    .text(`REGISTRADO EM: ${new Date(relatorio.dataCriacao).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    }).toUpperCase()}`, { align: 'left' })
    .text(`Relatório nº ${relatorio._id}`.toUpperCase(), { align: 'left' });

  doc.moveDown();

  // Título
  doc.fontSize(14).font('Times-Bold').fillColor(colors.dentfyAmber)
    .text(relatorio.titulo.toUpperCase(), { align: 'center', underline: true });

  doc.moveDown();

  // Corpo
  doc.fontSize(12).font('Times-Roman').fillColor(colors.dentfyDarkBlue)
    .text(relatorio.conteudo, {
      align: 'justify',
      lineGap: 4
    });

  doc.moveDown(2);

  // Assinatura
  doc.font('Times-Roman').fillColor(colors.dentfyCyan)
    .text('________________________________________', { align: 'left' });

  doc.fillColor(colors.dentfyDarkBlue)
    .text(`${relatorio.peritoResponsavel?.name || 'Nome do Perito'}`, { align: 'left' })
    .text('Perito Odonto-Legal', { align: 'left' });

  doc.moveDown(1);

  doc.font('Times-Italic').fontSize(10).fillColor(colors.dentfyGray500)
    .text(`Este documento foi assinado digitalmente por ${relatorio.peritoResponsavel?.name || 'Nome do Perito'} em ${new Date().toLocaleString()}`, {
      align: 'left'
    });

  // ✅ Rodapé manual na última linha da última página
  doc.fontSize(9).fillColor(colors.dentfyGray500)
    .text('Setor de Odontologia Legal - DML/PE • Documento gerado automaticamente', 50, 800, {
      align: 'center',
      width: 495
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
