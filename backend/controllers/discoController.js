const db = require('../config/db');

exports.listarDiscos = (req, res) => {
    const termo = req.query.termo;

    let sql = 'SELECT * FROM DISCO';
    let parametros = [];

    if (termo) {
        sql += `
            WHERE titulo LIKE ?
            OR artista LIKE ?
            OR genero LIKE ?
        `;

        const busca = `%${termo}%`;
        parametros = [busca, busca, busca];
    }

    sql += ' ORDER BY titulo ASC';

    db.query(sql, parametros, (err, results) => {
        if (err) {
            console.error('Erro ao buscar discos:', err.message);

            return res.status(500).json({
                mensagem: 'Erro ao buscar discos.'
            });
        }

        res.json(results);
    });
};

exports.criarDisco = (req, res) => {
    const {
        titulo,
        artista,
        genero,
        preco_custo,
        preco_venda,
        quantidade_estoque,
        estoque_minimo
    } = req.body;

    if (
        !titulo ||
        !artista ||
        !genero ||
        preco_custo == null ||
        preco_venda == null ||
        quantidade_estoque == null ||
        estoque_minimo == null
    ) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos obrigatórios.'
        });
    }

    if (
        !Number.isFinite(Number(preco_custo)) ||
        !Number.isFinite(Number(preco_venda)) ||
        Number(preco_custo) < 0 ||
        Number(preco_venda) < 0 ||
        !Number.isInteger(Number(quantidade_estoque)) ||
        !Number.isInteger(Number(estoque_minimo)) ||
        Number(quantidade_estoque) < 0 ||
        Number(estoque_minimo) < 0
    ) {
        return res.status(400).json({
            mensagem: 'Informe preços e quantidades válidos.'
        });
    }

    const sql = `
        INSERT INTO DISCO
        (
            titulo,
            artista,
            genero,
            preco_custo,
            preco_venda,
            quantidade_estoque,
            estoque_minimo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        titulo,
        artista,
        genero,
        Number(preco_custo),
        Number(preco_venda),
        Number(quantidade_estoque),
        Number(estoque_minimo)
    ];

    db.query(sql, valores, (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar disco:', err.message);

            return res.status(500).json({
                mensagem: 'Erro ao cadastrar disco.'
            });
        }

        res.status(201).json({
            mensagem: 'Disco cadastrado com sucesso!',
            id_disco: result.insertId
        });
    });
};

exports.atualizarDisco = (req, res) => {
    const { id } = req.params;

    const {
        titulo,
        artista,
        genero,
        preco_custo,
        preco_venda,
        quantidade_estoque,
        estoque_minimo
    } = req.body;

    if (
        !Number.isInteger(Number(id)) ||
        Number(id) <= 0 ||
        !titulo ||
        !artista ||
        !genero ||
        preco_custo == null ||
        preco_venda == null ||
        quantidade_estoque == null ||
        estoque_minimo == null
    ) {
        return res.status(400).json({
            mensagem: 'Informe um ID e todos os campos válidos.'
        });
    }

    if (
        !Number.isFinite(Number(preco_custo)) ||
        !Number.isFinite(Number(preco_venda)) ||
        Number(preco_custo) < 0 ||
        Number(preco_venda) < 0 ||
        !Number.isInteger(Number(quantidade_estoque)) ||
        !Number.isInteger(Number(estoque_minimo)) ||
        Number(quantidade_estoque) < 0 ||
        Number(estoque_minimo) < 0
    ) {
        return res.status(400).json({
            mensagem: 'Informe preços e quantidades válidos.'
        });
    }

    const sql = `
        UPDATE DISCO
        SET titulo = ?,
            artista = ?,
            genero = ?,
            preco_custo = ?,
            preco_venda = ?,
            quantidade_estoque = ?,
            estoque_minimo = ?
        WHERE id_disco = ?
    `;

    const valores = [
        titulo,
        artista,
        genero,
        Number(preco_custo),
        Number(preco_venda),
        Number(quantidade_estoque),
        Number(estoque_minimo),
        Number(id)
    ];

    db.query(sql, valores, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar disco:', err.message);

            return res.status(500).json({
                mensagem: 'Erro ao atualizar disco.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Disco não encontrado.'
            });
        }

        res.json({
            mensagem: 'Disco atualizado com sucesso!'
        });
    });
};

exports.deletarDisco = (req, res) => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({
            mensagem: 'ID do disco inválido.'
        });
    }

    const sql = 'DELETE FROM DISCO WHERE id_disco = ?';

    db.query(sql, [Number(id)], (err, result) => {
        if (err) {
            console.error('Erro ao excluir disco:', err.message);

            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    mensagem:
                        'Não é possível excluir este disco porque existem movimentações registradas.'
                });
            }

            return res.status(500).json({
                mensagem: 'Erro ao excluir disco.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Disco não encontrado.'
            });
        }

        res.json({
            mensagem: 'Disco excluído com sucesso!'
        });
    });
};