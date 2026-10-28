
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const discoRoutes = require('./routes/discoRoutes');
const movRoutes = require('./routes/movRoutes');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensagem: 'API Loja de Discos funcionando!' });
});

app.use('/api', authRoutes);
app.use('/api/discos', discoRoutes);
app.use('/api/movimentacoes', movRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
