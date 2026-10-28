const db = require('../config/db');

exports.login = (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            mensagem: 'Informe o e-mail e a senha.'
        });
    }

    const sql = `
        SELECT id_usuario, nome, email
        FROM USUARIO
        WHERE email = ? AND senha = ?
    `;

    db.query(sql, [email, senha], (err, results) => {
        if (err) {
            console.error('Erro no login:', err.message);

            return res.status(500).json({
                mensagem: 'Erro ao realizar login.'
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha inválidos.'
            });
        }

        return res.json({
            usuario: results[0]
        });
    });
};