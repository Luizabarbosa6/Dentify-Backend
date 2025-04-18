const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'evidencias',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Apenas JPG, JPEG e PNG são permitidos.'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;