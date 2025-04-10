require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const casoRoutes = require('./routes/cases.routes.js');
const authRoutes = require('./routes/auth.routes.js');



const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rotas
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem-vindo à API Dentfy!' });
});

app.use('/api/casos', casoRoutes);
app.use('/api/auth', authRoutes);

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
