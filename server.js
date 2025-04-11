require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const casoRoutes = require('./routes/casesRoutes.js');
const periciadoRoutes = require('./routes/periciadoRoutes');
const caseRoutes = require('./routes/casesRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const laudosRoutes = require('./routes/laudosRoutes');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/cases', casoRoutes);
app.use('/api/periciados', periciadoRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/evidences', evidenceRoutes);
app.use('/api/laudos', laudosRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Banco de dados conectado');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro de conexão:', err.message);
  });
