require ('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json()); 
app.use(cors());

app.use('/users', userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Banco Conectado!'))
  .catch(err => {
    console.error('Erro de conexão:', err.message);
    
  });

app.listen(3000)