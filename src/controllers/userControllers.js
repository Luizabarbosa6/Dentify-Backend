const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;


// Criar novo usuário
exports.createUser = async (req, res) => {
    try {
        const { name, cpf, email, password, confirmarSenha, role } = req.body;

        // Verifica se as senhas coincidem
        if (password !== confirmarSenha) {
            return res.status(400).json({ message: 'As senhas não coincidem.' });
        }

        let roleToAssign = 'assistente';
        if (req.user && req.user.role === 'admin' && role) {
            roleToAssign = role;
        }

        const existingUser = await User.findOne({ $or: [{ cpf }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'CPF ou e-mail já cadastrado.' });
        }

        const user = new User({ name, cpf, email, password, role: roleToAssign });
        await user.save();

        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); 
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

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

exports.login = async (req, res) => {
    const { cpf, password } = req.body;

    try {
        const user = await User.findOne({ cpf });
        if (!user) return res.status(400).json({ message: 'CPF não encontrado' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            SECRET_KEY,
            { expiresIn: '1d' }
        );

        // Define o token como um cookie seguro
        res.cookie("token", jwt, {
            httpOnly: true,
            secure: isProduction,         // só usa HTTPS em produção
            sameSite: isProduction ? "None" : "Lax",  // em localhost pode ser 'Lax'
          }); 
          
        // Também pode retornar o token no body se quiser (opcional)
        res.status(200).json({ 
            message: 'Login bem-sucedido',
            user: { 
                id: user._id, 
                name: user.name, 
                cpf: user.cpf, 
                role: user.role 
            }
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, cpf, email, password, confirmarSenha, role } = req.body;

        const updateData = { name, cpf, email };

        // Permite trocar o cargo somente se o usuário autenticado for admin
        if (req.user && req.user.role === 'admin' && role) {
            updateData.role = role;
        }

        if (password) {
            if (password !== confirmarSenha) {
                return res.status(400).json({ message: 'As senhas não coincidem.' });
            }

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
