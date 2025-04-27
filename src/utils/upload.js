const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configuração do CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'evidencias', // Pasta dentro do Cloudinary onde os arquivos serão armazenados
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx'], // Tipos de arquivos permitidos
  },
});

// O upload usa o storage configurado para enviar para o Cloudinary
const upload = multer({ storage: storage });

module.exports = upload;
