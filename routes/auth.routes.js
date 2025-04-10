const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(422).json({ msg: 'Todos os campos são obrigatórios' });
    }
  
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(422).json({ msg: 'Este e-mail já está cadastrado' });
    }
  
    const user = new User({ name, email, password });
  
    try {
      await user.save();
      res.status(201).json({ msg: 'Usuário registrado com sucesso' });
    } catch (error) {
      res.status(500).json({ msg: 'Erro ao registrar usuário', error });
    }
  });

module.exports = router;

  