require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');
const swaggerSpec = require('./documents/swagger');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRoutes = require('./routes/userRoutes');
const periciadoRoutes = require('./routes/periciadoRoutes');
const caseRoutes = require('./routes/casesRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const laudosRoutes = require('./routes/laudosRoutes');
const relatoriosRouts = require ('./routes/relatoriosRouts');
const dashboardRoutes = require('./routes/dashboardRoutes'); 
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3000', // ou qualquer que seja seu front local
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/periciados', periciadoRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/evidences', evidenceRoutes);
app.use('/api/laudos', laudosRoutes);
app.use('/api/relatorio', relatoriosRouts);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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
