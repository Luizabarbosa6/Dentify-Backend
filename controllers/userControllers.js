const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Criar novo usuário
exports.createUser = async (req, res) => {
    try {
        const { name, cpf, email, password } = req.body;

        // Verifica se CPF ou e-mail já existem
        const existingUser = await User.findOne({ $or: [{ cpf }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'CPF ou e-mail já cadastrado.' });
        }

        const user = new User({ name, cpf, email, password });
        await user.save();

        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Listar todos os usuários
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Oculta senhas
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Buscar usuário por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Login com e-mail e senha
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

        res.status(200).json({ message: 'Login bem-sucedido', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Atualizar usuário
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, cpf, email, password } = req.body;

        const updateData = { name, cpf, email };

        if (password) {
           
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedUser) return res.status(404).json({ message: 'Usuário não encontrado' });

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Excluir usuário
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: 'Usuário não encontrado' });

        res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
