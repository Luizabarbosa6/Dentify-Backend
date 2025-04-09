require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json()); 
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem Vindo à API Dentify!' });
});

app.post('/', (req, res) => {  
  const { name, email, password } = req.body;

  if (!name) {
    return res.status(422).json({ msg: 'O nome é obrigatório' });
  }
  if (!email) {
    return res.status(422).json({ msg: 'O email é obrigatório' });
  }
  if (!password) {
    return res.status(422).json({ msg: 'A senha é obrigatória' });
  }

  return res.status(200).json({ msg: 'Usuário validado com sucesso!' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Banco Conectado!'))
  .catch(err => {
    console.error('Erro de conexão:', err.message);
  });

app.listen(3000);
