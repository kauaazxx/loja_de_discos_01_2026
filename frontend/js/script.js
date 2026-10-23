const API_URL = 'http://localhost:3000/api'; 

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const erroEl = document.getElementById('mensagemErro');

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
                    window.location.href = 'index.html';
                } else {
                    erroEl.textContent = data.mensagem || 'Erro ao realizar login.';
                }
            } catch (error) {
                erroEl.textContent = 'Erro de conexão com o servidor do back-end.';
            }
        });
    }

    const nomeUsuarioEl = document.getElementById('nomeUsuario');
    if (nomeUsuarioEl) {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (usuario) {
            nomeUsuarioEl.textContent = usuario.nome;
        } else {
            window.location.href = 'login.html'; 
        }

        document.getElementById('btnLogout').addEventListener('click', () => {
            localStorage.removeItem('usuarioLogado');
            window.location.href = 'login.html';
        });
    }

    const tabelaDiscosBody = document.getElementById('tabelaDiscosBody');
    if (tabelaDiscosBody) {
        carregarDiscos();

        document.getElementById('discoForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('discoId').value;
            const discoData = {
                titulo: document.getElementById('titulo').value,
                artista: document.getElementById('artista').value,
                genero: document.getElementById('genero').value,
                preco_custo: parseFloat(document.getElementById('preco_custo').value),
                preco_venda: parseFloat(document.getElementById('preco_venda').value),
                quantidade_estoque: parseInt(document.getElementById('quantidade_estoque').value),
                estoque_minimo: parseInt(document.getElementById('estoque_minimo').value)
            };

            const method = id ? 'PUT' : 'POST';
            const url = id ? `${API_URL}/discos/${id}` : `${API_URL}/discos`;

            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discoData)
            });

            document.getElementById('discoForm').reset();
            document.getElementById('discoId').value = '';
            carregarDiscos();
        });

        document.getElementById('btnBuscar').addEventListener('click', () => {
            const termo = document.getElementById('termoBusca').value;
            carregarDiscos(termo);
        });
    }

    const movimentacaoForm = document.getElementById('movimentacaoForm');
    if (movimentacaoForm) {
        carregarSelectDiscos();

        movimentacaoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
            
            const movimentacaoData = {
                id_disco: document.getElementById('selectDisco').value,
                id_usuario: usuario ? usuario.id_usuario : 1,
                tipo_movimentacao: document.getElementById('tipo_movimentacao').value,
                quantidade: parseInt(document.getElementById('qtdMovimentacao').value),
                data_movimentacao: document.getElementById('data_movimentacao').value,
                observacao: document.getElementById('observacao').value
            };

            const response = await fetch(`${API_URL}/movimentacoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movimentacaoData)
            });

            const resultado = await response.json();
            if (response.ok) {
                alert('Movimentação registrada com sucesso!');
                if (resultado.alertaEstoqueBaixo) {
                    document.getElementById('alertaEstoque').textContent = '⚠️ Alerta: Estoque ficou abaixo do mínimo configurado!';
                }
                movimentacaoForm.reset();
            } else {
                alert(resultado.mensagem || 'Erro ao registrar movimentação.');
            }
        });
    }
});

async function carregarDiscos(termo = '') {
    try {
        const url = termo ? `${API_URL}/discos/busca?termo=${encodeURIComponent(termo)}` : `${API_URL}/discos`;
        const response = await fetch(url);
        const discos = await response.json();
        
        const tbody = document.getElementById('tabelaDiscosBody');
        tbody.innerHTML = '';

        discos.forEach(disco => {
            tbody.innerHTML += `
                <tr>
                    <td>${disco.titulo}</td>
                    <td>${disco.artista}</td>
                    <td>${disco.genero}</td>
                    <td>R$ ${Number(disco.preco_venda).toFixed(2)}</td>
                    <td>${disco.quantidade_estoque}</td>
                    <td>${disco.estoque_minimo}</td>
                    <td>
                        <button onclick="preencherEdicao(${disco.id_disco}, '${disco.titulo}', '${disco.artista}', '${disco.genero}', ${disco.preco_custo}, ${disco.preco_venda}, ${disco.quantidade_estoque}, ${disco.estoque_minimo})" class="btn-secondary">Editar</button>
                        <button onclick="deletarDisco(${disco.id_disco})" class="btn-secondary" style="background:#fee2e2; color:#dc2626;">Excluir</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar discos:', error);
    }
}

function preencherEdicao(id, titulo, artista, genero, preco_custo, preco_venda, quantidade_estoque, estoque_minimo) {
    document.getElementById('discoId').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('artista').value = artista;
    document.getElementById('genero').value = genero;
    document.getElementById('preco_custo').value = preco_custo;
    document.getElementById('preco_venda').value = preco_venda;
    document.getElementById('quantidade_estoque').value = quantidade_estoque;
    document.getElementById('estoque_minimo').value = estoque_minimo;
}

async function deletarDisco(id) {
    if (confirm('Tem certeza que deseja excluir este disco?')) {
        await fetch(`${API_URL}/discos/${id}`, { method: 'DELETE' });
        carregarDiscos();
    }
}

async function carregarSelectDiscos() {
    try {
        const response = await fetch(`${API_URL}/discos`);
        const discos = await response.json();
        const select = document.getElementById('selectDisco');
        select.innerHTML = '<option value="">Selecione um disco</option>';
        
        discos.forEach(disco => {
            select.innerHTML += `<option value="${disco.id_disco}">${disco.titulo} - ${disco.artista} (Estoque: ${disco.quantidade_estoque})</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar select de discos:', error);
    }
}