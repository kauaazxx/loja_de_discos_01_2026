
const mysql = require('mysql2');
require('dotenv').config();

const conexao = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'loja_discos_db'
});

conexao.connect((erro) => {
    if (erro) {
        console.log('Erro ao conectar ao MySQL:', erro.message);
        return;
    }

    console.log('Conectado ao banco loja_discos_db!');
});

module.exports = conexao;
