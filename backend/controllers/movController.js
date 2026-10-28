const db = require('../config/db');

exports.registrarMovimentacao = (req, res) => {
    const {
        id_disco,
        id_usuario,
        tipo_movimentacao,
        quantidade,
        data_movimentacao,
        observacao
    } = req.body;

    if (
        !Number.isInteger(Number(id_disco)) ||
        Number(id_disco) <= 0 ||
        !Number.isInteger(Number(id_usuario)) ||
        Number(id_usuario) <= 0 ||
        !['REPOSICAO', 'VENDA'].includes(tipo_movimentacao) ||
        !Number.isInteger(Number(quantidade)) ||
        Number(quantidade) <= 0 ||
        !data_movimentacao ||
        Number.isNaN(Date.parse(data_movimentacao)) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data_movimentacao)
    ) {
        return res.status(400).json({
            mensagem: 'Informe os dados da movimentação corretamente.'
        });
    }

    const sqlDisco = `
        SELECT quantidade_estoque, estoque_minimo
        FROM DISCO
        WHERE id_disco = ?
    `;

    db.query(sqlDisco, [Number(id_disco)], (err, results) => {
        if (err) {
            console.error('Erro ao consultar estoque:', err.message);

            return res.status(500).json({
                mensagem: 'Erro ao consultar estoque.'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                mensagem: 'Disco não encontrado.'
            });
        }

        const disco = results[0];
        const estoqueAtual = Number(disco.quantidade_estoque);
        const estoqueMinimo = Number(disco.estoque_minimo);
        const qtd = Number(quantidade);

        let novoEstoque;

        if (tipo_movimentacao === 'REPOSICAO') {
            novoEstoque = estoqueAtual + qtd;
        } else {
            if (qtd > estoqueAtual) {
                return res.status(400).json({
                    mensagem: 'Estoque insuficiente para realizar a venda.'
                });
            }

            novoEstoque = estoqueAtual - qtd;
        }

        const sqlAtualizar = `
            UPDATE DISCO
            SET quantidade_estoque = ?
            WHERE id_disco = ?
        `;

        db.query(
            sqlAtualizar,
            [novoEstoque, Number(id_disco)],
            (err) => {
                if (err) {
                    console.error('Erro ao atualizar estoque:', err.message);

                    return res.status(500).json({
                        mensagem: 'Erro ao atualizar estoque.'
                    });
                }

                const sqlMovimentacao = `
                    INSERT INTO MOVIMENTACAO_ESTOQUE
                    (
                        id_disco,
                        id_usuario,
                        tipo_movimentacao,
                        quantidade,
                        data_movimentacao,
                        observacao
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                const valores = [
                    Number(id_disco),
                    Number(id_usuario),
                    tipo_movimentacao,
                    qtd,
                    data_movimentacao,
                    observacao || null
                ];

                db.query(sqlMovimentacao, valores, (err, result) => {
                    if (err) {
                        console.error(
                            'Erro ao registrar movimentação:',
                            err.message
                        );

                        return res.status(500).json({
                            mensagem:
                                'Erro ao registrar movimentação. Verifique o banco de dados.'
                        });
                    }

                    const resposta = {
                        mensagem: 'Movimentação registrada com sucesso!',
                        id_movimentacao: result.insertId,
                        estoque_anterior: estoqueAtual,
                        estoque_atual: novoEstoque
                    };

                    if (
                        tipo_movimentacao === 'VENDA' &&
                        novoEstoque < estoqueMinimo
                    ) {
                        resposta.alerta =
                            'Atenção: o estoque está abaixo do mínimo configurado.';
                    }

                    res.status(201).json(resposta);
                });
            }
        );
    });
};