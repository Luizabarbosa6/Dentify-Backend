require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const casoRoutes = require('./routes/cases.routes.js');
const authRoutes = require('./routes/auth.routes.js');



const app = express();
const PORT = process.env.PORT || 3000;

app.use('/users', userRoutes);


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
